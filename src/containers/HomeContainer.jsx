import {Col, Row} from 'react-bootstrap'
import MapComponent from '../components/MapComponent'
import {useEffect, useRef, useState} from 'react'
import requester from '../utils/requester'

export default function HomeContainer() {
  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(0)

  const timeoutId = useRef(-1)

  useEffect(() => {
    fetchDrivers()

    return () => {
      if (timeoutId.current && timeoutId.current > -1) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [])

  const fetchDrivers = () => {
    requester
      .get('/office/driver')
      .then((res) => {
        if (res.status === 'success') {
          setDrivers(res.payload)
        }
        timeoutId.current = setTimeout(() => fetchDrivers(), 3000)
      })
      .catch(() => {
        timeoutId.current = setTimeout(() => fetchDrivers(), 3000)
      })
  }

  return (
    <>
      <Row
        style={{
          flexGrow: 1,
          gap: 0,
          backgroundColor: 'white',
        }}
      >
        <Col lg={3} md={4} sm={12}>
          <div className={'driver-list'}>
            {drivers.map((g, i) => {
              const isOnline =
                g.payload &&
                g.payload[0]?.timestamp > new Date().getTime() - 30000
              return (
                <div
                  key={i}
                  className={'driver-list-item'}
                  onClick={() => setSelectedDriver(g.id)}
                >
                  <div>
                    <div style={{fontSize: 24}}>{g.full_name}</div>
                    {g.payload ? (
                      <div>{new Date(g.payload[0].timestamp).toString()}</div>
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
            <div
              className={'driver-list-item justify-content-center'}
              style={{color: 'grey'}}
            >
              Добавить новый водитель
            </div>
          </div>
        </Col>
        <Col lg={9} md={8} sm={12}>
          <MapComponent
            // @ts-ignore
            selectedDriver={(drivers || []).find(
              (g) => g.id === selectedDriver
            )}
            markers={drivers}
          />
        </Col>
      </Row>
    </>
  )
}
