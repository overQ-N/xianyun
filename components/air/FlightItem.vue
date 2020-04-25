<template>
  <div class="flight-item">
    <div>
      <!-- 显示的机票信息 -->
      <el-row type="flex" align="middle" class="flight-info" @click.native="showSeat">
        <el-col :span="6">
          <span>{{ data.airline_name }} </span> {{ data.flight_no }}
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="flight-info-center">
            <el-col :span="8" class="flight-airport">
              <strong>{{ data.dep_time }}</strong>
              <!-- 出发机场 -->
              <span>{{ data.org_airport_name }} {{ data.org_airport_quay }}</span>
            </el-col>
            <el-col :span="8" class="flight-time">
              <span>{{ rankTime }}</span>
            </el-col>
            <el-col :span="8" class="flight-airport">
              <strong>{{ data.arr_time }}</strong>
              <span>{{ data.dst_airport_name }} {{ data.dst_airport_quay }}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="flight-info-right">
          ￥<span class="sell-price">{{ data.base_price/2 }}</span>起
        </el-col>
      </el-row>
    </div>
    <div v-show="isShowSeat" class="flight-recommend">
      <!-- 隐藏的座位信息列表 -->
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="4">
          低价推荐
        </el-col>
        <el-col :span="20">
          <el-row
            v-for="(item, index) in data.seat_infos"
            :key="index"
            type="flex"
            justify="space-between"
            align="middle"
            class="flight-sell"
          >
            <el-col :span="16" class="flight-sell-left">
              <span>{{ item.name }}</span> | {{ item.supplierName }}
            </el-col>
            <el-col :span="5" class="price">
              ￥{{ item.settle_price }}
            </el-col>
            <el-col :span="3" class="choose-button">
              <el-button
                type="warning"
                size="mini"
                @click="handleChoose(data.id,item.seat_xid)"
              >
                选定
              </el-button>
              <p>剩余：{{ item.discount }}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 数据
    data: {
      type: Object,
      // 默认是空数组
      default: () => {
        return {}
      }
    }

  },
  data () {
    return {
      isShowSeat: false
    }
  },
  computed: {
    // 计算时间 格式为2小时20分
    rankTime () {
      //  出发时间和到达时间
      const depArr = this.data.dep_time.split(':')
      const destArr = this.data.arr_time.split(':')
      //  处理类似出发时间22：00 到达时间01：20的时间差值小于0的情况
      if (destArr[0] - depArr[0] < 0) {
        destArr[0] = +destArr[0] + 24
      }
      // 时间差值
      const dis = (destArr[0] - depArr[0]) * 60 + (destArr[1] - depArr[1])
      // 时
      const h = Math.floor(dis / 60)
      // 分
      const m = dis % 60
      // if(h<0){

      // }
      return h + '小时' + m + '分'
    }
  },
  methods: {
    // 选定机票时触发，去往创建订单页面
    handleChoose (id, seatid) {
      this.$router.push({
        path: '/air/order',
        query: {
          id,
          seat_xid: seatid
        }
      })
    },
    // 显示低价推荐
    showSeat () {
      this.isShowSeat = !this.isShowSeat
    }
  }
}
</script>

<style scoped lang="less">
    .flight-item{
        border:1px #ddd solid;
        margin-bottom: 10px;

        .flight-info{
            padding:15px;
            cursor: pointer;

            > div{
                &:first-child, &:last-child{
                    text-align: center;
                }
            }
        }

        .flight-info-center{
            padding:0 30px;
            text-align: center;

            .flight-airport{
                strong{
                    display: block;
                    font-size:24px;
                    font-weight: normal;
                }
                span{
                    font-size: 12px;
                    color:#999;
                }
            }

            .flight-time{
                span{
                    display: inline-block;
                    padding:10px 0;
                    border-bottom: 1px #eee solid;
                    color:#999;
                }
            }
        }

        .flight-info-right{

            .sell-price{
                font-size: 24px;
                color:orange;
                margin:0 2px;
            }
        }
    }

    .flight-recommend{
        background: #f6f6f6;
        border-top:1px #eee solid;
        padding:0 20px;

        .flight-sell{
            border-bottom:1px #eee solid;
            padding:10px 0;

            &:last-child{
                border-bottom: none;
            }

            .flight-sell-left{
                font-size: 12px;
                span{
                    color:green;
                }
            }

            .price{
                font-size: 20px;
                color:orange;
            }

            .choose-button{
                text-align: center;
                color:#666;
                button{
                    display: block;
                    width:100%;
                    margin-bottom:5px;
                }
            }
        }
    }
</style>
