import { useState, useCallback, useMemo } from 'react'
import { Button, Input, Modal } from '../ui'
import styles from './InvoiceForm.module.css'

interface InvoiceFormData {
  date: string
  number: string
  sum: number
  comm: number
}

interface InvoiceFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: InvoiceFormData) => void
  existingNumbers?: string[]
}

export default function InvoiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  existingNumbers = [],
}: InvoiceFormModalProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({
    date: '',
    number: '',
    sum: 0,
    comm: 0,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({})

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {}

    if (!formData.date) {
      newErrors.date = 'Укажите дату'
    }
    if (!formData.number.trim()) {
      newErrors.number = 'Укажите номер квитанции'
    } else if (existingNumbers.includes(formData.number.trim())) {
      newErrors.number = 'Квитанция с таким номером уже существует'
    }
    if (formData.sum <= 0) {
      newErrors.sum = 'Сумма должна быть больше 0'
    }
    if (formData.comm < 0) {
      newErrors.comm = 'Комиссия не может быть отрицательной'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData, existingNumbers])

  const handleSubmit = useCallback(() => {
    if (validate()) {
      onSubmit(formData)
      setFormData({ date: '', number: '', sum: 0, comm: 0 })
      setErrors({})
    }
  }, [formData, validate, onSubmit])

  const handleClose = useCallback(() => {
    setFormData({ date: '', number: '', sum: 0, comm: 0 })
    setErrors({})
    onClose()
  }, [onClose])

  const handleChange = (field: keyof InvoiceFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const isValid = useMemo(() => {
    return formData.date && formData.number.trim() && formData.sum > 0 && formData.comm >= 0
  }, [formData])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Новая квитанция"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Создать
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
          {errors.date && <span className={styles.error}>{errors.date}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Номер квитанции</label>
          <input
            type="text"
            className={styles.input}
            value={formData.number}
            onChange={(e) => handleChange('number', e.target.value)}
            placeholder="Введите номер"
          />
          {errors.number && <span className={styles.error}>{errors.number}</span>}
        </div>

        <div className={styles.row}>
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
            {errors.sum && <span className={styles.error}>{errors.sum}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Комиссия (сом)</label>
            <input
              type="number"
              className={styles.input}
              value={formData.comm || ''}
              onChange={(e) => handleChange('comm', Number(e.target.value))}
              placeholder="0"
              min={0}
            />
            {errors.comm && <span className={styles.error}>{errors.comm}</span>}
          </div>
        </div>

        {formData.sum > 0 && (
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Итого:</span>
              <strong>{(formData.sum + formData.comm).toLocaleString('ru-RU')} сом</strong>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
