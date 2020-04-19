<template>
  <div>
    <el-form ref="form" :model="registerForm" label-width="80px" :rules="registerFormRule">
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" placeholder="用户名/手机号" />
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input v-model="registerForm.captcha" placeholder="验证码">
          <el-button slot="append" @click="getcaptcha">
            发送验证码
          </el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="registerForm.nickname" placeholder="昵称" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item prop="checkPassword">
        <el-input v-model="registerForm.checkPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleRegister">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    const checkePassword = (rule, value, cb) => {
      if (value !== this.registerForm.password) {
        cb(new Error('两次密码不一致'))
      } else {
        cb()
      }
    }
    const checkusername = (rule, value, cb) => {
      if (!(/^1[3456789]\d{9}$/.test(value))) {
        cb(new Error('手机号码格式错误'))
      } else {
        cb()
      }
    }
    return {
      registerForm: {
        username: '13800138001',
        nickname: '',
        captcha: '', // 验证码
        password: '',
        checkPassword: ''
      },
      registerFormRule: {
        username: [
          {
            required: true, message: '请输入用户名/手机号码', trigger: 'blur'
          },
          {
            validator: checkusername, trigger: 'blur'
          }
        ],
        password: [
          {
            required: true, message: '请输入密码', trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true, message: '请输入昵称', trigger: 'blur'
          }
        ],
        captcha: [
          {
            required: true, message: '请输入验证码', trigger: 'blur'
          }
        ],
        checkPassword: [
          {
            required: true, message: '请输入确认密码', trigger: 'blur'
          },
          {
            validator: checkePassword, trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 处理注册
    handleRegister () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) { return false }
        try {
          // 去除确认密码
          const { checkPassword, ...form } = this.registerForm
          const res = await this.$store.dispatch('user/register', form)
          this.$message.success('恭喜你,注册成功')
          // 注册成功自动登录
          this.$store.commit('user/setuserInfo', res)
          this.$router.push('/')
        } catch (error) {

        }
      })
    },
    // 获取手机验证码
    getcaptcha () {
      this.$refs.form.validateField('username', async (valid) => {
        if (valid) { return false }
        const res = await this.$store.dispatch('user/getCode', { tel: this.registerForm.username })
        this.$message.success('模拟验证码为' + '   ' + res.code)
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
  .captcha-wrap{
    width: 100%;
    height: 100%;
  }
  .el-button{
    width: 100%;
  }
}
</style>
