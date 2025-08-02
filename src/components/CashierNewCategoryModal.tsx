import {useCallback, useMemo, useState} from 'react'
import {Button, Form, Modal} from 'react-bootstrap'
import {ICategory} from '../models/cashier'
import requester from '../utils/requester'

interface TransactionModalProps {
  show: boolean
  onHide: () => void
  categories: ICategory[]
}

const CashierNewCategoryModal: React.FC<TransactionModalProps> = ({
  show,
  onHide,
  categories,
}) => {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState(0)
  const [loading, setLoading] = useState(false)

  const isValid = useMemo(() => {
    return !!title
  }, [title])

  const handleSave = useCallback(async () => {
    if (loading) {
      return
    }

    if (!isValid) {
      window.alert('Заполните все поля')
      return
    }

    setLoading(true)

    requester
      .post('/office/cashier/category', {
        data: {title, category_id: categoryId},
      })
      .then((res) => {
        console.log(res)
        if (res.status === 'success') {
          location.reload()
          onHide()
          setTimeout(() => {
            setTitle('')
            setCategoryId(0)
          }, 300)
        }
      })
      .catch((e) => {
        console.log(e)
        window.alert('Ошибка!')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [isValid, loading, title, categoryId])

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Новая категория</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='title'>
            <Form.Label>Название</Form.Label>
            <Form.Control
              type='text'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(isNaN(+e.target.value) ? 0 : +e.target.value)
            }
            style={{marginTop: 12}}
            aria-label='Основная категория'
          >
            <option value={0}>Основная категория</option>
            {categories.map((g) => (
              <option value={g.id}>{g.title}</option>
            ))}
          </Form.Select>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant='primary'
          onClick={handleSave}
          disabled={!isValid || loading}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CashierNewCategoryModal
