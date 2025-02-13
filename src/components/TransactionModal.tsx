import {useCallback, useMemo, useState} from 'react'
import {Button, Form, Modal} from 'react-bootstrap'

interface ITransaction {
  id?: number
  date: string
  sum: number
  comment?: string
  totalTrucks?: number
}

interface TransactionModalProps {
  show: boolean
  onHide: () => void
  invoiceNumber: string
  onSave: (transaction: Omit<ITransaction, 'id'>) => Promise<void> | void
  name: string
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  onHide,
  invoiceNumber,
  onSave,
  name,
}) => {
  const [newTransaction, setNewTransaction] = useState<
    Omit<ITransaction, 'id'>
  >({
    date: '',
    sum: 0,
    comment: '',
  })

  const handleTransactionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const {name, value} = e.target
    setNewTransaction((prev) => {
      const newState = {
        ...prev,
        [name]: ['sum', 'totalTrucks'].includes(name) ? Number(value) : value,
      }

      if (name === 'totalTrucks') {
        newState['sum'] = (Number(value) || 0) * 1100
      }

      return newState
    })
  }

  const handleSave = useCallback(async () => {
    if (!newTransaction.date || newTransaction.sum <= 0) {
      window.alert('Заполните все поля')
      return
    }

    await onSave(newTransaction)
    onHide()

    setTimeout(() => {
      setNewTransaction({date: '', sum: 0, comment: ''})
    }, 300)
  }, [newTransaction, onSave, onHide])

  const isTransactionFormValid = useMemo(() => {
    return newTransaction.date !== '' && newTransaction.sum
  }, [newTransaction])

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Новая транзакция для счета #{invoiceNumber}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='transactionDate'>
            <Form.Label>Дата</Form.Label>
            <Form.Control
              type='date'
              name='date'
              value={newTransaction.date}
              onChange={handleTransactionChange}
            />
          </Form.Group>
          {name.startsWith('gps') ? (
            <Form.Group controlId='totalTrucks'>
              <Form.Label>Количество машин</Form.Label>
              <Form.Control
                type='number'
                name='totalTrucks'
                value={(newTransaction.totalTrucks || '').toString()}
                onChange={handleTransactionChange}
                placeholder={''}
              />
            </Form.Group>
          ) : null}
          <Form.Group controlId='transactionSum'>
            <Form.Label>Сумма</Form.Label>
            <Form.Control
              type='number'
              name='sum'
              value={newTransaction.sum}
              onChange={handleTransactionChange}
              placeholder={''}
              disabled={!!newTransaction.totalTrucks}
            />
          </Form.Group>
          <Form.Group controlId='transactionComment'>
            <Form.Label>Комментарий</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              name='comment'
              value={newTransaction.comment}
              onChange={handleTransactionChange}
              placeholder={''}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          Закрыть
        </Button>
        <Button
          variant='primary'
          onClick={handleSave}
          disabled={!isTransactionFormValid}
        >
          Сохранить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default TransactionModal
