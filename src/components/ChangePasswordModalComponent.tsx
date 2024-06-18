import {Button, Modal, Form} from 'react-bootstrap'
import {useContext, useState} from 'react'
import requester from '../utils/requester'
import {useTranslation} from 'react-i18next'
import {RootContext} from '../utils/context'

// eslint-disable-next-line react/prop-types
export default function ChangePasswordModalComponent() {
  const root = useContext(RootContext)

  const [show, setShow] = [
    root.changePasswordModal,
    root.setChangePasswordModal,
  ]

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const {t} = useTranslation()

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
          window.alert(t('password_successfully_changed'))
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
        <Modal.Title>{t('change_password')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group
          className='mb-3'
          controlId='changePasswordModalCurrentPassword'
        >
          <Form.Label>{t('current_password')}</Form.Label>
          <Form.Control
            value={currentPassword}
            onChange={(t) => setCurrentPassword(t.target.value)}
            type='password'
            placeholder={t('current_password')}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='changePasswordModalNewPassword'>
          <Form.Label>{t('new_password')}</Form.Label>
          <Form.Control
            value={newPassword}
            onChange={(t) => setNewPassword(t.target.value)}
            type='password'
            placeholder={t('new_password')}
          />
        </Form.Group>
        <Form.Group className='mb-3' controlId='changePasswordModalNewPassword'>
          <Form.Label>{t('repeat_new_password')}</Form.Label>
          <Form.Control
            value={repeatPassword}
            onChange={(t) => setRepeatPassword(t.target.value)}
            type='password'
            placeholder={t('repeat_new_password')}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={loading}
          variant='secondary'
          onClick={() => setShow(false)}
        >
          {t('close')}
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
          {t('change_password')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
