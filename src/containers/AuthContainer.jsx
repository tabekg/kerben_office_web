import {Button} from 'react-bootstrap'
import {useContext, useState} from 'react'
import {RootContext} from '../utils/context.js'

export default function AuthContainer() {
  const root = useContext(RootContext)

  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')

  const signIn = () => {
    root.signIn({id: 1, full_name: 'test user'}, 'test token')
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
