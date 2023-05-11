import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useEffect, useRef, useState} from 'react'
import requester from '../utils/requester'
import moment from 'moment'
import React from 'react'
import AddDriverModalComponent from '../components/AddDriverModalComponent.jsx'
import MyVerticallyCenteredModal from './Modal-window'

export default function HomeContainer() {
  const [shipments, setShipments] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(0)

  const [modalShow, setModalShow] = React.useState(false);

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
          backgroundColor: 'white',
        }}
      >
        <Col lg={2} md={4} sm={12}>
          <div className={'driver-list'}>
            {shipments.map((g, i) => {
              // const isOnline =
              //   g.payload &&
              //   g.payload[0]?.timestamp > new Date().getTime() - 30000
              const isOnline = false
              return (
                <div
                  key={i}
                  className={'driver-list-item'}
                  onClick={() => setModalShow(true)}
                >
                  <MyVerticallyCenteredModal
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                  />
                  <div>
                    <div style={{fontSize: 24}}>{g.title}</div>
                    {g.payload ? (
                      <div>
                        {/*{moment(new Date(g.payload[0].timestamp)).fromNow()}*/}
                      </div>
                    ) : null}
                  </div>
                  <div
                    style={{
                      width: 20,
                      flexShrink: 0,
                      height: 20,
                      boxShadow: '1px 1px 1px grey',
                      backgroundColor: isOnline ? 'green' : '#d40a0acc',
                      borderRadius: 10,
                    }}
                  />
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

        <Col lg={10} md={8} sm={12}>
          <MapComponent
            // @ts-ignore
            // selectedDriver={(shipments || []).find(
            //   (g) => g.id === selectedDriver
            // )}
            markers={shipments
              .filter((g) => g.location_lat && g.location_lng)
              .map((g) => ({
                lat: g.location_lat,
                lng: g.location_lng,
                label: g.title,
              }))}
          />
        </Col>
      </Row>
    </>
  )
}
