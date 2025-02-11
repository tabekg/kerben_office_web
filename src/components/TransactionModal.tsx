import {useCallback, useMemo, useState} from 'react'
import {Button, Form, Modal} from 'react-bootstrap'

interface ITransaction {
  id?: number
  date: string
  sum: number
  comment?: string
}

interface TransactionModalProps {
  show: boolean
  onHide: () => void
  invoiceNumber: string
  onSave: (transaction: Omit<ITransaction, 'id'>) => Promise<void> | void
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  onHide,
  invoiceNumber,
  onSave,
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
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === 'sum' ? Number(value) : value,
    }))
  }

  const handleSave = useCallback(async () => {
    if (
      !newTransaction.date ||
      newTransaction.sum <= 0 ||
      !newTransaction.comment
    ) {
      alert('Заполните все поля')
      return
    }

    await onSave(newTransaction)
    onHide()

    setTimeout(() => {
      setNewTransaction({date: '', sum: 0, comment: ''})
    }, 300)
  }, [newTransaction, onSave, onHide])

  const isTransactionFormValid = useMemo(() => {
    return (
      newTransaction.date !== '' &&
      newTransaction.sum > 0 &&
      newTransaction.comment !== ''
    )
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
          <Form.Group controlId='transactionSum'>
            <Form.Label>Сумма</Form.Label>
            <Form.Control
              type='number'
              name='sum'
              value={newTransaction.sum}
              onChange={handleTransactionChange}
              placeholder={''}
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
