export const state = () => {
  return {
    // 历史搜索航班记录
    searchList: []
  }
}
export const mutations = {
  setSearchItem (state, data) {
    state.searchList.unshift(data)
    if (state.searchList.length > 8) {
      state.searchList = 8
    }
  }
}
