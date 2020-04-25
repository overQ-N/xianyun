import { Message } from 'element-ui'
export default (nuxt) => {
  nuxt.$axios.onError((err) => {
    if (err) {
      const { message, statusCode } = err.response.data
      if (statusCode === 400) {
        Message.error(message)
      }

      if (statusCode === 403) {
        Message.error('请先登录再进行操作')
        nuxt.redirect('/user')
      }
    }
  })
}
