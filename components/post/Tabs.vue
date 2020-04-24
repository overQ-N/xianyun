<template>
  <div class="menu">
    <div class="menu-tab" @mouseleave="handleLeave">
      <div v-for="(item, index) in cities" :key="index" class="tab">
        <div
          :class="['menu-tab-item',index===0?'bd-top':'']"
          @mouseenter="handleHover(index)"
        >
          {{ item.type }}
        </div>
        <div v-show="item.isShow" class="menu-content">
          <div
            v-for="(item2, index2) in item.children"
            :key="index2"
            :class="['menu-content-item',index2===activeIndex?'bd-none':'']"
          >
            <i>{{ index2+1 }}</i>
            <nuxt-link :to="`/post?city=${item2.city}`" class="city">
              {{ item2.city }}
            </nuxt-link>
            <nuxt-link :to="`/post?city=${item2.city}`" class="info">
              {{ item2.desc }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="recommend">
      <div class="title">
        推荐城市
      </div>
      <nuxt-link to="#">
        <img src="http://157.122.54.189:9093/images/pic_sea.jpeg" alt>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: ['cities'],
  data () {
    return {
      activeIndex: 99
    }
  },
  methods: {
    // 城市菜单列表鼠标移入  显示右侧内容
    handleHover (index) {
      this.activeIndex = index
      this.cities.forEach((v, i) => {
        if (this.activeIndex === i) {
          v.isShow = true
          return
        }
        v.isShow = false
      })
    },
    // 城市菜单列表移出隐藏右侧内容
    handleLeave () {
      this.activeIndex = 99
      this.cities.forEach((v) => {
        v.isShow = false
      })
    }
  }
}
</script>

<style lang='less' scoped>
.menu {
    position: relative;
    .menu-tab {
      width: 260px;
      .menu-tab-item {
        position: relative;
        height: 42px;
        box-sizing: border-box;
        border-bottom: 1px solid #ddd;
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        padding: 0 18px;
        font-size: 14px;
        line-height: 42px;
        &::after {
          content: "";
          position: absolute;
          display: block;
          width: 10px;
          height: 10px;
          border-right: 1px #999 solid;
          border-top: 1px solid #999;
          transform: rotate(45deg);
          right: 18px;
          top: 14px;
        }
      }
      .bd-top {
        border-top: 1px solid #ddd;
      }
      .menu-tab-item:hover {
        color: #ffa500;
        border-right: 0;
        &::after {
          border-color: #ffa500;
        }
      }
      .active {
        color: #ffa500;
        &::after {
          border-color: #ffa500;
        }
      }
    }
    .menu-content {
      position: absolute;
      width: 350px;
      left: 260px;
      top: 0;
      border: 1px solid #ddd;
      border-left: 0 none;
      margin-left: -1px;
      z-index: 9;
      background: #fff;
      .menu-content-item {
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        color: #ffa500;
        padding-left: 18px;
        border-left: 1px solid #ddd;

        i {
          font-size: 24px;
          font-style: italic;
        }
        .city {
          margin: 0 18px;
        }
        .info {
          color: #999999;
        }
      }
      .bd-none {
        border-left: none;
      }
    }
  }
  .recommend {
    width: 260px;
    .title {
      border-bottom: 1px solid #ddd;
      padding: 12px 0px;
      margin: 10px 0px;
    }
    img {
      width: 100%;
    }
  }
</style>
