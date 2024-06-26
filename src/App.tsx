import './App.css'
import {useEffect, useMemo, useState} from 'react'
import AuthContainer from './containers/AuthContainer'
import AppContainer from './containers/AppContainer'
import {RootContext} from './utils/context'
import storage from './utils/storage'

import {useTranslation, initReactI18next} from 'react-i18next'
import i18n from 'i18next'
import translationEN from './translations/en.json'
import translationCH from './translations/cn.json'
import translationRU from './translations/ru.json'
import moment from 'moment'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {translation: translationEN},
      cn: {translation: translationCH},
      ru: {translation: translationRU},
    },
    lng:
      storage.get('language', 'ru') === 'cn'
        ? 'zh-cn'
        : storage.get('language', 'ru'),
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  })
  .then()

function App() {
  const {t} = useTranslation()
  const [user, setUser] = useState<undefined | any>()
  const [token, setToken] = useState<undefined | null | string>()
  const [language, setLanguage] = useState(storage.get('language', 'ru'))

  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [operatorsModal, setOperatorsModal] = useState(false)

  useEffect(() => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language).then()
      moment.locale(language === 'cn' ? 'zh-cn' : language)
    }
    document.title = t('kerben_control_panel')
    storage.set('language', language)
  }, [language])

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

  const signIn = (u: any, t: string) => {
    setToken(t)
    setUser(u)
  }

  const signOut = (force = false) => {
    // @ts-ignore
    if (!force && !window.confirm(t('do_you_really_want_to_log_out'))) {
      return
    }

    setToken(null)
    setUser(null)
  }

  const rootValue = {
    user,
    setUser,
    signIn,
    signOut,
    language,
    setLanguage,

    changePasswordModal,
    operatorsModal,
    setChangePasswordModal,
    setOperatorsModal,
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
