import {Button, ButtonGroup, Card, Col, Form, Row} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context'
import requester from '../utils/requester'
import Logo from '../assets/logo.png'
import {useTranslation} from 'react-i18next'
import {LANGUAGES} from '../utils/config'

export default function AuthContainer() {
  const root = useContext(RootContext)
  const {t} = useTranslation()

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
        roles: ['SUPER_ADMIN', 'ACCOUNTANT'],
        phone_number: phoneNumber.slice(1),
        password,
      })
      .then((res) => {
        if (res.status === 'success') {
          window.alert(`${t('welcome_a')}${res.payload.user.full_name}!`)
          root.signIn(res.payload.user, res.payload.token)
        } else {
          window.alert(t('unknown_error'))
        }
      })
      .catch((e) => {
        console.log(e)
        if (e?.response) {
          if (e?.response?.data?.status === 'wrong_password') {
            window.alert(t('incorrect_password'))
          } else if (e?.response?.data?.status === 'not_found') {
            window.alert(t('user_not_found'))
          } else {
            window.alert(t('unknown_error'))
          }
        } else {
          window.alert(t('connection_error'))
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
            <h2 className='text-white text-center mb-4'>
              {t('welcome_to_kerben_control_panel')}
            </h2>

            <Form.Group className='mb-3' controlId='login'>
              <Form.Label className='text-white'>
                {t('your_phone_number')}
              </Form.Label>
              <Form.Control
                className='w-100'
                type='text'
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                disabled={loading}
                placeholder={t('your_phone_number')}
              />
            </Form.Group>

            <Form.Group className='mb-5' controlId='password'>
              <Form.Label className='text-white'>
                {t('your_password')}
              </Form.Label>
              <Form.Control
                className='w-100'
                type='password'
                placeholder={t('your_password')}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={loading}
              />
            </Form.Group>

            <div className='d-flex justify-content-center align-items-center'>
              <Button
                disabled={
                  loading || phoneNumber.length < 1 || password.length < 1
                }
                onClick={() => signIn()}
                className='px-5'
              >
                {loading ? t('please_wait') : t('sign_in')}
              </Button>
            </div>

            <ButtonGroup className={'mt-5'} size={'sm'}>
              {LANGUAGES.map((g, i) => (
                <Button
                  variant={root.language === g.code ? 'info' : 'secondary'}
                  key={i}
                  onClick={() => root.setLanguage(g.code)}
                >
                  {g.title}
                </Button>
              ))}
            </ButtonGroup>
          </Card>
        </Col>
      </div>
    </Row>
  )
}
