import { useState, useCallback, useMemo } from 'react'
import { Button, Modal } from '../ui'
import styles from './InvoiceForm.module.css'

interface TransactionFormData {
  date: string
  sum: number
  comment: string
  totalTrucks?: number
}

interface TransactionFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData) => void
  invoiceNumber: string
  showTrucksField?: boolean
}

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSubmit,
  invoiceNumber,
  showTrucksField = false,
}: TransactionFormModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    date: '',
    sum: 0,
    comment: '',
    totalTrucks: undefined,
  })

  const handleSubmit = useCallback(() => {
    if (!formData.date || formData.sum <= 0) {
      return
    }
    onSubmit(formData)
    setFormData({ date: '', sum: 0, comment: '', totalTrucks: undefined })
  }, [formData, onSubmit])

  const handleClose = useCallback(() => {
    setFormData({ date: '', sum: 0, comment: '', totalTrucks: undefined })
    onClose()
  }, [onClose])

  const handleChange = (field: keyof TransactionFormData, value: string | number | undefined) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value }
      
      // Автоматически рассчитываем сумму при изменении количества машин
      if (field === 'totalTrucks' && typeof value === 'number') {
        newState.sum = value * 1100
      }
      
      return newState
    })
  }

  const isValid = useMemo(() => {
    return formData.date && formData.sum > 0
  }, [formData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Новая транзакция — #${invoiceNumber}`}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Сохранить
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Дата</label>
          <input
            type="date"
            className={styles.input}
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        {showTrucksField && (
          <div className={styles.field}>
            <label className={styles.label}>Количество машин</label>
            <input
              type="number"
              className={styles.input}
              value={formData.totalTrucks || ''}
              onChange={(e) => handleChange('totalTrucks', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              min={0}
            />
            <span className={styles.hint}>× 1,100 сом = автоматический расчёт</span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Сумма (сом)</label>
          <input
            type="number"
            className={styles.input}
            value={formData.sum || ''}
            onChange={(e) => handleChange('sum', Number(e.target.value))}
            placeholder="0"
            min={0}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Комментарий</label>
          <textarea
            className={`${styles.input} ${styles.textarea}`}
            value={formData.comment}
            onChange={(e) => handleChange('comment', e.target.value)}
            placeholder="Необязательно"
            rows={3}
          />
        </div>
      </div>
    </Modal>
  )
}
