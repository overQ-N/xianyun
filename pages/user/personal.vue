<template>
  <div class="container">
    <div class="personal">
      个人主页  暂未开通~
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang='less' scoped>
.container{
  position: relative;
  height: 600px;
  .personal{
    position: absolute;
    width: 300px;
    height: 300px;
    left:50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    text-align: center;
    line-height: 300px;
    color: #ddd;
  }
}
</style>
