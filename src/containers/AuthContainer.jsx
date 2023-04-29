import {Button} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'
import requester from '../utils/requester.js'

export default function AuthContainer() {
  const root = useContext(RootContext)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

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
      <input
        placeholder={'login'}
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        placeholder={'pass'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}
