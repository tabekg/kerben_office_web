import axios from 'axios'
import {API_URL} from './config'
import _storage from './storage'

// const sleep = async ms => new Promise((resolve) => setTimeout(resolve, ms))

async function request(
  url: string,
  method: string,
  params = {},
  no_api = false
) {
  try {
    const data = method === 'get' ? {params} : {data: params}
    const token = _storage.get('token')
    // await sleep(1000)
    return await axios({
      url: API_URL + (no_api ? '' : '/v1') + url,
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
      method,
      ...data,
    })
  } catch (e) {
    console.log(e)
    throw e
  }
}

async function get(url: string, params: {[keyof: string]: any} = {}) {
  return (await request(url, 'get', params))?.data
}

// async function storage(url, params) {
//   return (await request('/storage' + url, 'get', params, true))?.data
// }

async function post(url: string, data = {}) {
  return (await request(url, 'post', data))?.data
}

export default {
  get,
  post,
  // storage,
  // delete: async (url, data) => {
  //   return (await request(url, 'delete', data)).data
  // },
}
