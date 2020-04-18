<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" :rules="loginFormRule">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" type="password" placeholder="密码" />
      </el-form-item>
      <nuxt-link to="">
        忘记密码
      </nuxt-link>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '13800138000',
        password: '123456'
      },
      loginFormRule: {
        username: [
          {
            required: true, message: '请输入用户名/手机号码', trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return false }
        await this.$store.dispatch('user/login', this.form)
        this.$message.success('登录成功,正在跳转')
        this.$refs.form.resetFields()
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      })
    }
  }
}
</script>

<style lang='less' scoped>
@import '~assets/variable.less';
.el-form{
  /deep/ .el-form-item__content{
    margin-left: 0!important;
  }
  a{
    color:@color-theme;
    float: right;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .el-button{
    width: 100%;
  }
}
</style>
