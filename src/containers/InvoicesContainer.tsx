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
} from 'react-bootstrap'

interface ITransaction {
  date: string
  sum: number
}

interface IInvoice {
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
      .map((g: IInvoice) => ({...g, isHidden: !!g.isHidden}))
  )

  const [searchInput, setSearchInput] = useState('')

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
    const date = window.prompt('Date?')
    const number = window.prompt('Number?') || 'Untitled'

    if (items.findIndex((g) => g.number === number) > -1) {
      window.alert('Already exists!')
      return
    }

    const sum = Math.floor(+(window.prompt('Sum?') || 0))
    const comm = Math.floor(+(window.prompt('Comm?') || 0))

    setItems((p) => {
      return [
        ...p,
        {
          date: date || undefined,
          number,
          sum,
          isHidden: false,
          comm,
          total: sum + comm,
          left: sum,
          transactions: [],
        },
      ]
    })
  }, [items])

  const createTransaction = useCallback((invoiceNumber: string) => {
    const date = window.prompt('Date?') || 'No date'
    const sum = Math.floor(+(window.prompt('Sum?') || 0))

    setItems((p) => {
      return p.map((g) => {
        if (g.number != invoiceNumber) {
          return g
        }
        g.transactions = [...g.transactions, {date, sum}]
        return {
          ...g,
          left: g.left - sum,
        }
      })
    })
  }, [])

  const totalLeft = useMemo(() => {
    return items.reduce((a, b) => a + b.left, 0)
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

  return (
    <>
      <div
        style={{backgroundColor: 'white', flexGrow: 1, gap: 0}}
        className='p-3'
      >
        <div className='d-flex justify-content-between gap-5 mb-3 align-items-center'>
          <h1 className='h3 text-muted'>Квитанции ({renderList.length})</h1>
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
            <Button style={{whiteSpace: 'nowrap'}} onClick={createInvoice}>
              Новая квитанция
            </Button>
          </div>
        </div>

        <Row>
          {renderList.map((g, i) => (
            <Col sm={6} md={3} xl={2} className='align-self-stretch mb-4'>
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
                      <ListGroup.Item>
                        {o.date}: {o.sum} сом
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <div className='d-flex justify-content-end align-items-center mt-3'>
                    <Button
                      variant='secondary'
                      onClick={() => createTransaction(g.number)}
                    >
                      Новая транзакция
                    </Button>
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
