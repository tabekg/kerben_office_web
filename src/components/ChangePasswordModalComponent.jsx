import {Button, Modal, Form} from 'react-bootstrap'
import {useState} from 'react'
import requester from '../utils/requester.js'

// eslint-disable-next-line react/prop-types
export default function ChangePasswordModalComponent({show, setShow}) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const change = () => {
    if (
      currentPassword.length < 1 ||
      newPassword.length < 1 ||
      repeatPassword.length < 1 ||
      repeatPassword !== newPassword ||
      loading
    ) {
      return
    }

    setLoading(true)
    requester
      .post('/user/password', {
        new_password: newPassword,
        current_password: currentPassword,
      })
      .then((res) => {
        if (res.status === 'success') {
          window.alert('Пароль успешно изменено!')
          resetForm()
          setShow(false)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const resetForm = () => {
    setCurrentPassword('')
    setRepeatPassword('')
    setNewPassword('')
  }

  return (
    <Modal show={show} centered onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Сменить пароль</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group
          className='mb-3'
          controlId='changePasswordModalCurrentPassword'
        >
          <Form.Label>Текущий пароль</Form.Label>
          <Form.Control
            value={currentPassword}
            onChange={(t) => setCurrentPassword(t.target.value)}
            type='password'
            placeholder='Текущий пароль'
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='changePasswordModalNewPassword'>
          <Form.Label>Новый пароль</Form.Label>
          <Form.Control
            value={newPassword}
            onChange={(t) => setNewPassword(t.target.value)}
            type='password'
            placeholder='Новый пароль'
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='changePasswordModalNewPassword'>
          <Form.Label>Повторите новый пароль</Form.Label>
          <Form.Control
            value={repeatPassword}
            onChange={(t) => setRepeatPassword(t.target.value)}
            type='password'
            placeholder='Повторите новый пароль'
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
            newPassword.length < 1 ||
            currentPassword.length < 1 ||
            repeatPassword.length < 1 ||
            repeatPassword !== newPassword ||
            loading
          }
          onClick={change}
        >
          Сменить пароль
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
