<template>
  <div class="container">
    <div class="cart-container">
      <el-tabs type="border-card">
        <el-tab-pane label="登录">
          <LoginForm />
        </el-tab-pane>
        <el-tab-pane label="注册">
          <RegisterForm />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import LoginForm from '@/components/user/LoginForm.vue'
import RegisterForm from '@/components/user/RegisterForm.vue'
export default {
  components: {
    LoginForm,
    RegisterForm
  }
}
</script>

<style lang='less' scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("http://127.0.0.1:1337/assets/images/th03.jfif");
  height: 900px;
}
.cart-container {
  width: 400px;
  /deep/ .el-tabs{
    /deep/ .el-tabs__nav{
      width: 100%;
    }
    .el-tabs__item{
      width: 50%;
      text-align: center;
    }
  }
}
</style>
