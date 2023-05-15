import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useEffect, useState} from 'react'
import requester from '../utils/requester.js'
import {getRouteInfo} from '../utils/index.jsx'
import moment from 'moment'
import {useTranslation} from 'react-i18next'

function MyVerticallyCenteredModal({shipment, onClose}) {
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

  return (
    <Modal
      show={!!shipment}
      onHide={onClose}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {shipment?.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>{t('please_wait')}</p>
        ) : (
          <>
            {routes.map((g, i) => {
              const route = getRouteInfo(g, t)
              return (
                <>
                  <div
                    key={i}
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
                          <div>
                            {t('state_transport_number_n')}
                            <strong>{route.truck_number}</strong>
                          </div>
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
                                ? moment
                                    .utc(route.created_at)
                                    .format('DD.MM.YYYY HH:mm:ss')
                                : ''}
                            </strong>
                          </div>
                          <div>
                            {t('driver_a_b')}
                            <strong>
                              {route.driver.full_name} (+
                              {route.driver.phone_number})
                            </strong>
                          </div>
                          <div>
                            {t('driver_accepted_a')}
                            <strong>
                              {route.accepted_at ? (
                                moment(route.accepted_at).format(
                                  'DD.MM.YYYY HH:mm:ss'
                                )
                              ) : (
                                <i>{t('no_data')}</i>
                              )}
                            </strong>
                          </div>
                          <div>
                            {t('receiver_a_b')}
                            <strong>
                              {route.receiver ? (
                                <>
                                  {route.receiver.full_name} (+
                                  {route.receiver.phone_number})
                                </>
                              ) : (
                                <i>{t('no_data')}</i>
                              )}
                            </strong>
                          </div>
                          <div>
                            {t('received_a')}
                            <strong>
                              {route.received_at ? (
                                moment(route.received_at).format(
                                  'DD.MM.YYYY HH:mm:ss'
                                )
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
                      <div>
                        <img
                          alt={shipment?.title}
                          src={'https://i.stack.imgur.com/KkwZt.png'}
                          width={120}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )
            })}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>{t('close')}</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MyVerticallyCenteredModal
