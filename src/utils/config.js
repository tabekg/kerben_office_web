export const DEBUG_MODE = window.location.host.startsWith('localhost')

export const API_URL = DEBUG_MODE
  ? 'http://localhost:5000'
  : 'https://api.kerben.besoft.kg'
export const OFFICE_URL = DEBUG_MODE
  ? 'http://localhost:3000'
  : 'https://office.kerben.besoft.kg'

export const APP_NAME = 'Кербен'
