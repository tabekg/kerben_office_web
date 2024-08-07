import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import {useCallback, useEffect, useState} from 'react'
import requester from '../utils/requester'
import {getRouteInfo} from '../utils/index'
import moment from 'moment'
import {useTranslation} from 'react-i18next'
import {API_URL} from '../utils/config'
import {Spinner} from 'react-bootstrap'
import {IShipment, IShipmentHistory} from '../types/shipment'

function MyVerticallyCenteredModal({
  shipment,
  onChangeShipment,
  onClose,
}: {
  shipment: IShipment | null
  onChangeShipment: (shipment: IShipment) => void
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [histories, setHistories] = useState<IShipmentHistory[]>([])
  const [item, setItem] = useState<null | IShipment>(null)
  const {t} = useTranslation()

  useEffect(() => {
    if (shipment) {
      setLoading(true)
      requester
        .get('/shipment', {id: shipment.id})
        .then((res) => {
          if (res.status === 'success') {
            setHistories(res.payload.histories)
            setItem(res.payload)
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
    setHistories([])
  }

  const archive = useCallback(() => {
    if (loading || !shipment) {
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
  }, [loading, shipment])

  return (
    <Modal
      show={!!shipment}
      onHide={!loading ? onClose : undefined}
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
          {item?.cmr_path ? (
            <a
              style={{marginBottom: 44, display: 'inline-block'}}
              target='blank'
              href={API_URL + '/storage/cmr/' + item?.cmr_path}
            >
              <img
                src={API_URL + '/storage/cmr/' + item?.cmr_path}
                width={300}
              />
            </a>
          ) : null}
          <div
            style={{width: '100%'}}
            className={'d-flex my-2 justify-content-around align-items-center'}
          >
            <div className={'h5'}>{shipment?.from_point?.title['ru']}</div>
            <span className='material-symbols-outlined' style={{color: 'grey'}}>
              arrow_forward
            </span>
            <div className={'h5'}>{shipment?.to_point?.title['ru']}</div>
          </div>
          {histories.map((g, i) => {
            return (
              <RouteItem
                onChangeStatus={(id, status) => {
                  setHistories((p) =>
                    p.map((g) => {
                      if (g.id === id) {
                        return {...g, cmr_status: status}
                      }
                      return g
                    })
                  )
                }}
                onChangeCmrPath={(id, path) => {
                  setHistories((p) =>
                    p.map((g) => {
                      if (g.id === id) {
                        return {...g, cmr_path: path}
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
        <Button
          onClick={archive}
          disabled={loading || true}
          variant={'outline-danger'}
        >
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
function RouteItem({route, shipment, key, onChangeStatus, onChangeCmrPath}) {
  const {t} = useTranslation()

  const [loading, setLoading] = useState(false)
  const [completeIsOpen, setCompleteIsOpen] = useState(false)
  const [cmrFile, setCmrFile] = useState<File | null>(null)

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

  const complete = useCallback(() => {
    if (loading || route.cmr_status === 'ACCEPTED') {
      return
    }
    if (!completeIsOpen) {
      setCompleteIsOpen(true)
      return
    }
    setLoading(true)

    const formData = new FormData()
    formData.append('id', shipment.id)
    if (cmrFile) {
      formData.append('image', cmrFile)
    }

    requester
      .post('/office/shipment/cmr', formData)
      .then((res) => {
        if (res.status === 'success') {
          onChangeStatus(route.id, 'ACCEPTED')
          onChangeCmrPath(route.id, res.payload.cmr_path)
        }
      })
      .finally(() => {
        setLoading(false)
        setCompleteIsOpen(false)
      })
  }, [
    setLoading,
    loading,
    route,
    shipment,
    cmrFile,
    onChangeCmrPath,
    onChangeStatus,
    completeIsOpen,
    setCompleteIsOpen,
  ])

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
                  {'route.sender.full_name'} (+
                  {'route.sender.phone_number'})
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
              {route.driver_full_name && route.driver_phone_number ? (
                <div>
                  {t('driver_a_b')}
                  <strong>
                    {route.driver_full_name} ({route.driver_phone_number})
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
          ) : route.is_accepted ? (
            <>
              {completeIsOpen ? (
                <>
                  <Button
                    as='label'
                    size={'sm'}
                    style={{alignSelf: 'flex-start', marginRight: 12}}
                    disabled={loading}
                    variant={'warning'}
                  >
                    <input
                      type={'file'}
                      accept='image/*'
                      disabled={loading}
                      onChange={(f) =>
                        f.target.files?.length && setCmrFile(f.target.files[0])
                      }
                      style={{display: 'none'}}
                    />
                    {cmrFile ? cmrFile.name : 'Выберите CMR файл'}
                  </Button>
                </>
              ) : null}
              <Button
                size={'sm'}
                style={{alignSelf: 'flex-start'}}
                onClick={() => complete()}
                disabled={(completeIsOpen ? !cmrFile : false) || loading}
                variant={'danger'}
              >
                Завершить
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default MyVerticallyCenteredModal
