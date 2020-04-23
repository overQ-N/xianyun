<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        <!-- 航班往返信息，出发城市，目标城市，日期 -->
        {{ data.info.departCity }} - {{ data.info.destCity }}
        /
        {{ data.info.departDate }}
      </el-col>
      <el-col :span="4">
        <!-- @change="handleAirport" -->
        <el-select v-model="airport" size="mini" placeholder="起飞机场">
          <!-- 可选机场 -->
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <!-- @change="handleFlightTimes" -->
        <el-select v-model="flightTimes" size="mini" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <!-- @change="handleCompany" -->
        <el-select v-model="company" size="mini" placeholder="航空公司">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-col>
      <el-col :span="4">
        <!-- @change="handleAirSize" -->
        <el-select v-model="airSize" size="mini" placeholder="机型">
          <el-option
            v-for="(item, index) in airSizeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button
        type="primary"
        round
        plain
        size="mini"
        @click="handleFiltersCancel"
      >
        撤销
        <div>{{ filter }}</div>
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 所有航班信息 包括info ,flights ,options
    data: {
      type: Object,
      default: () => {
        return {
          flights: []
        }
      }
    }
  },
  data () {
    return {
      airport: '', // 机场
      flightTimes: '', // 出发时间
      company: '', // 航空公司
      airSize: '', // 选中的机型大小
      // 机型列表
      airSizeList: [{ value: 'L', label: '大' }, { value: 'M', label: '中' }, { value: 'S', label: '小' }]
    }
  },
  computed: {
    filter () {
      const option = {
        org_airport_name: this.airport,
        airline_name: this.company,
        plane_size: this.airSize
      }
      const flightTimes = this.flightTimes
      const hasValue = Object.keys(option).filter(key => option[key])
      let arr = []
      arr = this.data.flights.filter((v) => {
        return hasValue.every((key) => {
          if (flightTimes) {
            console.log(flightTimes)
            const time = flightTimes.split(',')
            const current = v.dep_time.split(':')[0]
            return +time[0] <= +current && +current < time[1] && option[key] === v[key]
          } else {
            return option[key] === v[key]
          }
        })
      })
      if (this.airport || this.company || this.airSize) {
        this.$emit('getFilterAirList', arr)
      }
      // this.$emit('getFilterAirList', arr.slice(0, 3))
      return ''
    }
  },
  methods: {
    // 选择机场时候触发
    // handleAirport (value) {

    // },

    // // 选择出发时间时候触发
    handleFlightTimes (value) {
      if (this.airport || this.company || this.airSize) {
        return false
      }
      const arr = this.data.flights.filter((v) => {
        const time = this.flightTimes.split(',')
        const current = v.dep_time.split(':')[0]
        return +time[0] <= +current && +current < time[1]
      })
      this.$emit('getFilterAirList', arr)
    },

    // // 选择航空公司时候触发
    handleCompany (value) {
      // 符合选中条件的航班列表
      const arr = this.data.flights.filter(v => v.airline_name === this.company)
      this.$emit('getFilterAirList', arr)
    },

    // // 选择机型时候触发
    // handleAirSize (value) {

    // },

    // 撤销条件时候触发
    handleFiltersCancel () {

    }
  }
}
</script>

<style scoped lang="less">
    .filters{
        margin-bottom:20px;
    }

    .filters-top{
        > div{
            /deep/ .el-select{
                margin-left:10px;
            }
        }
    }

    .filter-cancel{
        margin-top:10px;
    }
</style>
