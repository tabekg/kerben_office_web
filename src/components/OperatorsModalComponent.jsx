import {Button, Modal, Form, Spinner, Table} from 'react-bootstrap'
import {useEffect, useState, useCallback, useContext} from 'react'
import requester from '../utils/requester'
import {useTranslation} from 'react-i18next'
import {RootContext} from '../utils/context'

// eslint-disable-next-line react/prop-types
export default function OperatorsModalComponent() {
  const root = useContext(RootContext)
  const [show, setShow] = [root.operatorsModal, root.setOperatorsModal]

  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('+996')
  const [pointId, setPointId] = useState(null)
  const [editingUser, setEditingUser] = useState(null)

  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()

  const [step, setStep] = useState(0)
  const [points, setPoints] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    requester.get('/point').then((res) => {
      setPoints(res.payload)
    })
  }, [])

  useEffect(() => {
    if (!show) {
      resetForm()
      setStep(0)
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

  const resetForm = useCallback(() => {
    setFullName('')
    setPhoneNumber('+996')
    setPointId(null)
    setStep(0)
    setEditingUser(null)
  }, [setEditingUser, setStep, setPointId, setPhoneNumber, setFullName])

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
          setStep(0)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const editSubmit = useCallback(() => {
    if (
      fullName.length < 1 ||
      !editingUser ||
      phoneNumber.length < 10 ||
      !pointId ||
      loading
    ) {
      return
    }

    setLoading(true)
    requester
      .post('/office/user/operator', {
        id: editingUser.id,
        full_name: fullName,
        phone_number: phoneNumber.slice(1),
        point_id: pointId,
      })
      .then((res) => {
        if (res.status === 'success') {
          setUsers((p) =>
            p.map((k) => (k.id === editingUser.id ? res.payload : k))
          )
          resetForm()
          setStep(0)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [
    setLoading,
    fullName,
    editingUser,
    phoneNumber,
    pointId,
    loading,
    resetForm,
    setStep,
  ])

  const deactivate = useCallback(
    (user) => {
      if (loading || !user) {
        return
      }
      if (!window.confirm('Вы уверены деактивировать этого оператора?')) {
        return
      }
      setLoading(true)
      requester
        .post('/office/user/operator/deactivate', {
          user_id: user.id,
        })
        .then((res) => {
          if (res.status === 'success') {
            setUsers((p) => p.map((o) => (o.id === user.id ? res.payload : o)))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [loading, users]
  )

  const close = useCallback(() => {
    resetForm()
    setStep(0)
  }, [setStep, resetForm])

  const activate = useCallback(
    (user) => {
      if (loading || !user) {
        return
      }
      if (!window.confirm('Вы уверены активировать этого оператора?')) {
        return
      }
      setLoading(true)
      requester
        .post('/office/user/operator/activate', {
          user_id: user.id,
        })
        .then((res) => {
          if (res.status === 'success') {
            setUsers((p) => p.map((o) => (o.id === user.id ? res.payload : o)))
          }
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [loading, users]
  )

  const editUser = useCallback(
    (user) => {
      setEditingUser(user)

      setFullName(user.full_name)
      setPhoneNumber('+' + user.phone_number)
      setPointId(user.point.id)

      setStep(1)
    },
    [setEditingUser, setStep]
  )

  const newOperator = useCallback(() => {
    setEditingUser(null)
    resetForm()
    setStep(1)
  }, [setStep, setEditingUser])

  return (
    <Modal
      show={show}
      centered
      onHide={() => !loading && setShow(false)}
      size={'xl'}
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
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Полное имя</th>
                  <th>Телефон номер</th>
                  <th>Точка</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((g) => (
                  <tr>
                    <td>{g.id}</td>
                    <td>{g.full_name}</td>
                    <td>+{g.phone_number}</td>
                    <td>{g.point.title}</td>
                    <td>
                      {g.is_disabled ? (
                        <span className={'text-danger'}>деактивировано</span>
                      ) : (
                        <span className={'text-success'}>активно</span>
                      )}
                    </td>
                    <td className='gap-1 d-flex'>
                      <Button
                        size='small'
                        onClick={() => editUser(g)}
                        variant='info'
                      >
                        Редактировать
                      </Button>
                      {g.is_disabled ? (
                        <Button
                          size='small'
                          onClick={() => activate(g)}
                          variant='success'
                        >
                          Активировать
                        </Button>
                      ) : (
                        <Button
                          size='small'
                          onClick={() => deactivate(g)}
                          variant='danger'
                        >
                          Деактивировать
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
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
          onClick={() => (step === 0 ? setShow(false) : close())}
        >
          {t('close')}
        </Button>
        {step === 0 ? (
          <Button
            variant='outline-primary'
            disabled={loading}
            onClick={() => newOperator()}
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
            onClick={() => (editingUser ? editSubmit() : addSubmit())}
          >
            {editingUser ? t('save_button') : t('add_button')}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  )
}
