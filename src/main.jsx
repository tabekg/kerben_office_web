import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import 'moment/locale/ru'
import moment from 'moment'

moment.locale('ru')

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <App />
  </>
)
