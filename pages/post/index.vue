<template>
  <div class="container">
    <el-row type="flex" justify="space-between">
      <Tabs :cities="cities" />
      <!-- 文章列表主体 -->
      <div class="content">
        <div class="content-header">
          <input v-model="queryInfo.city" type="text" placeholder="请输入想去的地方,比如:'广州'" @keyup.enter="queryByCity">
          <i class="el-icon-search" @click="queryByCity" />
          <div class="content-header-cities">
            推荐:
            <a href="javascript:;" @click="searchByCity('广州')">广州</a>
            <a href="javascript:;" @click="searchByCity('上海')">上海</a>
            <a href="javascript:;" @click="searchByCity('北京')">北京</a>
          </div>
        </div>
        <div class="content-list">
          <div class="content-list-header">
            <h4 @click="getRecommend">
              推荐攻略
            </h4>
            <el-button type="primary" icon="el-icon-edit">
              写游记
            </el-button>
          </div>
          <!-- 文章列表 -->
          <div class="list">
            <!-- 文章描述 -->
            <div v-for="(item, index) in recommendPost" :key="index">
              <component :is="item.type" :post-data="item" />
            </div>
            <el-pagination
              :current-page="queryInfo.page"
              :page-sizes="[4, 6, 10, 20]"
              :page-size="queryInfo.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import Tabs from '@/components/post/Tabs.vue'
import { OnePic, ThreePic } from '@/components/post/postList'
export default {
  components: {
    Tabs,
    OnePic,
    ThreePic
  },
  data () {
    return {
      activeIndex: 99,
      cities: [],
      // 推荐文章,
      recommendPost: '',
      posts: [],
      // 文章查询
      queryInfo: {
        city: '',
        size: 5,
        page: 1
      },
      // 文章总数
      total: 0
    }
  },
  mounted () {
    this.getCities()
    this.getRecommend()
  },
  methods: {

    // 获取城市列表
    getCities () {
      this.$axios.get('/posts/cities').then(({ data }) => {
        this.cities = data.data.map((v) => {
          v.isShow = false
          return v
        })
      })
    },
    // 获取推荐文章
    getRecommend () {
      this.$axios.get('/posts/recommend').then(({ data }) => {
        this.setComponentType(data.data)
        this.total = data.data.length
      })
    },
    // 设置动态组件的类型
    setComponentType (data) {
      data.forEach((v) => {
        v.type = v.images.length >= 3 ? 'ThreePic' : 'OnePic'
        v.content = v.content.replace(/<img.*>/ig, '')
      })
      this.recommendPost = data
    },
    // 获取文章列表
    getPosts () {
      this.$axios.get('/posts', {
        params: {
          city: this.queryInfo.city
        }
      }).then(({ data }) => {
        this.total = data.total
        this.setComponentType(data.data)
      })
    },
    handleSizeChange (newSize) {
      this.queryInfo.size = newSize
      this.getPosts()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getPosts()
    },
    // 根据城市搜索文章
    queryByCity () {
      this.getPosts()
    },
    searchByCity (city) {
      this.queryInfo.city = city
      this.getPosts()
    }
  }
}
</script>

<style lang='less' scoped>
.container{
  width: 1000px;
  margin: 0 auto;
}
.el-row {
  margin-top: 20px;

}
// 内容主体
.content {
  width: 100%;
  padding-left: 40px;
  position: relative;
  .content-header {
    input {
      height: 32px;
      width: 100%;
      border: 3px solid #ffa500;
      outline: 0;
      padding-left: 20px;
    }
    i {
      position: absolute;
      width: 23px;
      height: 23px;
      color: #ffa500;
      font-size: 23px;
      right: -15px;
      top: 8.5px;
      font-weight: 700;
    }
    .content-header-cities {
      font-size: 12px;
      margin: 13px 0;
      a {
        padding: 0 5px;
        &:hover {
          color: #ffa500;
          text-decoration: underline;
        }
      }
    }
  }
  .content-list {
    .content-list-header {
      width: 100%;
      border-bottom: 1px solid #eeeeee;
      overflow: hidden;
      h4 {
        float: left;
        color: #ffa500;
        border-bottom: 2px solid #ffa500;
        height: 50px;
        line-height: 50px;
        font-weight: normal;
        font-size: 20px;
      }
      .el-button {
        float: right;
      }
    }
  }
  .el-pagination{
    margin: 12px auto;
  }
}

</style>
