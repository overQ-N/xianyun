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
  async login (store, data) {
    const { data: res } = await this.$axios.post('/accounts/login', data)
    store.commit('setuserInfo', res)
    return res
  }
}
