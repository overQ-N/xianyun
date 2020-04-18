<template>
  <div class="container">
    <el-row class="main">
      <el-col :span="4" class="logo">
        <nuxt-link to="/">
          <img src="http://157.122.54.189:9093/images/logo.jpg" alt>
        </nuxt-link>
      </el-col>
      <el-col :span="17" class="menu">
        <el-menu mode="horizontal" active-text-color="#fff" text-color="#666">
          <el-menu-item
            v-for="(item, index) in muenItem"
            :key="index"
            :class="muenItem[index].path===path?'active':''"
            @click="handleItem(index)"
          >
            <nuxt-link :to="item.path">
              {{ item.title }}
            </nuxt-link>
          </el-menu-item>
        </el-menu>
      </el-col>

      <el-col :span="3" class="user">
        <nuxt-link to>
          登录
        </nuxt-link>/
        <nuxt-link to>
          注册
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: 0,
      muenItem: [
        { title: '首页', path: '/' },
        { title: '旅游攻略', path: '/post' },
        { title: '酒店', path: '/hotel' },
        { title: '国内机票', path: '/air' }
      ]
    }
  },
  computed: {
    path () {
      return this.$route.path
    }
  },
  methods: {
    // 菜单激活的回调
    handleItem (index) {
      this.activeIndex = index
    }

  }
}
</script>

<style lang='less' scoped>
@import '~assets/variable.less';
.container {
  border-bottom: 1px solid #dddddd;
  box-shadow: 0 3px 3px #ddd;
  .main {
    width: 1000px;
    margin: 0 auto;
    .logo {
      img {
        padding-top:8px;
        width: 100%;
        height: 100%;
      }
    }
    .menu{
      .el-menu{
        border-bottom:none;
        .el-menu-item{
          font-size: 16px;
          border-bottom: none;
          padding-left:0;
          padding-right: 0;
          a{
            display: block;
            width: 100%;
            height: 100%;
            padding-left:20px;
          padding-right: 20px;
          }
          &:hover{
            border-bottom: 5px solid @color-theme!important;
            color:@color-theme;
          }
        }
        .active{
          background: @color-theme;
        }
       }
    }
    .user{
      text-align: center;
      line-height: 60px;
      font-size: 14px;
      color:#666;
      a{
        &:hover{
          color:@color-theme;
        }
      }
    }
  }

}
</style>
