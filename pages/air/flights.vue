<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <FlightHeader />

        <!-- 航班头部布局 -->
        <FlightItem v-for="item in flights" :key="item.id" :data="item" />
        <el-pagination
          :current-page="queryInfo.pageIndex"
          :page-sizes="[5, 10, 20, 40]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!-- 航班信息 -->
        <div />
      </div>
      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>

// import moment from "moment";
import FlightItem from '@/components/air/FlightItem'
import FlightHeader from '@/components/air/FlightHeader'

export default {
  components: {
    FlightHeader,
    FlightItem
  },
  data () {
    return {
      // 航班信息
      flightsObj: {},
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
  computed: {
    // 切割机票数据，用于分页

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
</style>
