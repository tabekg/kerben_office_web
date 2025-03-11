import commaNumber from 'comma-number'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Modal,
  Row,
} from 'react-bootstrap'
import {MdDeleteOutline} from 'react-icons/md'
import requester from '../utils/requester'
import TransactionModal from './TransactionModal'
import {exportToExcel} from '../utils/generat-excel'
import {
  formatDateDDMMYYYY,
  formatDateForInput,
  parseDate,
} from '../utils/parsers'
import {IInvoice, ITransaction} from '../types'

export default function InvoicesComponent({
  title,
  name,
}: {
  title: string
  name: string
}) {
  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showModal2, setShowModal2] = useState(false)

  const [newInvoice, setNewInvoice] = useState({
    date: '',
    number: '',
    sum: 0,
    comm: 0,
  })

  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('')

  const [items, setItems] = useState<IInvoice[]>(() => {
    const storedItems = localStorage.getItem('__' + name)
    if (storedItems) {
      return JSON.parse(storedItems)
        .sort(function (a: IInvoice, b: IInvoice) {
          const a_ = a?.date?.split('.').reverse().join('')
          const b_ = b?.date?.split('.').reverse().join('')
          if (!a_ || !b_) {
            return 0
          }
          return a_ > b_ ? 1 : a_ < b_ ? -1 : 0
        })
        .map((g: IInvoice, i: number) => {
          return {
            ...g,
            transactions: (g.transactions || []).map((t, it) => ({
              ...t,
              id: t.id || it + 1,
            })),
            id: g.id || i + 1,
            isHidden: !!g.isHidden,
          }
        })
    }
    return []
  })

  useEffect(() => {
    if (items && items.length > 0) {
      requester
        .post('/office/invoices' + (name === 'invoices' ? '' : '/' + name), {
          data: items,
        })
        .then((res) => {
          console.log(res)
        })
        .catch((e) => console.log(e))
    } else {
      // requester
      //   .get('/office/invoices')
      //   .then((res) => {
      //     if (res.status === 'success') {
      //       setItems()
      //     }
      //   })
      //   .catch((e) => window.alert('Ошибка: ' + e))
    }

    if (items.length < 1) {
      return
    }
    localStorage.setItem('__' + name, JSON.stringify(items))
    const items_sync = JSON.parse(
      localStorage.getItem('__' + name + '_sync') || '[]'
    )
    if (
      items_sync.length < 1 ||
      JSON.stringify(items) !==
        JSON.stringify(items_sync[items_sync.length - 1])
    ) {
      localStorage.setItem(
        '__' + name + '_sync',
        JSON.stringify([...items_sync, items])
      )
    }
  }, [items, name])

  const [searchInput, setSearchInput] = useState('')

  const createInvoice = useCallback(() => {
    if (items.findIndex((g) => g.number === newInvoice.number) > -1) {
      window.alert('Квитанция уже существует!')
      return
    }

    setItems((prevItems) => {
      const newInvoiceEntry: IInvoice = {
        id: (prevItems[prevItems.length - 1]?.id || 0) + 1 || 1,
        date: newInvoice.date,
        number: newInvoice.number,
        sum: newInvoice.sum,
        isHidden: false,
        comm: newInvoice.comm,
        total: newInvoice.sum + newInvoice.comm,
        left: newInvoice.sum,
        transactions: [],
      }

      return [...prevItems, newInvoiceEntry]
    })
    setShowModal(false)
    setNewInvoice({date: '', number: '', sum: 0, comm: 0})
  }, [items, newInvoice])

  const isFormValid = useMemo(() => {
    return (
      newInvoice.date &&
      newInvoice.number &&
      newInvoice.sum > 0 &&
      newInvoice.comm >= 0
    )
  }, [newInvoice])

  const createTransaction = useCallback((invoiceNumber: string) => {
    setCurrentInvoiceNumber(invoiceNumber)
    setShowTransactionModal(true)
  }, [])

  const saveTransaction = useCallback(
    (transaction: Omit<ITransaction, 'id'>) => {
      setShowTransactionModal(false)
      setItems((prevItems) =>
        prevItems.map((invoice) => {
          if (invoice.number === currentInvoiceNumber) {
            const newTransaction: ITransaction = {
              ...transaction,
              id:
                (invoice.transactions[invoice.transactions.length - 1]?.id ||
                  0) + 1 || 1,
            }
            return {
              ...invoice,
              left: invoice.left - transaction.sum,
              transactions: [...invoice.transactions, newTransaction],
            }
          }
          return invoice
        })
      )
    },
    [currentInvoiceNumber, setItems]
  )

  const totalLeft = useMemo(() => {
    return (items || [])
      .filter((g) => !g.isHidden)
      .reduce((a, b) => a + (b.left || 0), 0)
  }, [items])

  const renderList = useMemo(() => {
    let items_ = (items || []).filter((g) =>
      showHiddenItems ? g.isHidden : !g.isHidden
    )

    if (searchInput) {
      items_ = items_.filter((g) => g.number.includes(searchInput))
    }

    return items_
  }, [items, showHiddenItems, searchInput])

  const toggleHidden = useCallback(
    (invoiceId: string) => {
      setItems((prevItems) =>
        (prevItems || []).map((invoice) =>
          invoice.number === invoiceId
            ? {...invoice, isHidden: !invoice.isHidden}
            : invoice
        )
      )
    },
    [setItems]
  )

  const sendWARemainings = useCallback(() => {
    const confirmMessage = 'Вы уверены, что хотите отправить?'
    if (!window.confirm(confirmMessage)) {
      return
    }

    const list = items.filter((g) => !g.isHidden)
    const remaining = list.reduce((a, b) => a + b.left, 0)
    const content =
      `${'Kerben Остаток'} (${title})\n\n` +
      list
        .map((g) => `${g.number}: ${commaNumber(g.left)} ${'сом'}`)
        .join('\n') +
      `\n\n${'Всего остаток'}: ${commaNumber(remaining)} ${'сом'}`

    ;['996777171171', '996507454411', '996777599577', '996999466000'].forEach(
      (phoneNumber) => {
        requester
          .post('/office/wa-send-message', {
            content,
            phone_number: phoneNumber,
          })
          .then((res) => console.log(res))
          .catch((e) => console.error(e))
      }
    )
  }, [items, title])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setNewInvoice((prev) => ({
      ...prev,
      [name]: name === 'sum' || name === 'comm' ? Number(value) : value,
    }))
  }

  const deleteTransaction = useCallback(
    (invoiceId: number, transactionId: number) => {
      if (!window.confirm('Вы уверены, что хотите удалить?')) {
        return
      }

      setItems((prevItems) =>
        prevItems.map((invoice) => {
          if (invoice.id === invoiceId) {
            const deletedTransaction = invoice.transactions.find(
              (t) => t.id === transactionId
            )
            return {
              ...invoice,
              left: invoice.left + (deletedTransaction?.sum || 0),
              transactions: invoice.transactions.filter(
                (t) => t.id !== transactionId
              ),
            }
          }
          return invoice
        })
      )
    },
    [setItems]
  )

  const [date, setDate] = useState<{start: Date | null; end: Date | null}>({
    start: null,
    end: null,
  })

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setDate((prevState) => ({
      ...prevState,
      [name]: parseDate(value),
    }))
  }

  const formattedData = useMemo(() => {
    if (date.start === null || date.end === null) {
      return []
    }

    return items.filter((el: any) => {
      const itemDate = parseDate(el.date || '')?.getTime()
      if (!itemDate) {
        return false
      }
      return (
        itemDate >= date.start!.getTime() && itemDate <= date.end!.getTime()
      )
    })
  }, [items, date])

  const handleExportToExcel = useCallback(() => {
    exportToExcel(
      formattedData,
      `Квитанции ${title} с ${formatDateDDMMYYYY(
        date.start!
      )} по ${formatDateDDMMYYYY(date.end!)}`
    )
    setShowModal2(false)
    setDate({start: null, end: null})
  }, [formattedData, date, title])

  return (
    <>
      <TransactionModal
        name={name}
        show={showTransactionModal}
        onHide={() => setShowTransactionModal(false)}
        invoiceNumber={currentInvoiceNumber}
        onSave={saveTransaction}
      />

      <div
        style={{backgroundColor: 'white', flexGrow: 1, gap: 0}}
        className='p-3'
      >
        <div className='d-flex justify-content-between gap-5 mb-3 align-items-center'>
          <div className='d-flex gap-3'>
            <h1 className='h3 text-muted'>
              Квитанции {title} ({renderList.length})
            </h1>
            <Button onClick={sendWARemainings} variant='secondary'>
              Отправить остаток
            </Button>
            {renderList.length > 0 ? (
              <Button
                onClick={() => {
                  setShowModal2(true)
                }}
                variant='secondary'
              >
                Экспорт в Excel
              </Button>
            ) : null}
          </div>
          <div className='d-flex justify-content-end align-items-center gap-3'>
            <Form.Check
              checked={showHiddenItems}
              onChange={(t) => setShowHiddenItems(t.target.checked)}
              type={'checkbox'}
              id={`showIsHIddenItems`}
              style={{whiteSpace: 'nowrap'}}
              label={`Только скрытые`}
            />
            <div style={{whiteSpace: 'nowrap'}}>
              Всего остаток: <strong>{commaNumber(totalLeft, '.')}</strong> сом
            </div>

            <InputGroup style={{minWidth: 100, maxWidth: 300}}>
              <Form.Control
                placeholder={'Поиск'}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
            <Button
              style={{whiteSpace: 'nowrap'}}
              onClick={() => setShowModal(true)}
            >
              Новая квитанция
            </Button>
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Создать новую квитанцию</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='formDate'>
                <Form.Label>Дата</Form.Label>
                <Form.Control
                  type='date'
                  name='date'
                  value={newInvoice.date}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId='formNumber'>
                <Form.Label>Номер</Form.Label>
                <Form.Control
                  type='text'
                  name='number'
                  value={newInvoice.number}
                  onChange={handleChange}
                  placeholder='Введите номер'
                />
              </Form.Group>
              <Form.Group controlId='formSum'>
                <Form.Label>Сумма</Form.Label>
                <Form.Control
                  type='number'
                  name='sum'
                  value={newInvoice.sum}
                  onChange={handleChange}
                  placeholder='Введите сумму'
                />
              </Form.Group>
              <Form.Group controlId='formComm'>
                <Form.Label>Комиссия</Form.Label>
                <Form.Control
                  type='number'
                  name='comm'
                  value={newInvoice.comm}
                  onChange={handleChange}
                  placeholder='Введите комиссию'
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Закрыть
            </Button>
            <Button
              variant='primary'
              onClick={createInvoice}
              disabled={!isFormValid}
            >
              Создать
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showModal2} onHide={() => setShowModal2(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Создать экспорт</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId='formDate'>
                <Form.Label>Дата с</Form.Label>
                <Form.Control
                  type='date'
                  name='start'
                  value={date.start ? formatDateForInput(date.start) : ''}
                  onChange={handleChangeDate}
                  // min={items[0]?.date}
                  // max={items[items.length - 1]?.date}
                />
              </Form.Group>
              <Form.Group controlId='formDate'>
                <Form.Label>Дата по</Form.Label>
                <Form.Control
                  type='date'
                  name='end'
                  value={date.end ? formatDateForInput(date.end) : ''}
                  onChange={handleChangeDate}
                  // min={date.start ? date.start : items[0]?.date}
                  // max={items[items.length - 1]?.date}
                />
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal2(false)}>
              Закрыть
            </Button>
            <Button
              variant='primary'
              disabled={!date.start || !date.end}
              onClick={handleExportToExcel}
            >
              Экспорт
            </Button>
          </Modal.Footer>
        </Modal>

        <Row>
          {renderList.map((g) => (
            <Col
              sm={6}
              md={3}
              xl={2}
              className='align-self-stretch mb-4'
              key={g.id}
            >
              <Card style={{height: '100%'}}>
                <Card.Body>
                  <Card.Title>
                    <Button
                      className='me-3'
                      size='sm'
                      variant='secondary'
                      onClick={() => toggleHidden(g.number)}
                    >
                      С/П
                    </Button>
                    {g.date} #{g.number}
                    <div>
                      {commaNumber(g.left)} сом /{' '}
                      {commaNumber(g.total - g.comm)} сом
                    </div>
                  </Card.Title>
                  <ListGroup variant='flush'>
                    {g.transactions.map((o) => (
                      <ListGroup.Item
                        className='d-flex justify-content-between align-items-center'
                        key={o.id}
                      >
                        <div>
                          {' '}
                          {o.date}: {commaNumber(o.sum)} сом{' '}
                          {o.comment && (
                            <div style={{fontSize: '0.8rem', color: 'gray'}}>
                              {o.comment}
                            </div>
                          )}
                        </div>
                        {!g.isHidden && (
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => deleteTransaction(g.id!, o.id!)}
                          >
                            <MdDeleteOutline />
                          </Button>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className='d-flex justify-content-end align-items-center mt-3'>
                    {!g.isHidden && (
                      <Button
                        variant='secondary'
                        onClick={() => {
                          createTransaction(g.number)
                        }}
                      >
                        Новая транзакция
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  )
}
