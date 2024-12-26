import React, {useEffect, useState} from 'react'
import CardContainer from '../components/CardContainer'
import requester from '../utils/requester'
import {Button, Col, Row} from 'react-bootstrap'

export interface Payload {
  from_point: any
  id: number
  is_empty: boolean
  number: string
  point: Point
  to_point: any
  vehicle_state_number: string
}

export interface From_Point {
  id: number
  title: Title
}

export interface To_Point {
  id: number
  title: Title
}

export interface Point {
  id: number
  title: Title
}

export interface Title {
  cn: string
  en: string
  ru: string
}

type ContainerProps = {}

export const Container: React.FC<ContainerProps> = ({}) => {
  const [payload, setPayload] = useState<Payload[]>([])

  const reloadCards = () => {
    requester.get('/container').then((res) => {
      setPayload(res.payload)
      console.log(res)
    })
  }

  useEffect(() => {
    requester.get('/container').then((res) => {
      setPayload(res.payload)
      console.log(res)
    })
  }, [])

  return (
    <div className='d-flex flex-column p-3'>
      <div className='d-flex justify-content-between gap-5 mb-3 align-items-center'>
        <h1 className='h3 text-white'>Контейнеры</h1>
        <Button onClick={() => reloadCards()}>Обновить</Button>
      </div>
      <Row>
        {payload &&
          payload.map((item) => (
            <Col md={3}   className='align-self-stretch mb-4' key={item.id}>
              <CardContainer item={item}/>
            </Col>
          ))}
      </Row>
    </div>
  )
}

export default Container
