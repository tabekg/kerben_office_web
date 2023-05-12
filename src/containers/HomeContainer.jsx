import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useEffect, useMemo, useRef, useState} from 'react'
import requester from '../utils/requester'
import moment from 'moment'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import {getRouteStatus, getRouteStatusText} from '../utils/index.js'

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(0)

  const [addDriverModal, setAddDriverModal] = useState(false)

  const timeoutId = useRef(-1)

  useEffect(() => {
    fetchShipments()

    return () => {
      if (timeoutId.current && timeoutId.current > -1) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const fetchShipments = () => {
    requester
      .get('/shipment')
      .then((res) => {
        if (res.status === 'success') {
          setShipments(res.payload)
        }
        timeoutId.current = setTimeout(() => fetchShipments(), 3000)
      })
      .catch(() => {
        timeoutId.current = setTimeout(() => fetchShipments(), 3000)
      })
  }

  const list = useMemo(() => {
    return shipments.map((g) => {
      const datetime = g.location_updated_at
        ? moment(new Date(g.location_updated_at))
        : null
      const isOnline =
        datetime && datetime.toDate().getTime() > new Date().getTime() - 60000
      const status = getRouteStatus(g.last_route)
      return {
        isOnline,
        status,
        label: getRouteStatusText(status),
        datetime,
        colorBg:
          status === 1 || status === 3
            ? g.last_route.received_at
              ? 'rgba(46,125,50,0.1)'
              : 'rgba(255,241,118,0.3)'
            : isOnline
            ? 'rgba(46,125,50,0.1)'
            : 'rgba(255,241,118,0.3)',
        icon:
          status === 1 || status === 3 ? (
            <span
              className='material-symbols-outlined'
              style={{
                fontSize: 30,
                color: g.last_route.received_at ? '#2E7D32' : '#F9A825',
              }}
            >
              inventory_2
            </span>
          ) : (
            <span
              className='material-symbols-outlined'
              style={{
                fontSize: 30,
                color: isOnline ? '#2E7D32' : '#F9A825',
              }}
            >
              local_shipping
            </span>
          ),
        ...g,
      }
    })
  }, [shipments])

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
                  // onClick={() => setSelectedDriver(g.id)}
                >
                  <div
                    className={
                      'p-2 me-3 d-flex rounded-circle justify-content-center align-items-center'
                    }
                    style={{
                      backgroundColor: g.colorBg,
                    }}
                  >
                    {g.icon}
                  </div>
                  <div className={'flex-grow-1'}>
                    <div style={{fontSize: 24}}>{g.title}</div>
                    <div className={'text-muted'}>{g.label}</div>
                    <div className={'my-2 text-muted'}>
                      <div>
                        Отправитель:{' '}
                        <strong>
                          {g.last_route.sender.full_name} (+
                          {g.last_route.driver.phone_number})
                        </strong>
                      </div>
                      <div>
                        Водитель:{' '}
                        <strong>
                          {g.last_route.driver.full_name} (+
                          {g.last_route.driver.phone_number})
                        </strong>
                      </div>
                      <div>
                        Получатель:{' '}
                        <strong>
                          {g.last_route.receiver ? (
                            <>
                              {g.last_route.receiver.full_name} (+
                              {g.last_route.receiver.phone_number})
                            </>
                          ) : (
                            <i>нет данных</i>
                          )}
                        </strong>
                      </div>
                    </div>
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
    </>
  )
}
