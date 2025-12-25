import { useState, useCallback, useMemo } from 'react'
import { Button, Modal } from '../ui'
import styles from './InvoiceForm.module.css'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (startDate: Date, endDate: Date) => void
}

export default function ExportModal({
  isOpen,
  onClose,
  onExport,
}: ExportModalProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSubmit = useCallback(() => {
    if (startDate && endDate) {
      onExport(new Date(startDate), new Date(endDate))
      setStartDate('')
      setEndDate('')
    }
  }, [startDate, endDate, onExport])

  const handleClose = useCallback(() => {
    setStartDate('')
    setEndDate('')
    onClose()
  }, [onClose])

  const isValid = useMemo(() => {
    if (!startDate || !endDate) return false
    return new Date(startDate) <= new Date(endDate)
  }, [startDate, endDate])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Экспорт в Excel"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Отмена
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Экспортировать
          </Button>
        </>
      }
    >
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Дата с</label>
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Дата по</label>
          <input
            type="date"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
          />
        </div>

        {startDate && endDate && !isValid && (
          <div className={styles.error}>
            Дата начала не может быть позже даты окончания
          </div>
        )}
      </div>
    </Modal>
  )
}
