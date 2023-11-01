import {Col, Row, InputGroup, Form, Button} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import requester from '../utils/requester'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import MyVerticallyCenteredModal from './Modal-window'
import {getLastRouteInfoByShipment, getShipmentType} from '../utils/index.jsx'
import {useTranslation} from 'react-i18next'
import {RootContext} from '../utils/context.js'
import moment from 'moment'

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(0)
  const root = useContext(RootContext)

  const [addDriverModal, setAddDriverModal] = useState(false)

  const timeoutId = useRef(-1)
  const {t} = useTranslation()

  const [searchInput, setSearchInput] = useState('')
  const [shipmentType, setShipmentType] = useState('')

  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const s = setInterval(() => {
      fetchShipments()
    }, 3000)

    return () => {
      clearTimeout(s)
    }
  }, [root.shipmentsType, shipmentType])

  const fetchShipments = useCallback(() => {
    requester
      .get('/shipment', {
        is_archived: root.shipmentsType === 'archive' ? '1' : '0',
        type: shipmentType,
      })
      .then((res) => {
        if (res.status === 'success') {
          setShipments(res.payload)
        }
      })
      .catch(() => {})
  }, [root.shipmentsType, shipmentType])

  const list = useMemo(() => {
    return shipments
      .filter((g) => !!g.last_route)
      .filter(
        (g) =>
          // g.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          g.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          g.last_route.sender.phone_number
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          g.last_route.truck_number
            .toLowerCase()
            .includes(searchInput.toLowerCase()) ||
          g.last_route.sender.full_name
            .toLowerCase()
            .includes(searchInput.toLowerCase())
      )
      .map((g) => {
        return getLastRouteInfoByShipment(g, t)
      })
  }, [shipments, searchInput, t])

  const newList = useMemo(() => {
    const l = {}

    list.forEach((g) => {
      const d = new Date(g.date).getTime()
      if (typeof l[d] !== 'undefined') {
        l[d].push(g)
      } else {
        l[d] = [g]
      }
    })

    return Object.keys(l)
      .sort((a, b) => a > b)
      .reduce((obj, key) => {
        obj[key] = l[key]
        return obj
      }, {})
  }, [list])

  const arrayList = useMemo(() => Object.keys(newList), [newList])

  return (
    <>
      <AddDriverModalComponent
        show={addDriverModal}
        setShow={setAddDriverModal}
      />

      <Row
        style={{
          flexGrow: 1,
          gap: 0,
          height: 'calc(100% - 56px)',
          backgroundColor: 'white',
        }}
      >
        <Col lg={3} md={4} sm={12} style={{height: '100%'}}>
          <InputGroup>
            <Form.Control
              className='mb-3 mt-3 ms-2'
              placeholder={t('search')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </InputGroup>
          <div className={'driver-list'}>
            <Row className='px-3 mb-2'>
              <Col sm={4} className='p-0 px-1'>
                <Button
                  variant={shipmentType == '' ? 'primary' : 'light'}
                  className='w-100'
                  onClick={() => setShipmentType('')}
                >
                  Все
                </Button>
              </Col>
              <Col sm={4} className='p-0 px-1'>
                <Button
                  variant={
                    shipmentType == 'tashkent_trade' ? 'primary' : 'light'
                  }
                  className='w-100'
                  onClick={() => setShipmentType('tashkent_trade')}
                >
                  Тashkent Trade
                </Button>
              </Col>
              <Col sm={4} className='p-0 px-1'>
                <Button
                  variant={shipmentType == 'transit' ? 'primary' : 'light'}
                  className='w-100'
                  onClick={() => setShipmentType('transit')}
                >
                  Транзит
                </Button>
              </Col>
            </Row>
            {arrayList.map((a, i) => {
              return (
                <div
                  style={{
                    borderBottom:
                      i + 1 === arrayList.length
                        ? undefined
                        : '1px solid rgba(0, 0, 0, .3)',
                  }}
                >
                  <div
                    onClick={() => setActiveIndex((p) => (p === i ? -1 : i))}
                    style={{
                      cursor: 'pointer',
                      padding: 12,
                      fontWeight: 500,
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{moment(+a).format('DD.MM.YYYY')}</span>
                    <span
                      className='material-symbols-outlined'
                      style={{
                        color: 'grey',
                        transition: '0.5s all',
                        transform: `rotate(${activeIndex === i ? -90 : 90}deg)`,
                      }}
                    >
                      arrow_forward
                    </span>
                  </div>
                  {activeIndex === i ? (
                    <>
                      {newList[a].map((g) => {
                        return (
                          <>
                            <div
                              key={i}
                              className={'driver-list-item'}
                              onClick={() => setSelectedShipment(g)}
                            >
                              <div
                                className={
                                  'p-2 me-3 mt-2 d-flex rounded-circle justify-content-center align-items-center'
                                }
                                style={{
                                  backgroundColor: g.colorBg,
                                }}
                              >
                                {g.icon}
                              </div>
                              <div className={'flex-grow-1'}>
                                <div
                                  style={{fontSize: 24}}
                                  className={'d-flex align-items-center gap-2'}
                                >
                                  {g.last_route.cmr_status === 'PENDING' ? (
                                    <div
                                      style={{fontSize: 15}}
                                      className={
                                        'bg-success d-inline text-white p-1 rounded'
                                      }
                                    >
                                      CMR
                                    </div>
                                  ) : null}
                                  {g.title}
                                </div>
                                <div className={'text-muted'}>{g.label}</div>
                                {g.last_route.driver ? (
                                  <div className={'text-muted'}>
                                    {g.last_route.truck_number} |{' '}
                                    {g.last_route.driver.full_name} | +
                                    {g.last_route.driver.phone_number}
                                  </div>
                                ) : null}
                                <div
                                  style={{width: '100%'}}
                                  className={
                                    'd-flex mt-2 justify-content-around align-items-center'
                                  }
                                >
                                  <div className={'h5'}>
                                    {g.last_route.from_point.title}
                                  </div>
                                  <span
                                    className='material-symbols-outlined'
                                    style={{color: 'grey'}}
                                  >
                                    arrow_forward
                                  </span>
                                  <div className={'h5'}>
                                    {g.last_route.to_point.title}
                                  </div>
                                </div>
                                {/*<pre>{JSON.stringify(g.last_route, null, 2)}</pre>*/}
                                {/*{g.payload ? (*/}
                                {g.location_updated_at || g.type ? (
                                  <div className={'text-muted'}>
                                    {g.location_updated_at
                                      ? g.datetime.format('DD.MM.YYYY HH:ss')
                                      : ''}
                                    {g.location_updated_at && g.type
                                      ? ' | '
                                      : ''}
                                    {g.type ? `${getShipmentType(g.type)}` : ''}
                                  </div>
                                ) : null}
                                {/*) : null}*/}
                              </div>
                            </div>
                          </>
                        )
                      })}
                    </>
                  ) : null}
                </div>
              )
            })}
            {/*<div*/}
            {/*  className={'driver-list-item justify-content-center'}*/}
            {/*  style={{color: 'grey'}}*/}
            {/*  onClick={() => setAddDriverModal(true)}*/}
            {/*>*/}
            {/*  Добавить новый водитель*/}
            {/*</div>*/}
          </div>
        </Col>
        <Col lg={9} md={8} sm={12} style={{height: '100%'}} className={'p-0'}>
          <MapComponent
            // @ts-ignore
            // selectedDriver={(shipments || []).find(
            //   (g) => g.id === selectedDriver
            // )}
            markers={list.filter(
              (g) => g.status === 2 && g.location_lat && g.location_lng
            )}
          />
        </Col>
      </Row>

      <MyVerticallyCenteredModal
        onChangeShipment={(s) => setSelectedShipment(s)}
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />
    </>
  )
}
