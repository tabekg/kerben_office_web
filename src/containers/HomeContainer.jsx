import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useContext, useEffect, useMemo, useRef, useState} from 'react'
import requester from '../utils/requester'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import MyVerticallyCenteredModal from './Modal-window'
import {getLastRouteInfoByShipment} from '../utils/index.jsx'
import {useTranslation} from 'react-i18next'
import {RootContext} from '../utils/context.js'

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(0)
  const root = useContext(RootContext)

  const [addDriverModal, setAddDriverModal] = useState(false)

  const timeoutId = useRef(-1)
  const {t} = useTranslation()

  useEffect(() => {
    fetchShipments()

    return () => {
      if (timeoutId.current && timeoutId.current > -1) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [root.shipmentsType])

  const fetchShipments = () => {
    requester
      .get('/shipment', {
        is_archived: root.shipmentsType === 'archive' ? '1' : '0',
      })
      .then((res) => {
        if (res.status === 'success') {
          setShipments(res.payload)
        }
        timeoutId.current =
          root.shipmentsType === 'active'
            ? setTimeout(() => fetchShipments(), 3000)
            : null
      })
      .catch(() => {
        timeoutId.current =
          root.shipmentsType === 'active'
            ? setTimeout(() => fetchShipments(), 3000)
            : null
      })
  }

  const list = useMemo(() => {
    return shipments
      .filter((g) => !!g.last_route)
      .map((g) => {
        return getLastRouteInfoByShipment(g, t)
      })
  }, [shipments, t])

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
          <div className={'driver-list'}>
            {list.map((g, i) => {
              return (
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
                      <div className={'h5'}>{g.last_route.to_point.title}</div>
                    </div>
                    {/*<pre>{JSON.stringify(g.last_route, null, 2)}</pre>*/}
                    {/*{g.payload ? (*/}
                    {g.location_updated_at ? (
                      <div className={'text-muted'}>{g.datetime.fromNow()}</div>
                    ) : null}
                    {/*) : null}*/}
                  </div>
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
