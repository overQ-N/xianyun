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
        <p>
          攻略: {{ postDetail.created_at | formatDate }}
          <span>阅读: {{ postDetail.watch }}</span>
        </p>
      </div>
      <div v-html="postDetail.content" />
      <!-- 评论区 -->
      <div class="share">
        <div class="share-edit share-item">
          <i class="el-icon-edit-outline" />
          <span>评论({{ total }})</span>
        </div>

        <div class="share-share share-item">
          <i class="el-icon-share" />
          <span>分享</span>
        </div>
      </div>
      <div class="comment-wrap">
        <div class="comment-title">
          评论
        </div>
        <!-- 发表评论 -->
        <el-input v-model="commentsForm.comment" placeholder="说点什么吧..." type="textarea" resize="none" />
        <div class="comment-release">
          <!-- 图片上传框 -->
          <div class="comment-release-upload">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :file-list="fileList"
              :on-success="handleUpload"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </div>
          <el-button type="primary" size="mini" class="comment-release-submit">
            提交
          </el-button>
        </div>
        <!-- 评论列表 -->
        <div class="comment-list">
          <CommentItem v-for="(item, index) in comments" :key="index" :item="item" :is-last="true" />
          <div v-if="comments.length<=0" class="comment-none">
            暂无评论,赶紧发表评论抢占沙发~
          </div>
        </div>
      </div>
    </div>
    <!-- 相关攻略 -->
    <div class="about-post">
      <h3 class="about-title">
        相关攻略
      </h3>

      <div class="about-list">
        <div
          v-for="item in recommends"
          :key="item.id"
          class="about-list-item"
          @click="goDetail(item.id)"
        >
          <img :src="item.images[0]" alt>
          <div class="item-info">
            <div class="item-title">
              {{ item.title }}
            </div>
            <div class="item-time">
              {{ item.created_at|formatDate }} 阅读 {{ item.watch }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 上传图片预览的弹出框-->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
import CommentItem from '@/components/post/CommentItem'
import { formatDate } from '@/utils/formatDate'
export default {
  filters: {
    formatDate
  },
  components: {
    CommentItem
  },
  data () {
    return {
      postDetail: {},
      recommends: [],
      // 上传图片预览的图片路径
      dialogImageUrl: '',
      // 图片预览的显示与否
      dialogVisible: false,
      fileList: [],
      // 发表评论表单
      commentsForm: {
        comment: ''
      },
      // 评论列表
      comments: [{ pics: [], account: {} }],
      // 评论分页
      queyInfo: {
        // 页码,默认为0
        _start: 0,
        // 每页条数
        _limit: 5,
        // 文章id
        post: ''
      },
      // 评论总数
      total: 0
    }
  },
  mounted () {
    this.getPostDetail(this.$route.query.id)
    this.getRecommend(this.$route.query.id)
  },
  methods: {
    // 获取文章详情
    getPostDetail (id) {
      this.$axios.get('/posts', { params: { id } }).then(({ data }) => {
        this.postDetail = data.data[0]
        this.queyInfo.post = id
        this.getComments()
      })
    },
    // 获取推荐文章
    getRecommend () {
      this.$axios.get('/posts/recommend').then(({ data }) => {
        this.recommends = data.data
      })
    },
    // 获取评论
    getComments () {
      this.$axios({
        url: '/posts/comments',
        params: this.queyInfo
      }).then(({ data }) => {
        console.log(data, 'comments-----')
        this.comments = data.data
        this.total = data.total
      })
    },
    // 点击相关攻略,跳转到相关页面
    goDetail (id) {
      this.$router.push('/post/detail?id=' + id)
      this.getPostDetail(id)
    },
    // 图片上传成功的钩子
    handleUpload (file) {
      console.log(file, '---------')
    },
    // 图片预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(this.fileList)
    },
    // 图片删除
    handleRemove (file) {}
  }
}
</script>

<style lang='less' scoped>
.container {
  width: 1000px;
  margin: 20px auto;
  overflow: hidden;
  .content {
    width: 700px;
    float: left;
    img {
      width: 100%;
    }
    .content-header {
      h1 {
        border-bottom: 1px solid #ddd;
        padding: 21px 0;
      }
      p {
        text-align: right;
        margin: 20px 0;
        color: #999;
        span {
          margin-left: 30px;
        }
      }
    }
    .share {
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      .share-item {
        display: flex;
        align-content: space-between;
        flex-direction: column;
        align-items: center;
        i {
          color: #ffa552;
          font-size: 40px;
        }
        span {
          color: #999;
          font-size: 14px;
        }
      }
      .share-share {
        margin-left: 30px;
      }
    }
    .comment-wrap {
      .comment-title{
        margin-bottom: 10px;
      }
      .comment-release {
        overflow: hidden;
        margin:10px 0;
        .comment-release-upload {
          width: 90%;
          float: left;
          /deep/ .el-upload-list__item {
            width: 100px;
            height: 100px;
          }
          /deep/ .el-upload--picture-card {
            width: 100px;
            height: 100px;
            line-height: 100px;
          }
        }
        .comment-release-submit {
          float: right;
          width: 10%;
        }
      }
    }
  }
  .about-post {
    float: right;
    width: 280px;
    margin-left: 20px;
    .about-title {
      height: 36px;
      line-height: 1.5;
      font-weight: 400;
    }
    .about-list {
      .about-list-item {
        padding: 20px 0;
        border-top: 1px solid #ddd;
        overflow: hidden;
        cursor: pointer;
        &:last-child {
          border-bottom: 1px solid #ddd;
        }
        img {
          width: 100px;
          height: 80px;
          object-fit: cover;
          float: left;
        }
        .item-info {
          float: right;
          width: 170px;
          margin-left: 10px;
          .item-title {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
          .item-time {
            font-size: 12px;
            color: #999;
            position: relative;
            top: 21px;
          }
        }
      }
    }
  }
}
// 评论列表
.comment-list{
  border:1px solid #ddd;
  padding:0 20px;

}
// 没有评论时的显示的内容
.comment-none{
  height: 200px;
  color:#999;
  line-height: 200px;
  text-align: center;
}
</style>
