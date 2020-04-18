<template>
  <div class="container">
    <el-carousel height="700px">
      <el-carousel-item v-for="(item,index) in banners" :key="index">
        <div class="banner-item" :style="`background-image:url(${$axios.defaults.baseURL+item.url})`" />
      </el-carousel-item>
    </el-carousel>
    <div class="input-box">
      <el-row>
        <el-col
          v-for="(item, index) in inputTab"
          :key="index"
          :span="3"
          :class="{active:item.isActive}
          "
          @click.native="handleInputTab(index)"
        >
          {{ item.name }}
        </el-col>
      </el-row>
      <el-row>
        <el-input v-model="searchStr" :placeholder="placeholder" @change="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
        </el-input>
      </el-row>
    </div>
  </div>
</template>

<script>
// import { getBanners } from '@/network/home'
export default {
  components: {
  },
  data () {
    return {
      banners: [],
      searchStr: '',
      placeholder: '搜索城市',
      // 搜索框的导航栏
      inputTab: [
        { name: '攻略', isActive: true, placeholder: '搜索城市', path: '/post?city=' }, { name: '酒店', isActive: false, placeholder: '请输入城市搜索酒店', path: '/hotel?city=' }, { name: '机票', isActive: false, placeholder: null, path: '/air?city=' }
      ]
    }
  },
  async created () {
    const { data: res } = await this.$axios.get('/scenics/banners')
    this.banners = res.data
  },
  methods: {
    handleInputTab (index) {
      this.inputTab.forEach((v, i) => {
        v.isActive = false
        if (index === i) {
          v.isActive = true
          // 如果点击的是机票
          if (!v.placeholder) {
            this.$router.push('/air')
          }
          this.placeholder = v.placeholder
        }
      })
    },
    // input框搜索功能
    handleSearch () {
      const index = this.inputTab.findIndex(v => v.isActive)
      this.$router.push(this.inputTab[index].path + this.searchStr)
    }
  }
}
</script>

<style lang='less' scoped>
.container{
  position: relative;
  .input-box{
    position: absolute;
    width: 555px;
    z-index: 9;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    .el-row:nth-child(1) .el-col{
      height: 42px;
      width:80px;
      line-height: 42px;
      text-align: center;
      background:rgba(0,0,0,.6);
      position: relative;
      cursor: pointer;
       color:rgba(255,255,255,.8);
    }
    .el-row:nth-child(1) .el-col:nth-child(n+2){
      margin-left: 10px;
    }
    .el-row:nth-child(1) .el-col::after{
      position: absolute;
      content: '';
      border-left:5px solid rgba(0,0,0,.6);
      border-right:5px solid transparent;
      border-top:21px solid transparent;
      border-bottom:21px solid rgba(0,0,0,.6);
      right: -10px;
      bottom: 0;
    }
    .el-row:nth-child(1) .active{
      background: rgba(255,255,255,.7);
      color:#000;
      &::after{
         border-left:5px solid rgba(255,255,255,.7);
         border-bottom:21px solid rgba(255,255,255,.7);
      }
    }
    .el-row:nth-child(2) .el-input{
      height: 46px;
      /deep/ .el-input__inner{
        height: 100%;
      }
    }
  }
}
.banner-item{
  height: 100%;
}
</style>
