import {
  Col,
  Row,
  InputGroup,
  Form,
  Button,
  Collapse,
  Spinner,
} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import requester from '../utils/requester'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import MyVerticallyCenteredModal from './Modal-window'
import {getLastRouteInfoByShipment} from '../utils/index.jsx'
import {useTranslation} from 'react-i18next'
import moment from 'moment'
import ShipmentItemComponent from '../components/ShipmentItemComponent'

function ListDateComponent({list, arrayList, i, item, onSelect}) {
  const [isOpen, setIsOpen] = useState(false)

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
        onClick={() => setIsOpen((p) => !p)}
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
        <span style={{userSelect: 'none'}}>
          {moment(+item).format('DD.MM.YYYY')} ({list.length})
        </span>
        <span
          className='material-symbols-outlined'
          style={{
            color: 'grey',
            transition: '0.5s all',
            transform: `rotate(${isOpen ? -90 : 90}deg)`,
          }}
        >
          arrow_forward
        </span>
      </div>
      <Collapse in={isOpen}>
        <div>
          {list.map((g) => (
            <ShipmentItemComponent onSelect={onSelect} g={g} />
          ))}
        </div>
      </Collapse>
    </div>
  )
}

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [loading, setLoading] = useState(true)

  const [addDriverModal, setAddDriverModal] = useState(false)

  const {t} = useTranslation()

  const [searchInput, setSearchInput] = useState('')
  const [shipmentType, setShipmentType] = useState('')
  const timeoutId = useRef(-1)

  useEffect(() => {
    setLoading(true)
    fetchShipments()
    timeoutId.current = setInterval(() => fetchShipments(), 6000)

    return () => {
      if (timeoutId.current > -1) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [shipmentType])

  const fetchShipments = useCallback(() => {
    requester
      .get('/shipment', {
        is_archived: '0',
        type: shipmentType,
      })
      .then((res) => {
        if (res.status === 'success') {
          setShipments(res.payload)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [shipmentType, loading])

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
        className='g-0'
        style={{
          flex: '1 1 auto',
          backgroundColor: 'white',
          minHeight: 0,
          overflow: 'hidden scroll',
        }}
      >
        <Col
          lg={3}
          md={4}
          sm={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            padding: 0,
          }}
        >
          <div className='p-2'>
            <InputGroup>
              <Form.Control
                className='mb-3 mt-1'
                placeholder={t('search')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </InputGroup>
            <Row className='m-0 mb-2'>
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
                  АВТОВОЗ
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
          </div>
          <div className={'driver-list'}>
            <div>
              {loading ? (
                <div
                  style={{
                    height: 300,
                    width: '100%',
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
                  {arrayList.map((a, i) => (
                    <ListDateComponent
                      onSelect={setSelectedShipment}
                      arrayList={arrayList}
                      item={a}
                      i={i}
                      list={newList[a]}
                    />
                  ))}
                </>
              )}
            </div>
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
