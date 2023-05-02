import './App.css'
import {useEffect, useMemo, useState} from 'react'
import AuthContainer from './containers/AuthContainer.jsx'
import AppContainer from './containers/AppContainer.jsx'
import {RootContext} from './utils/context.js'
import storage from './utils/storage.js'

function App() {
  const [user, setUser] = useState()
  const [token, setToken] = useState()

  const isAuthorized = useMemo(() => {
    return !!token && !!user
  }, [user, token])

  useEffect(() => {
    if (typeof user === 'undefined' || typeof token === 'undefined') {
      setToken(storage.get('token'))
      setUser(storage.get('user'))
      return
    }

    storage.set('token', token)
    storage.set('user', user)
  }, [user, token])

  const signIn = (u, t) => {
    setToken(t)
    setUser(u)
  }

  const signOut = () => {
    setToken(null)
    setUser(null)
  }

  const rootValue = {
    user,
    setUser,
    signIn,
    signOut,
  }

  if (typeof user === 'undefined' || typeof token === 'undefined') {
    return null
  }

  return (
    <RootContext.Provider value={rootValue}>
      {isAuthorized ? <AppContainer /> : <AuthContainer />}
    </RootContext.Provider>
  )
}

export default App
