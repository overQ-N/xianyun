export const state = () => {
  return {
    // 历史搜索航班记录
    searchList: [],
    // 订单详情数据
    orderDetail: {
      seat_infos: {}
    },
    totalPrice: {
      totalPrice: 0, // 总价格
      users: 0// 乘客人数
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
  },
  // 总价格和乘客人数
  setTotalPrice (state, data) {
    state.totalPrice = data
  }
}
