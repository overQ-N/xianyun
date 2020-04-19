<template>
  <div class="one">
    <img
      :src="postData.images[0]"
      class="img"
    >
    <div class="info">
      <nuxt-link :to="'/post/detail?id='+postData.id" class="title">
        {{ postData.title }}
      </nuxt-link>
      <nuxt-link
        :to="'/post/detail?id='+postData.id"
        class="desc"
      >
        <div v-html="postData.content" />
      </nuxt-link>
      <div class="info-about">
        <div class="left">
          <i class="el-icon-location-outline">{{ postData.cityName }}</i> by
          <nuxt-link to="/user/personal">
            <img :src="postData.account.defaultAvatar?$axios.defaults.baseURL+postData.account.defaultAvatar:'http://157.122.54.189:9095/assets/images/avatar.jpg'" alt>
            <i class="user">{{ postData.account.nickname || '地球发动机' }}</i>
          </nuxt-link>
          <i class="el-icon-view">{{ postData.watch?postData.watch:0 }}</i>
        </div>
        <div class="right">
          {{ postData.like?postData.like:0 }}赞
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'OnePic',
  props: ['postData']
}
</script>

<style lang='less' scoped>
.one {
  width: 100%;
  height: 150px;
  padding:20px 0;
  border-bottom: 1px solid #eee;
  .img {
    width: 220px;
    height: 150px;
    object-fit: cover;
    float: left;
  }
  .info {
    float: right;
    width:480px;
    box-sizing: border-box;
    padding-left: 10px;
    .title {
      font-size: 18px;
      margin-bottom: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &:hover {
        color: #ffa500;
      }

    }
     .desc {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        font-size: 14px;
        color: #666;
      }
      .info-about {
        overflow: hidden;
        margin-top: 35px;
        .left {
          font-size: 12px;
          float: left;
          color: #c4a6b3;
          img{
            width: 15px;
            height: 15px;
            vertical-align: bottom;
          }
          i{
        padding:0 5px;
      }
          .user {
            color: #ffa500;
          }
        }
        .right {
          float: right;
          color: #ffa500;
        }
      }
  }
}
</style>
