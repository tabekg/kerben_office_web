import {Button, Card, Col, Form, Row} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import requester from '../utils/requester.js'
import Logo from '../assets/logo.png'

export default function AuthContainer() {
  const root = useContext(RootContext)

  const [phoneNumber, setPhoneNumber] = useState('+996')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const signIn = () => {
    if (loading || phoneNumber.length < 1 || password.length < 1) {
      return
    }
    setLoading(true)
    requester
      .post('/auth', {
        roles: ['SUPER_ADMIN'],
        phone_number: phoneNumber.slice(1),
        password,
      })
      .then((res) => {
        if (res.status === 'success') {
          window.alert(`Добро пожаловать, ${res.payload.user.full_name}!`)
          root.signIn(res.payload.user, res.payload.token)
        } else {
          window.alert('Неизвестная ошибка!')
        }
      })
      .catch((e) => {
        console.log(e)
        if (e?.response) {
          if (e?.response?.data?.status === 'wrong_password') {
            window.alert(`Неверный пароль!`)
          } else if (e?.response?.data?.status === 'not_found') {
            window.alert(`Пользователь не найден!`)
          } else {
            window.alert('Неизвестная ошибка!')
          }
        } else {
          window.alert('Ошибка соединения!')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Row style={{height: '100vh'}}>
      <div className={'d-flex justify-content-center align-items-center'}>
        <Col xl={3} xxl={3} lg={4} md={4} sm={10} xs={12}>
          <Card
            style={{
              background: 'rgba(8, 14, 44, 0.8)',
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
            }}
            className={'p-5'}
          >
            <div
              className={
                'd-flex justify-content-center align-items-center mb-3'
              }
            >
              <img src={Logo} alt='Logo Kerben' />
            </div>
            <h2 className={'text-white text-center mb-4'}>
              Добро пожаловать в панель управления Кербен
            </h2>

            <Form.Group className='mb-3' controlId='login'>
              <Form.Label className={'text-white'}>
                Ваш телефон номер
              </Form.Label>
              <Form.Control
                className={'w-100'}
                type='text'
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                disabled={loading}
                placeholder='Ваш телефон номер'
              />
            </Form.Group>

            <Form.Group className='mb-5' controlId='password'>
              <Form.Label className={'text-white'}>Ваш пароль</Form.Label>
              <Form.Control
                className={'w-100'}
                type='password'
                placeholder='Ваш пароль'
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading}
              />
            </Form.Group>

            <div className={'d-flex justify-content-center align-items-center'}>
              <Button
                disabled={
                  loading || phoneNumber.length < 1 || password.length < 1
                }
                onClick={() => signIn()}
                className={'px-5'}
              >
                {loading ? 'Подождите...' : 'Войти'}
              </Button>
            </div>
          </Card>
        </Col>
      </div>
    </Row>
  )
}
