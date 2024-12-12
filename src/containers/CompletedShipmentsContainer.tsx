import {useTranslation} from 'react-i18next'
import {useState, useEffect, useCallback, useMemo} from 'react'
import {InputGroup, Form, Row, Col, Spinner} from 'react-bootstrap'
import requester from '../utils/requester'
import {getLastRouteInfoByShipment} from '../utils/index'
import moment from 'moment'
import ShipmentItemComponent from '../components/ShipmentItemComponent'
import MyVerticallyCenteredModal from './Modal-window'
import {IShipment, IShipmentInfo} from '../types/shipment'

export default function CompletedShipmentsContainer() {
  const {t} = useTranslation()
  const [selectedShipment, setSelectedShipment] = useState(null)

  const [items, setItems] = useState<IShipment[]>([])

  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchShipments()
  }, [])

  const fetchShipments = useCallback(() => {
    if (loading) {
      return
    }
    setLoading(true)
    requester
      .get('/shipment', {
        status: 'completed',
      })
      .then((res) => {
        if (res.status === 'success') {
          setItems(res.payload)
          console.log(res.payload)
        }
      })
      .catch((e) => {
        console.log(e)
      })
      .finally(() => setLoading(false))
  }, [loading])

  const list = useMemo(() => {
    return items
      .filter((g) => !!g.last_history)
      .filter(
        (g) =>
          // g.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          g.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          g.last_history?.truck_number
            ?.toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          g.last_history?.driver_full_name
            ?.toLowerCase()
            .includes(searchInput.toLowerCase())
      )
      .map((g) => {
        return getLastRouteInfoByShipment(g, t)
      })
  }, [items, searchInput, t])

  const newList = useMemo(() => {
    const l: {[keyof: string]: (IShipment & IShipmentInfo)[]} = {}

    list.forEach((g) => {
      const d = new Date(g.date).getTime()
      if (typeof l[d] !== 'undefined') {
        l[d].push(g)
      } else {
        l[d] = [g]
      }
    })

    return Object.keys(l)
      .sort((a, b) => a > b ? -1 : 1)
      .reduce((obj, key) => {
        obj[key] = l[key]
        return obj
      }, {})
  }, [list])

  const arrayList = useMemo(() => Object.keys(newList), [newList])

  return (
    <>
      <MyVerticallyCenteredModal
        onChangeShipment={(s) => setSelectedShipment(s)}
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      <div
        style={{backgroundColor: 'white', flexGrow: 1, gap: 0}}
        className='p-3'
      >
        <div className='d-flex justify-content-between gap-5 mb-3 align-items-center'>
          <h1 className='h3 text-muted'>Завершенные грузы ({items.length})</h1>
          <InputGroup style={{minWidth: 100, maxWidth: 300}}>
            <Form.Control
              placeholder={t('search')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </InputGroup>
        </div>

        <>
          {loading ? (
            <div
              style={{
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Spinner animation='border' role='status' variant='secondary'>
                <span className='visually-hidden'>Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {arrayList.map((g) => (
                <>
                  <div className='mb-2'>
                    <div
                      style={{display: 'flex', gap: 12, alignItems: 'center'}}
                    >
                      <span className='h5 text-muted'>
                        {moment(+g).format('DD.MM.YYYY')} ({newList[g].length})
                      </span>
                      <div
                        style={{
                          flexGrow: 1,
                          border: '1px solid rgba(0, 0, 0, .1)',
                        }}
                      />
                    </div>
                  </div>

                  <Row className='my-3'>
                    {newList[g].map((o) => (
                      <Col lg={3} md={4} sm={12}>
                        <ShipmentItemComponent
                          onSelect={() => setSelectedShipment(o)}
                          g={o}
                        />
                      </Col>
                    ))}
                  </Row>
                </>
              ))}
            </>
          )}
        </>
      </div>
    </>
  )
}
