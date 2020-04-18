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
      <el-col v-if="user.userInfo.user.username" :span="3" class="userInfo">
        <img :src="$axios.defaults.baseURL+user.userInfo.user.defaultAvatar" alt="">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ user.userInfo.user.nickname }}
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userCenter">
              个人中心
            </el-dropdown-item>
            <el-dropdown-item command="setting">
              设置
            </el-dropdown-item>
            <el-dropdown-item command="logout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col v-else :span="3" class="user">
        <nuxt-link to="/user">
          登录
        </nuxt-link>/
        <nuxt-link to="/user">
          注册
        </nuxt-link>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
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
    },
    ...mapState(['user'])
  },
  methods: {
    // 菜单激活的回调
    handleItem (index) {
      this.activeIndex = index
    },
    // 用户中心的处理
    handleCommand (key) {
      // 如果点击了用户中心
      if (key === 'userCenter') {

      } else if (key === 'setting') { // 设置
      } else if (key === 'logout') { // 退出
        this.$store.commit('user/setuserInfo', { user: {} })
        this.$message.success('退出成功')
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~assets/variable.less";
.container {
  border-bottom: 1px solid #dddddd;
  box-shadow: 0 3px 3px #ddd;
  .main {
    width: 1000px;
    margin: 0 auto;
    .logo {
      img {
        padding-top: 8px;
        width: 100%;
        height: 100%;
      }
    }
    .menu {
      .el-menu {
        border-bottom: none;
        .el-menu-item {
          font-size: 16px;
          border-bottom: none;
          padding-left: 0;
          padding-right: 0;
          a {
            display: block;
            width: 100%;
            height: 100%;
            padding-left: 20px;
            padding-right: 20px;
          }
          &:hover {
            border-bottom: 5px solid @color-theme!important;
            color: @color-theme;
          }
        }
        .active {
          background: @color-theme;
        }
      }
    }
    .user {
      text-align: center;
      line-height: 60px;
      font-size: 14px;
      color: #666;
      a {
        &:hover {
          color: @color-theme;
        }
      }
    }
    .userInfo{
      height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #666;
      img{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
    }
  }
}
</style>
