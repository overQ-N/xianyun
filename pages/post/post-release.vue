<template>
  <div class="container">
    <div class="release">
      <h3>发表新攻略</h3>
      <p>分享你的个游记,让更多人看到哦!</p>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item class="editor" prop="content">
          <client-only>
            <quill-editor v-model="form.content" :options="editorOption" />
          </client-only>
        </el-form-item>
        <el-form-item label="选择城市" label-width="80px" class="city" prop="cityName">
          <el-autocomplete
            v-model="form.cityName"
            :fetch-suggestions="queryCity"
            placeholder="请搜索游玩城市"
            style="width: 200px;"
            @select="handleDepartSelect"
          />
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button type="primary" size="mini" @click="releasePost">
          发布
        </el-button>或者
        <span class="release-temp">保存到草稿</span>
      </div>
    </div>
    <div class="temp">
      <div class="draft">
        草稿箱 （0）
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        title: '',
        content: '',
        city: '',
        cityName: ''
      },
      rules: {
        title: [{
          required: true, message: '请输入标题', trigger: 'blur'
        }],
        content: [{
          required: true, message: '请输入内容'
        }],
        cityName: {
          required: true, message: '请选择城市'
        }
      },
      editorOption: {
        // modules: {
        //   ImageExtend: {
        //     name: 'files',
        //     action: this.$axios.defaults.baseURL,
        //     response: (res) => {
        //       console.log(res, 'res---------')
        //     },
        //     headers: (xhr) => {
        //       xhr.setRequestHeader({
        //         Authorization: 'Bearer ' + this.$store.state.user.userInfo.token
        //       })
        //     }
        //   }
        // }
      }
    }
  },
  methods: {
    // 实时搜索城市
    async queryCity (city, cb) {
      if (!city) {
        return false
      }
      const { data: res } = await this.$axios({
        url: '/airs/city',
        params: { name: city }
      })
      const arr = res.data.map((v) => {
        v.value = v.name
        return v
      })
      cb(arr)
    },
    handleDepartSelect (item) {
      this.form.city = item.id
    },
    // 发布文章
    releasePost () {
      this.$refs.formRef.validate(async (valid) => {
        if (!valid) { return false }
        const { data: res } = await this.$axios({
          method: 'post',
          url: '/posts',
          headers: {
            Authorization: 'Bearer ' + this.$store.state.user.userInfo.token
          },
          data: this.form
        })
        if (res.message === '新增成功') {
          this.$message.success(res.message)
          this.form = {
            title: '',
            content: '',
            city: '',
            cityName: ''
          }
        }
        this.$refs.formRef.resetFields()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 1000px;
  margin: 0 auto;
  overflow: hidden;
  margin-top: 25px;
}
.release {
  float: left;
  width: 700px;

  h3 {
    font-weight: normal;
    font-size: 23px;
  }
  p {
    color: #999;
    font-size: 14px;
    padding: 9px 0;
  }
  .editor {
    height: 541px;
    margin-bottom: 0;
    .quill-editor {
      height: 400px;
    }
  }
  /deep/ .el-form-item__label {
    text-align: left;
  }
  .submit {
    font-size: 14px;
    padding: 10px 0;
    margin-bottom: 10px;
    .el-button {
      margin-right: 10px;
    }
    .release-temp {
      color: #ffa500;
    }
  }
}
.temp {
  width: 300px;
  float: right;
  .draft {
    width: 260px;
    height: 41px;
    float: right;
    padding: 10px 5px;
    border: 1px solid #ddd;
  }
}
</style>
