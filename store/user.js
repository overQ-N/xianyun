export const state = () => {
  return {
    userInfo: {
      user: {}
    }
  }
}
export const mutations = {
  setuserInfo (state, data) {
    state.userInfo = data
  }
}
export const actions = {
  // 登录接口
  async login (store, data) {
    const { data: res } = await this.$axios.post('/accounts/login', data)
    store.commit('setuserInfo', res)
    return res
  },
  // 获取验证码
  async getCode (store, tel) {
    const { data: res } = await this.$axios.post('/captchas', tel)
    return res
  },
  async register (store, registerForm) {
    const { data: res } = await this.$axios({
      url: '/accounts/register',
      method: 'POST',
      data: registerForm

    })
    return res
  }
}
