<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/post' }">
        旅游攻略
      </el-breadcrumb-item>
      <el-breadcrumb-item>攻略详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 文章主体 -->
    <div class="content">
      <div class="content-header">
        <h1>{{ postDetail.title }}</h1>
        <p>攻略: 2019-05-22 1:16 <span>阅读: {{ postDetail.watch }}</span></p>
      </div>
      <div v-html="postDetail.content" />
    </div>
    <!-- 相关攻略 -->
    <div class="about-post" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      postDetail: {}
    }
  },
  mounted () {
    console.log(this.$route.query)
    this.getPostDetail()
  },
  methods: {
    getPostDetail () {
      this.$axios
        .get('/posts', { params: { id: this.$route.query.id } })
        .then(({ data }) => {
          console.log(data)
          this.postDetail = data.data[0]
        })
    }
  }
}
</script>

<style lang='less' scoped>
.container{
  width:1000px;
  margin:20px auto;
  overflow: hidden;
  .content{
    width:700px;
    float: left;
    img{
      width: 100%;
    }
    .content-header{
      h1{
        border-bottom: 1px solid #ddd;
        padding: 21px 0
      }
      p{
        text-align: right;
        margin: 20px 0;
        color:#999;
        span{
          margin-left:30px;
        }
      }
    }

  }
  .about-post{
    float: right;
  }
}
</style>
