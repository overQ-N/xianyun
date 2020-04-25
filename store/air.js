export const state = () => {
  return {
    // 历史搜索航班记录
    searchList: [],
    // 订单详情数据
    orderDetail: {
      seat_infos: {}
    }
  }
}
export const mutations = {
  // 添加历史记录
  setSearchItem (state, data) {
    state.searchList.unshift(data)
    if (state.searchList.length > 8) {
      state.searchList = 8
    }
  },
  // 添加订单详情
  setOrderDetail (state, data) {
    state.orderDetail = data
  }
}
