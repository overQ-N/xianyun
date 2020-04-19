<template>
  <div class="three">
    <div class="title">
      <nuxt-link :to="'/post/detail?id='+postData.id">
        {{ postData.title }}
      </nuxt-link>
    </div>
    <div class="info">
      <nuxt-link
        class="desc"
        :to="'/post/detail?id='+postData.id"
      >
        <div v-html="postData.content" />
      </nuxt-link>
      <div class="imgs">
        <img
          v-for="(item, index) in postData.images.slice(0,3)"
          :key="index"
          :src="item"
          alt
        >
      </div>
      <div class="info-about">
        <div class="left">
          <i class="el-icon-location-outline">{{ postData.cityName }}</i> by
          <nuxt-link to="/user/personal">
            <img src="http://157.122.54.189:9095/assets/images/avatar.jpg" alt>
            <i class="user">地球发动机</i>
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
  name: 'ThreePic',
  props: ['postData']
}
</script>

<style lang='less' scoped>
.three {
  border-bottom: 1px solid #ddd;
  padding: 24px 0;
  .title {
    font-size: 18px;
    margin-bottom: 16px;
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
  .imgs {
    overflow: hidden;
    margin: 10px 0;
    img {
      width: 33.3333%;
      height: 150px;
      object-fit: cover;
      float: left;
    }
  }
  .info-about {
    overflow: hidden;
    margin-top: 10px;
    .left {
      font-size: 12px;
      float: left;
      color: #c4a6b3;
      img{
        width:15px;
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
      // font-size: 14px;
      color: #ffa500;
    }
  }
}

</style>
