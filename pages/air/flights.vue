<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 航班过滤条件 -->
        <!-- -->
        <FlightsFilter :data="filtersObjOrigin" @getFilterAirList="getFilterAirList" />
        <!-- 航班头部布局 -->
        <FlightHeader />
        <!-- 航班信息 -->
        <FlightItem v-for="item in flights" :key="item.id" :data="item" />
        <div v-show="flights.length<=0" class="isNone">
          没有符合条件的航班信息✈~~~
        </div>
        <el-pagination
          :current-page="queryInfo.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
        <FlightsAside />
      </div>
    </el-row>
  </section>
</template>

<script>

// import moment from "moment";
import FlightItem from '@/components/air/FlightItem'
import FlightHeader from '@/components/air/FlightHeader'
import FlightsFilter from '@/components/air/FlightsFilter'
import FlightsAside from '@/components/air/FlightsAside'
export default {
  components: {
    FlightHeader,
    FlightItem,
    FlightsFilter,
    FlightsAside
  },
  data () {
    return {
      // 航班信息
      filtersObjOrigin: {
        options: [],
        info: {},
        flights: []
      },
      // 航班信息的镜像
      flightsObj: {
        options: [],
        info: {},
        flights: []
      },
      // 所有航班列表
      flights: [],
      queryInfo: {
        // 页码
        pageIndex: 1,
        // 条数
        pageSize: 5
      },
      total: 0
    }
  },
  watch: {
    // 当路由发生变化时， 一般是点击历史记录时
    $route () {
      this.getAirs()
    }
  },
  mounted () {
    this.getAirs()
  },
  methods: {
    // 获取城市机票列表
    getAirs () {
      this.$axios.get('/airs', { params: this.$route.query })
        .then(({ data }) => {
          // 储存所有航班信息，用于分页
          this.flightsObj = data
          this.total = data.total
          this.filtersObjOrigin = { ...data }
          // 默认显示第一页数据
          this.flights = data.flights.slice(0, 5)
        })
    },
    handleSizeChange (newSize) {
      this.queryInfo.pageSize = newSize
      this.sliceFlights()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pageIndex = newPage
      this.sliceFlights()
    },
    sliceFlights () {
      const { pageIndex, pageSize } = this.queryInfo
      this.flights = this.flightsObj.flights.slice((pageIndex - 1) * pageSize, pageIndex * pageSize)
    },
    // 接收子组件传过来的符合的条件的航班列表数据
    getFilterAirList (arr) {
      this.flightsObj.flights = arr
      this.total = arr.length
      // 默认显示第一页数据
      this.queryInfo.pageIndex = 1
      this.flights = this.flightsObj.flights.slice(0, 5)
    }
  }
}
</script>

<style scoped lang="less">
    .contianer{
        width:1000px;
        margin:20px auto;
    }

    .flights-content{
        width:745px;
        font-size:14px;
    }

    .aside{
        width:240px;
    }
    .isNone{
      height: 500px;
      text-align: center;
      line-height: 200px;
      color:#999;
    }
</style>
