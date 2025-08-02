import React, {useState, useEffect} from 'react'
import requester from '../utils/requester'
import {Button, Card, Col, Row} from 'react-bootstrap'
import CashierNewCategoryModal from '../components/CashierNewCategoryModal'
import {ICategory} from '../models/cashier'

const AccountantContainer = () => {
  const [selected, setSelected] = useState(0)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newCategory, setNewCategory] = useState<boolean>(false)
  const [response, setResponse] = useState<any>({})

  useEffect(() => {
    requester
      .get('/office/cashier')
      .then((res) => {
        if (res.status === 'success') {
          setCategories(res.payload.categories)
          setResponse(res.payload)
        }
      })
      .catch((e) => console.log(e))
  }, [])

  return (
    <>
      <CashierNewCategoryModal
        show={newCategory}
        onHide={() => setNewCategory(false)}
        categories={categories.filter((g) => !g.parent)}
      />

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
          {categories
            .filter((g) => !g.parent)
            .map((g) => (
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

        <div>
          Сумма: {response?.sum_kgs} KGS, {response?.sum_usd} USD
        </div>

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
            onClick={() => setNewCategory(true)}
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
          {categories
            .filter((g) => (selected ? g.parent?.id === selected : g.parent))
            .map((g) => (
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
                      {g.parent ? `${g.parent.title} / ` : null}
                      {g.title}
                      {/*<div>*/}
                      {/*  {commaNumber(1000)} сом / {commaNumber(2000)} сом*/}
                      {/*</div>*/}
                    </Card.Title>
                    <div className='d-flex justify-content-end align-items-center mt-3'>
                      <Button
                        variant='secondary'
                        onClick={() => {
                          console.log(1)
                        }}
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
export default AccountantContainer
