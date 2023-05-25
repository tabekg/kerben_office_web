import {Button, Modal, Form, Spinner} from 'react-bootstrap'
import {useEffect, useState} from 'react'
import requester from '../utils/requester.js'
import {useTranslation} from 'react-i18next'
import Table from 'react-bootstrap/Table'

// eslint-disable-next-line react/prop-types
export default function OperatorsModalComponent({show, setShow}) {
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('+996')
  const [pointId, setPointId] = useState(null)

  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()

  const [step, setStep] = useState(0)
  const [points, setPoints] = useState([])
  const [users, setUsers] = useState([])
  let id = 1

  useEffect(() => {
    requester.get('/point').then((res) => {
      setPoints(res.payload)
    })
  }, [])

  useEffect(() => {
    if (!show) {
      resetForm()
    } else {
      fetchUsers()
    }
  }, [show])

  const fetchUsers = () => {
    if (loading) {
      return
    }
    setLoading(true)
    requester
      .get('/office/user/operator')
      .then((res) => {
        if (res.status === 'success') {
          setUsers(res.payload)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const addSubmit = () => {
    if (fullName.length < 1 || phoneNumber.length < 10 || !pointId || loading) {
      return
    }

    setLoading(true)
    requester
      .post('/office/user/operator', {
        full_name: fullName,
        phone_number: phoneNumber.slice(1),
        point_id: pointId,
      })
      .then((res) => {
        if (res.status === 'success') {
          setUsers((p) => [res.payload, ...p])
          resetForm()
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resetForm = () => {
    setFullName('')
    setPhoneNumber('+996')
    setPointId(null)
    setStep(0)
  }

  return (
    <Modal
      show={show}
      centered
      onHide={() => !loading && setShow(false)}
      size={'lg'}
    >
      <Modal.Header closeButton>
        <Modal.Title>{t('operators')}</Modal.Title>
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

        {step === 0 ? (
          <div className={'d-flex flex-column gap-2'}>
            <div style={{display: 'flex', gap: 15}}>
              <Table striped bordered hover>
                <thead>
                <tr>
                  <th>#</th>
                  <th>Полное имя</th>
                  <th>Номер телефона</th>
                  <th>Местонахождение</th>
                  <th>Действия</th>
                </tr>
                </thead>
                {users.map(g => (
                  <>
                    <tbody>
                    <tr>
                      <td>{id++}</td>
                      <td>{g.full_name}</td>
                      <td>+{g.phone_number}</td>
                      <td>{g.point.title}</td>
                      <td style={{display:'flex'}}>
                        <Button variant="outline-primary" size={'sm'} style={{marginRight:'5px'}}>Редактировать</Button>
                        <Button variant="outline-danger" size={'sm'}>Деактивировать</Button>
                      </td>
                    </tr>


                    </tbody>



                    {g.is_disabled ? (
                      <>
                        {' '}
                        | <span className={'text-danger'}>деактивировано</span>
                      </>
                    ) : null}
                  </>
                ))}
                <div className={'btns'}>

                </div>
              </Table>
            </div>
          </div>
        ) : step === 1 ? (
          <>
            <Form.Group className='mb-3' controlId='newOperatorFullName'>
              <Form.Label>{t('full_name')}</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(t) => setFullName(t.target.value)}
                type='text'
                placeholder={t('full_name')}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='newOperatorPhoneNumber'>
              <Form.Label>{t('phone_number')}</Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={(t) => setPhoneNumber(t.target.value)}
                type='tel'
                placeholder={t('phone_number')}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='newOperatorPointId'>
              <Form.Label>{t('location')}</Form.Label>
              <Form.Select
                value={pointId}
                onChange={(e) =>
                  setPointId(e.target.value ? +e.target.value : null)
                }
                aria-label={t('location')}
              >
                <option>{t('location')}</option>
                {points.map((g) => (
                  <option value={g.id}>{g.title}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={loading}
          variant='outline-secondary'
          onClick={() => (step === 0 ? setShow(false) : resetForm())}
        >
          {t('close')}
        </Button>
        {step === 0 ? (
          <Button
            variant='outline-primary'
            disabled={loading}
            onClick={() => setStep(1)}
          >
            {t('new_operator')}
          </Button>
        ) : step === 1 ? (
          <Button
            variant='outline-primary'
            disabled={
              loading ||
              !pointId ||
              fullName.length < 1 ||
              phoneNumber.length < 10
            }
            onClick={() => addSubmit()}
          >
            {t('add_button')}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  )
}
