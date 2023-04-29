import './App.css'
import {useState} from 'react'
import AuthContainer from './containers/AuthContainer.jsx'
import AppContainer from './containers/AppContainer.jsx'
import {RootContext} from './utils/context.js'

function App() {
  const [user, setUser] = useState(null)

  const rootValue = {
    user,
    setUser,
  }

  return (
    <RootContext.Provider value={rootValue}>
      {user ? <AppContainer /> : <AuthContainer />}
    </RootContext.Provider>
  )
}

export default App
