import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useEffect, useState} from 'react'
import requester from '../utils/requester.js'
import {getRouteInfo} from '../utils/index.jsx'
import moment from 'moment'
import {useTranslation} from 'react-i18next'
import {API_URL} from '../utils/config.js'
import {Spinner} from 'react-bootstrap'

function MyVerticallyCenteredModal({shipment, onChangeShipment, onClose}) {
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState([])
  const {t} = useTranslation()

  useEffect(() => {
    if (shipment) {
      setLoading(true)
      requester
        .get('/shipment', {id: shipment.id})
        .then((res) => {
          if (res.status === 'success') {
            setRoutes(res.payload.routes)
          }
        })
        .catch((e) => console.log(e))
        .finally(() => setLoading(false))
    } else {
      reset()
    }
  }, [shipment])

  const reset = () => {
    setLoading(false)
    setRoutes([])
  }

  const archive = () => {
    if (loading) {
      return
    }
    setLoading(true)
    requester
      .post(`/office/shipment/${shipment?.is_archived ? 'unzip' : 'archive'}`, {
        shipment_id: shipment?.id,
      })
      .then((res) => {
        if (res.status === 'success') {
          onChangeShipment({...shipment, is_archived: !shipment.is_archived})
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal
      show={!!shipment}
      onHide={!loading ? onClose : null}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {shipment?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={'position-relative'}>
        {loading ? (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner animation='border' role='status' variant={'primary'}>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
          </div>
        ) : null}

        <>
          {routes.map((g, i) => {
            return (
              <RouteItem
                onChangeStatus={(id, status) => {
                  setRoutes((p) =>
                    p.map((g) => {
                      if (g.id === id) {
                        return {...g, cmr_status: status}
                      }
                      return g
                    })
                  )
                }}
                shipment={shipment}
                key={i}
                route={getRouteInfo(g, t)}
              />
            )
          })}
        </>
      </Modal.Body>
      <Modal.Footer className={'d-flex justify-content-between'}>
        <Button onClick={archive} disabled={loading} variant={'outline-danger'}>
          {shipment?.is_archived ? t('unzip') : t('archive')}
        </Button>
        <Button
          onClick={onClose}
          disabled={loading}
          variant={'outline-secondary'}
        >
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

// eslint-disable-next-line react/prop-types
function RouteItem({route, shipment, key, onChangeStatus}) {
  const {t} = useTranslation()

  const [loading, setLoading] = useState(false)

  const accept = () => {
    if (loading || route.cmr_status === 'ACCEPTED' || !route.cmr_status) {
      return
    }
    setLoading(true)
    requester
      .post('/office/shipment/cmr/accept', {route_id: route.id})
      .then((res) => {
        if (res.status === 'success') {
          onChangeStatus(route.id, 'ACCEPTED')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const reject = () => {
    if (loading || route.cmr_status === 'REJECTED' || !route.cmr_status) {
      return
    }
    setLoading(true)
    requester
      .post('/office/shipment/cmr/reject', {route_id: route.id})
      .then((res) => {
        if (res.status === 'success') {
          onChangeStatus(route.id, 'REJECTED')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <div
        key={key}
        className={'driver-list-item'}
        style={{cursor: 'default'}}
        // onClick={() => setSelectedShipment(g)}
      >
        <div
          className={
            'p-2 me-3 mt-2 d-flex rounded-circle justify-content-center align-items-center'
          }
          style={{
            backgroundColor: route.colorBg,
          }}
        >
          {route.icon}
        </div>
        <div className={'flex-grow-1 d-flex'}>
          <div className={'flex-grow-1'}>
            <div className={'text-muted'}>{route.label}</div>
            <div className={'my-2 text-muted'}>
              {route.truck_number ? (
                <div>
                  {t('state_transport_number_n')}
                  <strong>{route.truck_number}</strong>
                </div>
              ) : null}
              <div>
                {t('sender_a_b')}
                <strong>
                  {route.sender.full_name} (+
                  {route.sender.phone_number})
                </strong>
              </div>
              <div>
                Отправлен в:{' '}
                <strong>
                  {route.created_at
                    ? moment.utc(route.created_at).format('DD.MM.YYYY HH:mm:ss')
                    : ''}
                </strong>
              </div>
              {route.driver ? (
                <div>
                  {t('driver_a_b')}
                  <strong>
                    {route.driver.full_name} (+
                    {route.driver.phone_number})
                  </strong>
                </div>
              ) : null}
              <div>
                {t('driver_accepted_a')}
                <strong>
                  {route.accepted_at ? (
                    moment(route.accepted_at).format('DD.MM.YYYY HH:mm:ss')
                  ) : (
                    <i>{t('no_data')}</i>
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
              <div className={'h5'}>{route.from_point.title}</div>
              <span
                className='material-symbols-outlined'
                style={{color: 'grey'}}
              >
                arrow_forward
              </span>
              <div className={'h5'}>{route.to_point.title}</div>
            </div>
          </div>
          {route.cmr_path ? (
            <div className={'d-flex flex-column gap-2'}>
              <a
                target={'_blank'}
                href={`${API_URL}/storage/cmr/${route.cmr_path}`}
              >
                <img
                  alt={shipment?.title + ' ' + route.truck_number}
                  src={`${API_URL}/storage/cmr/${route.cmr_path}`}
                  width={120}
                />
              </a>
              {route.cmr_status !== 'ACCEPTED' ? (
                <>
                  <Button
                    size={'sm'}
                    onClick={() => accept()}
                    disabled={loading}
                    variant={'success'}
                  >
                    {t('cmr_accept_button')}
                  </Button>
                  <Button
                    size={'sm'}
                    onClick={() => reject()}
                    disabled={loading || route.cmr_status === 'REJECTED'}
                    variant={'danger'}
                  >
                    {t('cmr_reject_button')}
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MyVerticallyCenteredModal
