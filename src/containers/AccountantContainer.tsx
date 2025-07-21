import React, {useState, useMemo, useEffect} from 'react'
import requester from '../utils/requester'
import {Button, Card, Col, ListGroup, Row} from 'react-bootstrap'
import commaNumber from 'comma-number'
import {MdDeleteOutline} from 'react-icons/md'

interface ICategory {
  id: number
  title: string
}

const AccountantContainer = () => {
  const [selected, setSelected] = useState(0)
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    requester
      .get('/office/cashier/category')
      .then((res) => {
        if (res.status === 'success') {
          setCategories(res.payload)
        }
      })
      .catch((e) => console.log(e))
  }, [])

  const title = useMemo(() => {
    switch (selected) {
      case 'invoices':
        return '0.4'
      case 'gps-1':
        return 'Каратай'
      case 'gps-2':
        return 'Достук'
      case 'terminal':
        return 'Терминал'
      default:
        return ''
    }
  }, [selected])

  return (
    <>
      <div
        className='p-3 d-flex align-items-center justify-content-between gap-5'
        style={{backgroundColor: 'white'}}
      >
        <div className='btn-group'>
          <button
            type='button'
            className={`btn ${
              !selected ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setSelected(0)}
          >
            Все
          </button>
          {categories.map((g) => (
            <button
              type='button'
              className={`btn ${
                selected === g.id ? 'btn-primary' : 'btn-outline-primary'
              }`}
              onClick={() => setSelected(g.id)}
            >
              {g.title}
            </button>
          ))}
        </div>

        <div>Сумма: KGS, USD</div>

        <div className='btn-group'>
          <button
            type='button'
            className={`btn ${
              !selected ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => setSelected(0)}
          >
            Сегодня
          </button>
          <button
            type='button'
            className={`btn ${false ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelected(0)}
          >
            Вчера
          </button>
          <button
            type='button'
            className={`btn ${false ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSelected(0)}
          >
            Выбрать дату
          </button>
        </div>

        <div className={'gap-1 d-flex'}>
          <button
            type='button'
            className={`btn btn-outline-primary`}
            onClick={() => console.log('terminal')}
          >
            Новая категория
          </button>

          <button
            type='button'
            className={`btn btn-outline-primary`}
            onClick={() => console.log('terminal')}
          >
            Конвертация
          </button>
        </div>
      </div>

      <div
        style={{backgroundColor: 'white', flexGrow: 1, gap: 0}}
        className='p-3'
      >
        <Row>
          {[
            {
              id: 1,
              number: '1',
              date: '2',
              left: 1,
              isHidden: false,
              total: 2,
              comm: 3,
              transactions: [],
            },
          ].map((g) => (
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
                            onClick={() => console.log(g.id!, o.id!)}
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
                          console.log(g.number)
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
export default AccountantContainer
