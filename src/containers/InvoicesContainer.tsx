import {useTranslation} from 'react-i18next'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {
  InputGroup,
  Form,
  Card,
  Row,
  Col,
  ListGroup,
  Button,
  Modal,
} from 'react-bootstrap'
import {MdDeleteOutline} from 'react-icons/md'
import requester from '../utils/requester'
interface ITransaction {
  id?: number
  date: string
  sum: number
}

interface IInvoice {
  id?: number
  date?: string
  number: string
  sum: number
  comm: number
  total: number
  left: number
  isHidden?: boolean
  transactions: ITransaction[]
}

export default function InvoicesContainer() {
  const {t} = useTranslation()

  const [showHiddenItems, setShowHiddenItems] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [newInvoice, setNewInvoice] = useState({
    date: '',
    number: '',
    sum: 0,
    comm: 0,
  })

  const [items, setItems] = useState<IInvoice[]>(
    JSON.parse(localStorage.getItem('__invoices') || '[]')
      .sort(function (a: IInvoice, b: IInvoice) {
        const a_ = a?.date?.split('.').reverse().join('')
        const b_ = b?.date?.split('.').reverse().join('')
        if (!a_ || !b_) {
          return 0
        }
        return a_ > b_ ? 1 : a_ < b_ ? -1 : 0
        // return a.localeCompare(b);         // <-- alternative
      })
      .map((g: IInvoice) => ({
        ...g,
        transactions: g.transactions || [],
        isHidden: !!g.isHidden,
      }))
      .map((g: IInvoice, i: number) => {
        return {
          ...g,
          transactions: g.transactions.map((t, it) => ({
            ...t,
            id: t.id || it + 1,
          })),
          id: g.id || i + 1,
        }
      })
  )

  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    if (items && items.length > 0) {
      requester
        .post('/office/invoices', {data: items})
        .then((res) => {
          console.log(res)
        })
        .catch((e) => window.alert('Ошибка: ' + e))
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
  }, [items])

  useEffect(() => {
    if (items.length < 1) {
      return
    }
    localStorage.setItem('__invoices', JSON.stringify(items))
    const items_sync = JSON.parse(
      localStorage.getItem('__invoices_sync') || '[]'
    )
    if (
      items_sync.length < 1 ||
      JSON.stringify(items) !==
        JSON.stringify(items_sync[items_sync.length - 1])
    ) {
      localStorage.setItem(
        '__invoices_sync',
        JSON.stringify([...items_sync, items])
      )
    }
  }, [items])

  
  const createInvoice = useCallback(() => {
    if (items.findIndex((g) => g.number === newInvoice.number) > -1) {
      window.alert('Квитанция уже существует!')
      return
    }
    // const date = window.prompt('Date?')
    // const number = window.prompt('Number?') || 'Untitled'

    // const sum = Math.floor(+(window.prompt('Sum?') || 0))
    // const comm = Math.floor(+(window.prompt('Comm?') || 0))

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

      const updatedItems = [...prevItems, newInvoiceEntry]

      setShowModal(false) 

      return updatedItems 
    })

    setNewInvoice({
      date: '',
      number: '',
      sum: 0,
      comm: 0,
    })
  }, [items, newInvoice])

  const createTransaction = useCallback((invoiceNumber: string) => {
    const date = window.prompt('Date?') || 'No date'
    const sum = Math.floor(+(window.prompt('Sum?') || 0))

    setItems((p) => {
      return p.map((g) => {
        if (g.number != invoiceNumber) {
          return g
        }
        g.transactions = [
          ...g.transactions,
          {
            date,
            sum,
            id: (g.transactions[g.transactions.length - 1]?.id || 0) + 1 || 1,
          },
        ]
        return {
          ...g,
          left: g.left - sum,
        }
      })
    })
  }, [])

  const totalLeft = useMemo(() => {
    return items.filter((g) => !g.isHidden).reduce((a, b) => a + b.left, 0)
  }, [items])

  const renderList = useMemo(() => {
    return items.filter((g) => (showHiddenItems ? g.isHidden : !g.isHidden))
  }, [items, showHiddenItems])

  const toggleHidden = useCallback(
    (invoiceId: string) => {
      setItems((p) => {
        return p.map((g, i) => {
          if (g.number === invoiceId) {
            return {...g, isHidden: !g.isHidden}
          }
          return g
        })
      })
    },
    [setItems]
  )

  const sendWARemainings = useCallback(() => {
    if (!window.confirm('Вы уверены?')) {
      return
    }

    const list = items.filter((g) => !g.isHidden)
    const remaining = list.reduce((a, b) => a + b.left, 0)

    const content =
      'Kerben Остаток\n\n' +
      list.map((g) => g.number + ': ' + g.left + ' сом').join('\n') +
      '\n\nВсего остаток: ' +
      remaining +
      ' сом'

    ;['996777171171', '996507454411', '996777599577', '996999466000'].map(
      (g) => {
        requester
          .post('/office/wa-send-message', {
            content,
            phone_number: g,
          })
          .then((res) => {
            console.log(res)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    )
  }, [items])

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setNewInvoice((prev) => ({...prev, [name]: value}))
  }

  const deleteTransaction = useCallback(
    (invoice: number, transaction: number) => {
      if (!window.confirm('Вы уверены?')) {
        return
      }

      setItems((p) => {
        return p.map((g) => {
          if (g.id === invoice) {
            return {
              ...g,
              left:
                g.left -
                (g.transactions.find((m) => m.id === transaction)?.sum || 0),
              transactions: g.transactions.filter((j) => j.id !== transaction),
            }
          }
          return g
        })
      })
    },
    [setItems]
  )

  return (
    <>
      <div
        style={{backgroundColor: 'white', flexGrow: 1, gap: 0}}
        className='p-3'
      >
        <div className='d-flex justify-content-between gap-5 mb-3 align-items-center'>
          <div className='d-flex gap-3'>
            <h1 className='h3 text-muted'>Квитанции ({renderList.length})</h1>
            <Button onClick={sendWARemainings} variant='secondary'>
              Отправить остаток
            </Button>
          </div>
          <div className='d-flex justify-content-end align-items-center gap-3'>
            <Form.Check
              checked={showHiddenItems}
              onChange={(t) => setShowHiddenItems(t.target.checked)}
              type={'checkbox'}
              id={`showIsHIddenItems`}
              label={`Скрытые`}
            />
            <div style={{whiteSpace: 'nowrap'}}>
              Всего остаток: <strong>{totalLeft} сом</strong>
            </div>
            <InputGroup style={{minWidth: 100, maxWidth: 300}}>
              <Form.Control
                placeholder={t('search')}
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
{/* Modal code */}
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
            <Button variant='primary' onClick={createInvoice}>
              Создать
            </Button>
          </Modal.Footer>
        </Modal>
{/* End code */}
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
                      {g.left} сом / {g.total - g.comm}
                    </div>
                  </Card.Title>
                  <ListGroup variant='flush'>
                    {g.transactions.map((o) => (
                      <ListGroup.Item
                        className='d-flex justify-content-between align-items-center'
                        key={o.id}
                      >
                        {o.date}: {o.sum} сом
                        {!g.isHidden && (
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() =>
                              deleteTransaction(g.id || 0, o.id || 0)
                            }
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
                        onClick={() => createTransaction(g.number)}
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