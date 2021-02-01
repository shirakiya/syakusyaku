import axios from 'axios'

const API_URL_ENV = process.env.API_URL
const API_URL_PRD = API_URL_ENV || 'https://api.syakusyaku.shirakiya.com'
const API_URL_DEV = API_URL_ENV || 'http://localhost:3000'

function getBaseURL() {
  return (process.env.NODE_ENV === 'production') ? API_URL_PRD : API_URL_DEV
}

function getAxios() {
  return axios.create({
    baseURL: getBaseURL(),
    timeout: 10000,
  })
}

export function get(endpoint, params = {}) {
  return getAxios().get(endpoint, {
    params: params,
  })
}

export async function getGeocoderResultFromAddresses(addresses) {
  const responses = await Promise.all(addresses.map(address => {
    const params = {
      'address': address,
    }
    return get('/geocoding', params)
  }))

  return responses.map(response => response.data)
}
