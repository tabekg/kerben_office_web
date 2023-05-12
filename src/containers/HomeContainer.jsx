import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useEffect, useMemo, useRef, useState} from 'react'
import requester from '../utils/requester'
import moment from 'moment'
import React from 'react'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import MyVerticallyCenteredModal from './Modal-window'
import {
  getLastRouteInfoByShipment,
  getRouteStatus,
  getRouteStatusText,
} from '../utils/index.jsx'

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedShipment, setSelectedShipment] = useState(0)

  const [modalShow, setModalShow] = React.useState(false)

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
      return getLastRouteInfoByShipment(g)
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
                    <div style={{fontSize: 24}}>{g.title}</div>
                    <div className={'text-muted'}>{g.label}</div>
                    <div className={'my-2 text-muted'}>
                      <div>
                        Гос. номер транспорта:{' '}
                        <strong>{g.last_route.truck_number}</strong>
                      </div>
                      <div>
                        Отправитель:{' '}
                        <strong>
                          {g.last_route.sender.full_name} (+
                          {g.last_route.sender.phone_number})
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

      <MyVerticallyCenteredModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />
    </>
  )
}
