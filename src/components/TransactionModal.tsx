import { useState } from 'react'
import {
  Button,
  Form,
  Modal,
} from 'react-bootstrap'
import { useTranslation } from 'react-i18next'


interface ITransaction {
  id?: number
  date: string
  sum: number
  comment: string
}

interface TransactionModalProps {
  show: boolean
  onHide: () => void
  invoiceNumber: string
  onSave: (transaction: Omit<ITransaction, 'id'>) => void 
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  show,
  onHide,
  invoiceNumber,
  onSave,
}) => {
  const {t} = useTranslation() 

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

  const handleSave = () => {
    if (!newTransaction.date || newTransaction.sum <= 0) {
      alert(t('fill_date_and_sum')) 
      return
    }
    onSave(newTransaction) 
    setNewTransaction({date: '', sum: 0, comment: ''}) 
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('new_transaction_for_invoice')} #{invoiceNumber}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId='transactionDate'>
            <Form.Label>{t('date')}</Form.Label>{' '}
            <Form.Control
              type='date'
              name='date'
              value={newTransaction.date}
              onChange={handleTransactionChange}
            />
          </Form.Group>
          <Form.Group controlId='transactionSum'>
            <Form.Label>{t('sum')}</Form.Label>{' '}
            <Form.Control
              type='number'
              name='sum'
              value={newTransaction.sum}
              onChange={handleTransactionChange}
              placeholder={t('enter_sum') || ''} 
            />
          </Form.Group>
          <Form.Group controlId='transactionComment'>
            <Form.Label>{t('comment')}</Form.Label>{' '}
            <Form.Control
              as='textarea' 
              rows={3} 
              name='comment'
              value={newTransaction.comment}
              onChange={handleTransactionChange}
              placeholder={t('enter_comment') || ''} 
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='secondary' onClick={onHide}>
          {t('close')} 
        </Button>
        <Button
          variant='primary'
          onClick={handleSave}
          disabled={!newTransaction.date || newTransaction.sum <= 0}
        >
          {t('save')} 
        </Button>
      </Modal.Footer>
    </Modal>
  )
}


export default TransactionModal