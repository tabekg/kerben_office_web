import {useState, useEffect, useMemo} from 'react'
import InvoicesComponent from '../components/InvoicesComponent'

interface Props {
  title: string
  sum: number
}

const InvoicesContainer = ({title: initialTitle, sum: initialSum}: Props) => {
  const [selected, setSelected] = useState('invoices')
  const [invoicesData, setInvoicesData] = useState<{[key: string]: any[]}>({
    invoices: JSON.parse(localStorage.getItem('__invoices') || '[]'),
    'gps-1': JSON.parse(localStorage.getItem('__invoices_gps-1') || '[]'),
    'gps-2': JSON.parse(localStorage.getItem('__invoices_gps-2') || '[]'),
    'gps-3': JSON.parse(localStorage.getItem('__invoices_gps-3') || '[]'),
    'gps-4': JSON.parse(localStorage.getItem('__invoices_gps-4') || '[]'),
  })

  useEffect(() => {
    localStorage.setItem('__invoices', JSON.stringify(invoicesData['invoices']))
    localStorage.setItem(
      '__invoices_gps-1',
      JSON.stringify(invoicesData['gps-1'])
    )
    localStorage.setItem(
      '__invoices_gps-2',
      JSON.stringify(invoicesData['gps-2'])
    )
    localStorage.setItem(
      '__invoices_gps-3',
      JSON.stringify(invoicesData['gps-3'])
    )
    localStorage.setItem(
      '__invoices_gps-4',
      JSON.stringify(invoicesData['gps-4'])
    )
  }, [invoicesData])

  const handleButtonClick = (buttonLabel: string) => {
    setSelected(buttonLabel)
  }

  const title = useMemo(() => {
    switch (selected) {
      case 'invoices':
        return '0.4'
      case 'gps-1':
        return 'GPS 1'
      case 'gps-2':
        return 'GPS 2'
      case 'gps-3':
        return 'GPS 3'
      case 'gps-4':
        return 'GPS 4'
      default:
        return initialTitle
    }
  }, [selected, initialTitle])

  const selectedData = useMemo(() => {
    return invoicesData[selected] || []
  }, [selected, invoicesData])

  return (
    <>
      <div className='container mt-4'>
        <div className='btn-group d-flex gap-2 mb-4'>
          <button
            type='button'
            className={`btn ${
              selected === 'invoices' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('invoices')}
          >
            0.4
          </button>
          <button
            type='button'
            className={`btn ${
              selected === 'gps-1' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('gps-1')}
          >
            GPS 1
          </button>
          <button
            type='button'
            className={`btn ${
              selected === 'gps-2' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('gps-2')}
          >
            GPS 2
          </button>
          <button
            type='button'
            className={`btn ${
              selected === 'gps-3' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('gps-3')}
          >
            GPS 3
          </button>
          <button
            type='button'
            className={`btn ${
              selected === 'gps-4' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('gps-4')}
          >
            GPS 4
          </button>
        </div>
      </div>
           <InvoicesComponent title={title} data={selectedData} setInvoicesData={setInvoicesData} selected={selected} />
    </>
  )
}
export default InvoicesContainer
