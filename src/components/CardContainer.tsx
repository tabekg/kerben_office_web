import React, {useEffect, useState} from 'react'
import requester from '../utils/requester'
import {Card, Col, Modal, Row} from 'react-bootstrap'
import {From_Point, Payload, Point} from '../containers/Container'
import moment from 'moment'

type CardContainerProps = {
  item: Payload
}

interface PayloadDetail {
    from_point: From_Point | null
    histories: History[]
    id: number
    isEmpty: boolean
    number: string
    point: Point | null
    to_point: From_Point | null
    vehicle_state_number: string
}

interface History {
    created_at: string
    from_point: From_Point | null
    id: number
    point: Point
    to_point: From_Point | null
    vehicle_state_number: string
}

export const CardContainer: React.FC<CardContainerProps> = ({item}) => {
  const [payload, setPayload] = useState<PayloadDetail>()
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const GetDetails = () => {
    handleShow()
    requester.get('/container/' + item.id).then((res) => {
      setPayload(res.payload)
      console.log(res)
    })
  }

  return (
    <div className=''>
      <Card
        style={{height: '100%', width: '', cursor: 'pointer'}}
        onClick={GetDetails}
      >
        <Card.Body>
          <Row>
            <Col style={{flexGrow: 1}}>
              {item.point ? (
                <Card.Title>{item.point.title.ru}</Card.Title>
              ) : (
                <Card.Title>
                  {item.from_point.title.ru} → {item.to_point.title.ru}
                </Card.Title>
              )}
              <Card.Text style={{marginBottom: 0}}>{item.number}</Card.Text>
              <Card.Text>{item.vehicle_state_number}</Card.Text>
            </Col>
            <Col style={{flexGrow: 0, textAlign: 'right', width: 'auto'}}>
              <Card.Title>{item.is_empty ? '🟢' : '🔴'}</Card.Title>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      {show && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className='fs-3'>{payload?.number}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <h4>{payload?.point ? payload?.point.title.ru : payload?.from_point?.title.ru + ' → ' + payload?.to_point?.title.ru}</h4> */}
            <h5>История</h5>
            {payload?.histories.map((itemHistory) => (
              <div key={itemHistory.id} style={{borderBottom: '1px solid #a3a3a3'}}>
                <p style={{fontSize: 20}} className='mb-0'>{itemHistory?.point ? itemHistory?.point.title.ru : itemHistory?.from_point?.title.ru + ' → ' + itemHistory?.to_point?.title.ru}</p>
                <div className="d-flex gap-5 mb-0">
                <p>Время: {moment(itemHistory.created_at).format('LLL')}</p>
                <p style={{ textAlign: 'end'}}>Номер транспорта: {itemHistory.vehicle_state_number}</p>
                </div>
              </div>
            ))}
          </Modal.Body>
        </Modal>
      )}
    </div>
  )
}

export default CardContainer
