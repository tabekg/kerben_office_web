import {useState, useMemo} from 'react'
import InvoicesComponent from '../components/InvoicesComponent'

const InvoicesContainer = () => {
  const [selected, setSelected] = useState('invoices')

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
      case 'terminal':
        return 'Терминал'
      default:
        return ''
    }
  }, [selected])

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
              selected === 'terminal' ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => handleButtonClick('terminal')}
          >
            Терминал
          </button>
        </div>
      </div>

      {selected === 'invoices' ? (
        <InvoicesComponent title={title} name={selected} />
      ) : null}

      {selected === 'terminal' ? (
        <InvoicesComponent title={title} name={selected} />
      ) : null}

      {selected === 'gps-1' ? (
        <InvoicesComponent title={title} name={selected} />
      ) : null}

      {selected === 'gps-2' ? (
        <InvoicesComponent title={title} name={selected} />
      ) : null}

      {selected === 'gps-3' ? (
        <InvoicesComponent title={title} name={selected} />
      ) : null}
    </>
  )
}
export default InvoicesContainer
