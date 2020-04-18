import { request } from './request'
// 轮播图
const getBanners = () => {
  return request({
    url: '/scenics/banners'
  })
}
export {
  getBanners
}
