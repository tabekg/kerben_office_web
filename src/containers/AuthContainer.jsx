import { Button } from 'react-bootstrap'
import { useContext, useState } from 'react'
import { RootContext } from '../utils/context.js'
import requester from '../utils/requester.js'
import Logo from '../assets/logo.png'
import Spinner from 'react-bootstrap/Spinner';


export default function AuthContainer() {
  const root = useContext(RootContext)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [load, setLoad] = useState(true)


  const signIn = () => {
    if (loading) {
      return
    }
    setLoading(true)
    requester
      .post('/auth', {
        type: 'super_admin',
        login,
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
        setLoad(false)
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
    <>
      <div className="main_div" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className='card' style={{ background: 'rgba(8, 14, 44, 0.5)' }}>
          <div className="cont" style={{ display: 'flex', height: '460px', width: '100%', }}>
            <div className="cont2" style={{ height: 'auto', width: '460px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5px 15px' }}>
              <div className="login" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '5px' }}>
                <img className='logo_img' src={Logo} alt="" />
                <h1 style={{ color: 'white', textAlign: 'center' }}>WelCome to Kerben</h1>
                <div className='label_email'>
                  <label
                    className='email'
                    style={{ color: 'white' }}
                    htmlFor=""
                  >Email
                  </label>
                </div>
                <input
                  className="log"
                  placeholder="Your email"
                  type="text"
                  onChange={(e) => setLogin(e.target.value)}
                  style={!load ? { border: "2px solid red" } : { border: "2px solid black" }}
                />
                <label
                  className='password'
                  style={{ color: 'white' }}
                  htmlFor=""
                >
                  Password
                </label>
                <input
                  className="log"
                  placeholder="Your password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => KeyEnter(e.code)}
                  type="password"
                  style={!load ? { border: "2px solid red" } : { border: "2px solid black" }}
                />
                <Button
                  className='log_btn'
                  style={{ backgroundColor: 'violet', color: 'white', width: '100%', fontSize: '18px' }}
                  onClick={() => signIn()}
                >
                  {loading ? <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" /> : 'Sign In'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
