import { Message } from 'element-ui'
export default ({ $axios }) => {
  $axios.onError((err) => {
    if (err) {
      const { message } = err.response.data
      Message.error(message)
    }
  })
}
