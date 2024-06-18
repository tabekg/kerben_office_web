import ReactDOM from 'react-dom/client'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import 'moment/dist/locale/ru.js'
import 'moment/dist/locale/zh-cn.js'
import moment from 'moment'
import storage from './utils/storage.js'

moment.locale(
  storage.get('language', 'ru') === 'cn'
    ? 'zh-cn'
    : storage.get('language', 'ru')
)

// @ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
