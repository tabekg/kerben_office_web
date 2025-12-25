import { useState, useMemo } from 'react'
import { InvoicesPage } from '../components/invoices'
import styles from './InvoicesContainer.module.css'

type TabKey = 'invoices' | 'gps-1' | 'gps-2' | 'terminal'

interface Tab {
  key: TabKey
  label: string
  title: string
}

const TABS: Tab[] = [
  { key: 'invoices', label: '0.4', title: '0.4' },
  { key: 'gps-1', label: 'Каратай', title: 'Каратай' },
  { key: 'gps-2', label: 'Достук', title: 'Достук' },
  { key: 'terminal', label: 'Терминал', title: 'Терминал' },
]

export default function InvoicesContainer() {
  const [activeTab, setActiveTab] = useState<TabKey>('invoices')

  const currentTab = useMemo(
    () => TABS.find((t) => t.key === activeTab) || TABS[0],
    [activeTab]
  )

  return (
    <div className={styles.container}>
      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <nav className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <InvoicesPage title={currentTab.title} name={currentTab.key} />
    </div>
  )
}
