import {Button, Modal, Form} from 'react-bootstrap'
import {Dispatch, SetStateAction, useState} from 'react'
import requester from '../utils/requester.js'
import {useTranslation} from 'react-i18next'

// eslint-disable-next-line react/prop-types
export default function AddDriverModalComponent({
  show,
  setShow,
}: {
  show: boolean
  setShow: Dispatch<SetStateAction<boolean>>
}) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')

  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()

  const add = () => {
    if (
      login.length < 1 ||
      password.length < 1 ||
      fullName.length < 1 ||
      loading
    ) {
      return
    }

    setLoading(true)
    requester
      .post('/office/user/driver', {
        login,
        password,
        full_name: fullName,
      })
      .then((res) => {
        if (res.status === 'success') {
          window.alert('Водитель успешно добавлено!')
          resetForm()
          setShow(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resetForm = () => {
    setLogin('')
    setPassword('')
    setFullName('')
  }

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Добавить новый водитель</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className='mb-3' controlId='addDriverModalLogin'>
          <Form.Label>Полное имя водителя</Form.Label>
          <Form.Control
            value={fullName}
            onChange={(t) => setFullName(t.target.value)}
            type='text'
            placeholder='Полное имя'
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='addDriverModalLogin'>
          <Form.Label>Логин</Form.Label>
          <Form.Control
            value={login}
            onChange={(t) => setLogin(t.target.value)}
            type='text'
            placeholder='Логин'
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='addDriverModalPassword'>
          <Form.Label>Пароль</Form.Label>
          <Form.Control
            value={password}
            onChange={(t) => setPassword(t.target.value)}
            type='password'
            placeholder='Пароль'
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={loading}
          variant='secondary'
          onClick={() => setShow(false)}
        >
          Закрыть
        </Button>
        <Button
          variant='primary'
          disabled={
            login.length < 1 ||
            password.length < 1 ||
            fullName.length < 1 ||
            loading
          }
          onClick={add}
        >
          Добавить
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
