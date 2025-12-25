import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { MdSearch, MdAdd, MdFileDownload, MdSend, MdSync } from 'react-icons/md'
import { Button, Badge, Spinner } from '../ui'
import InvoiceCard from './InvoiceCard'
import InvoiceFormModal from './InvoiceFormModal'
import TransactionFormModal from './TransactionFormModal'
import ExportModal from './ExportModal'
import { IInvoice, ITransaction } from '../../types'
import requester from '../../utils/requester'
import { exportToExcel } from '../../utils/generat-excel'
import { formatDateDDMMYYYY, parseDate } from '../../utils/parsers'
import styles from './InvoicesPage.module.css'

// Форматирование числа с разделителями
const formatNumber = (num: number) => num.toLocaleString('ru-RU')

interface InvoicesPageProps {
  title: string
  name: string
}

export default function InvoicesPage({ title, name }: InvoicesPageProps) {
  // State
  const [items, setItems] = useState<IInvoice[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Флаг для предотвращения сохранения при первой загрузке
  const isFirstLoad = useRef(true)
  
  // Modals
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState('')

  // Load data
  useEffect(() => {
    setLoading(true)
    isFirstLoad.current = true
    
    requester
      .get('/office/invoices' + (name === 'invoices' ? '' : '/' + name))
      .then((res) => {
        if (res.status === 'success') {
          const invoices = res.payload as IInvoice[]
          setItems(
            invoices
              .sort((a, b) => {
                const aDate = a?.date?.split('.').reverse().join('') || ''
                const bDate = b?.date?.split('.').reverse().join('') || ''
                return aDate > bDate ? 1 : aDate < bDate ? -1 : 0
              })
              .map((g, i) => ({
                ...g,
                transactions: (g.transactions || []).map((t, it) => ({
                  ...t,
                  id: t.id || it + 1,
                })),
                id: g.id || i + 1,
              }))
          )
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false)
        setTimeout(() => {
          isFirstLoad.current = false
        }, 100)
      })
  }, [name])

  // Save data on change
  useEffect(() => {
    if (loading || isFirstLoad.current) return
    
    setSaving(true)
    
    requester
      .post('/office/invoices' + (name === 'invoices' ? '' : '/' + name), { data: items })
      .catch(() => {
        console.error('Ошибка сохранения')
      })
      .finally(() => {
        setSaving(false)
      })
  }, [items, name, loading])

  // Filtered list
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items
    return items.filter((item) => 
      item.number.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [items, searchQuery])

  // Stats
  const totalRemaining = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.left || 0), 0)
  }, [items])

  // Handlers
  const handleCreateInvoice = useCallback((data: {
    date: string
    number: string
    sum: number
    comm: number
  }) => {
    const newInvoice: IInvoice = {
      id: (items[items.length - 1]?.id || 0) + 1,
      date: data.date,
      number: data.number,
      sum: data.sum,
      comm: data.comm,
      total: data.sum + data.comm,
      left: data.sum,
      transactions: [],
    }
    setItems((prev) => [...prev, newInvoice])
    setShowInvoiceModal(false)
  }, [items])

  const handleAddTransaction = useCallback((invoiceNumber: string) => {
    setCurrentInvoiceNumber(invoiceNumber)
    setShowTransactionModal(true)
  }, [])

  const handleSaveTransaction = useCallback((data: Omit<ITransaction, 'id'>) => {
    setItems((prev) =>
      prev.map((invoice) => {
        if (invoice.number === currentInvoiceNumber) {
          const newTransaction: ITransaction = {
            ...data,
            id: (invoice.transactions[invoice.transactions.length - 1]?.id || 0) + 1,
          }
          return {
            ...invoice,
            left: invoice.left - data.sum,
            transactions: [...invoice.transactions, newTransaction],
          }
        }
        return invoice
      })
    )
    setShowTransactionModal(false)
  }, [currentInvoiceNumber])

  const handleDeleteTransaction = useCallback((invoiceId: number, transactionId: number) => {
    if (!window.confirm('Удалить транзакцию?')) return

    setItems((prev) =>
      prev.map((invoice) => {
        if (invoice.id === invoiceId) {
          const deletedTransaction = invoice.transactions.find((t) => t.id === transactionId)
          return {
            ...invoice,
            left: invoice.left + (deletedTransaction?.sum || 0),
            transactions: invoice.transactions.filter((t) => t.id !== transactionId),
          }
        }
        return invoice
      })
    )
  }, [])

  const handleDeleteInvoice = useCallback((invoiceId: number) => {
    if (!window.confirm('Удалить квитанцию?')) return
    setItems((prev) => prev.filter((invoice) => invoice.id !== invoiceId))
  }, [])

  const handleExport = useCallback((startDate: Date, endDate: Date) => {
    const filtered = items.filter((el) => {
      const itemDate = parseDate(el.date || '')?.getTime()
      if (!itemDate) return false
      return itemDate >= startDate.getTime() && itemDate <= endDate.getTime()
    })

    exportToExcel(
      filtered,
      `Квитанции ${title} с ${formatDateDDMMYYYY(startDate)} по ${formatDateDDMMYYYY(endDate)}`,
      { start: startDate, end: endDate },
      title
    )
    setShowExportModal(false)
  }, [items, title])

  const handleSendWhatsApp = useCallback(() => {
    if (!window.confirm('Отправить остатки в WhatsApp?')) return

    const remaining = items.reduce((a, b) => a + b.left, 0)
    const content =
      `Kerben Остаток (${title})\n\n` +
      items.map((g) => `${g.number}: ${formatNumber(g.left)} сом`).join('\n') +
      `\n\nВсего остаток: ${formatNumber(remaining)} сом`

    const phoneNumbers = [
      '996777171171',
      '996507454411',
      '996777599577',
      '996995006222',
      '996501226228',
    ]

    phoneNumbers.forEach((phoneNumber) => {
      requester
        .post('/office/wa-send-message', { content, phone_number: phoneNumber })
        .catch(console.error)
    })
  }, [items, title])

  const existingNumbers = useMemo(() => items.map((i) => i.number), [items])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            Квитанции {title}
            <Badge variant="secondary" size="md">{filteredItems.length}</Badge>
          </h1>
        </div>

        <div className={styles.headerRight}>
          {saving && (
            <div className={styles.savingIndicator}>
              <MdSync className={styles.savingIcon} />
              <span>Синхронизация...</span>
            </div>
          )}
          <div className={styles.stats}>
            <span className={styles.statLabel}>Остаток:</span>
            <span className={styles.statValue}>
              {formatNumber(totalRemaining)} <small>сом</small>
            </span>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          {/* Search */}
          <div className={styles.searchContainer}>
            <MdSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск по номеру..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.toolbarRight}>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<MdSend />}
            onClick={handleSendWhatsApp}
          >
            WhatsApp
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<MdFileDownload />}
            onClick={() => setShowExportModal(true)}
            disabled={!items.length}
          >
            Excel
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<MdAdd />}
            onClick={() => setShowInvoiceModal(true)}
          >
            Новая квитанция
          </Button>
        </div>
      </div>

      {/* Grid */}
      {filteredItems.length > 0 ? (
        <div className={styles.grid}>
          {filteredItems.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoice={invoice}
              onDelete={handleDeleteInvoice}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📄</div>
          <h3 className={styles.emptyTitle}>
            {searchQuery ? 'Ничего не найдено' : 'Нет квитанций'}
          </h3>
          <p className={styles.emptyDescription}>
            {searchQuery
              ? 'Попробуйте изменить поисковый запрос'
              : 'Создайте первую квитанцию, нажав кнопку выше'}
          </p>
        </div>
      )}

      {/* Modals */}
      <InvoiceFormModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        onSubmit={handleCreateInvoice}
        existingNumbers={existingNumbers}
      />

      <TransactionFormModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        onSubmit={handleSaveTransaction}
        invoiceNumber={currentInvoiceNumber}
        showTrucksField={name.startsWith('gps')}
      />

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
      />
    </div>
  )
}
