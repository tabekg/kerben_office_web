import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'

export default function HomeContainer() {
  return (
    <>
      <Row
        style={{
          flexGrow: 1,
        }}
      >
        <Col lg={3} md={4} sm={12}>
          <h1>This is HomeContainer</h1>
        </Col>
        <Col lg={9} md={8} sm={12}>
          <MapComponent />
        </Col>
      </Row>
    </>
  )
}
