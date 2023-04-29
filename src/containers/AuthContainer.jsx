import {Button} from 'react-bootstrap'
import {useContext} from 'react'
import {RootContext} from '../utils/context.js'

export default function AuthContainer() {
  const root = useContext(RootContext)

  const signIn = () => {
    root.setUser({id: 1, full_name: 'test user'})
  }

  return (
    <>
      <Button onClick={() => signIn()}>Sign in</Button>
    </>
  )
}
