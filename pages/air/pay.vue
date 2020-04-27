<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额 <span class="pay-price">￥ {{ detail.price }}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row
          type="flex"
          justify="space-between"
          align="middle"
          class="pay-qrcode"
        >
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage" />
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt="">
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import QRcode from 'qrcode'
export default {
  data () {
    return {
      detail: {},
      timer: null
    }
  },
  mounted () {
    this.getOrderDetail()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    getOrderDetail () {
      setTimeout(() => {
        this.$axios({
          url: '/airorders/' + this.$route.query.id,
          headers: {
            Authorization: 'Bearer ' + this.$store.state.user.userInfo.token
          }
        })
          .then(({ data }) => {
            this.detail = data
            const canvas = document.querySelector('#qrcode-stage')
            QRcode.toCanvas(canvas, this.detail.payInfo.code_url, {
              width: 200
            })
            return data
          })
          .then((res) => {
            return new Promise((resolve, reject) => {
              this.timer = setInterval(() => {
                const checkpay = this.$axios({
                  url: 'airorders/checkpay',
                  method: 'POST',
                  headers: {
                    Authorization: 'Bearer ' + this.$store.state.user.userInfo.token
                  },
                  data: {
                    id: res.id,
                    nonce_str: res.price,
                    out_trade_no: res.orderNo
                  }
                })
                resolve(checkpay)
              }, 3000)
            })
          })
          .then((res) => {
            if (res.data.statusTxt === '支付完成') {
              clearInterval(this.timer)
              this.$message.success('订单支付完成')
              this.$router.push('/air')
            }
          })
      }, 10)
    }
  }
}
</script>

<style scoped lang="less">
.container{
    background:#f5f5f5;
    padding: 30px 0;

    .main{
        width:1000px;
        margin:0 auto;

        .pay-title{
            text-align: right;
            span{
                font-size:28px;
                color:orangered;
            }
        }

        .pay-main{
            background:#fff;
            margin-top:10px;
            border-top: 5px orange solid;
            padding:30px;

            h4{
                font-size: 28px;
                font-weight: normal;
                margin-bottom: 10px;
            }

            .pay-qrcode{
                padding:0 80px;
            }

            .qrcode{
                border:1px #ddd solid;
                padding:15px;
                height: fit-content;

                #qrcode-stage{
                    width:200px;
                    height:200px;
                    margin-bottom: 10px;
                }

                p{
                    line-height: 2;
                    text-align: center;
                }
            }
        }
    }
}
</style>
