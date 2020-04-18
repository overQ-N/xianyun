import axios from 'axios'

const instance1 = axios.create({
  baseURL: 'http:127.0.0.1:1337',
  timeout: 10000
})
const request = (config) => {
  return instance1(config)
}
export {
  request
}
