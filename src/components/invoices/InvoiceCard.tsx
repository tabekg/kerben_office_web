import { useMemo } from 'react'
import { MdDeleteOutline, MdAdd } from 'react-icons/md'
import { Button, Badge } from '../ui'
import { IInvoice, ITransaction } from '../../types'
import styles from './InvoiceCard.module.css'

interface InvoiceCardProps {
  invoice: IInvoice
  onDelete: (id: number) => void
  onAddTransaction: (number: string) => void
  onDeleteTransaction: (invoiceId: number, transactionId: number) => void
}

export default function InvoiceCard({
  invoice,
  onDelete,
  onAddTransaction,
  onDeleteTransaction,
}: InvoiceCardProps) {
  const formatMoney = (value: number) => value.toLocaleString('ru-RU')
  
  const progress = useMemo(() => {
    const total = invoice.total - invoice.comm
    if (total <= 0) return 0
    // Показываем сколько ОСТАЛОСЬ (100% -> 0%)
    return Math.max(0, Math.round((invoice.left / total) * 100))
  }, [invoice])

  // Цвет прогресса: синий > 50%, жёлтый 25-50%, красный < 25%
  const progressColor = useMemo(() => {
    if (progress <= 25) return 'critical'
    if (progress <= 50) return 'low'
    return ''
  }, [progress])

  const isEmpty = invoice.left <= 0

  return (
    <div className={`${styles.card} ${isEmpty ? styles.empty : ''}`}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.invoiceInfo}>
          <span className={styles.date}>{invoice.date}</span>
          <span className={styles.number}>#{invoice.number}</span>
        </div>
        <div className={styles.headerRight}>
          {isEmpty && <Badge variant="danger" size="sm">Израсходовано</Badge>}
          <button
            className={styles.deleteInvoiceButton}
            onClick={() => onDelete(invoice.id)}
            title="Удалить квитанцию"
          >
            <MdDeleteOutline />
          </button>
        </div>
      </div>

      {/* Amount Info */}
      <div className={styles.amounts}>
        <div className={styles.amountRow}>
          <span className={styles.amountLabel}>Остаток</span>
          <span className={`${styles.amountValue} ${isEmpty ? styles.empty : styles.remaining}`}>
            {formatMoney(invoice.left)} сом
          </span>
        </div>
        <div className={styles.amountRow}>
          <span className={styles.amountLabel}>Всего</span>
          <span className={styles.amountValue}>
            {formatMoney(invoice.total - invoice.comm)} сом
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div 
            className={`${styles.progressFill} ${progressColor ? styles[progressColor] : ''}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressText}>{progress}%</span>
      </div>

      {/* Transactions */}
      {invoice.transactions.length > 0 && (
        <div className={styles.transactions}>
          <div className={styles.transactionsHeader}>
            <span>Транзакции ({invoice.transactions.length})</span>
          </div>
          <div className={styles.transactionsList}>
            {invoice.transactions.map((t) => (
              <TransactionItem
                key={t.id}
                transaction={t}
                onDelete={() => onDeleteTransaction(invoice.id, t.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<MdAdd />}
          onClick={() => onAddTransaction(invoice.number)}
          fullWidth
        >
          Добавить транзакцию
        </Button>
      </div>
    </div>
  )
}

interface TransactionItemProps {
  transaction: ITransaction
  onDelete: () => void
}

function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  return (
    <div className={styles.transactionItem}>
      <div className={styles.transactionInfo}>
        <span className={styles.transactionDate}>{transaction.date}</span>
        <span className={styles.transactionSum}>
          {transaction.sum.toLocaleString('ru-RU')} сом
        </span>
        {transaction.comment && (
          <span className={styles.transactionComment}>{transaction.comment}</span>
        )}
      </div>
      <button
        className={styles.deleteButton}
        onClick={onDelete}
        title="Удалить транзакцию"
      >
        <MdDeleteOutline />
      </button>
    </div>
  )
}
