<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        :class="{active: index === currentTab}"
        @click="handleSearchTab(item, index)"
      >
        <i :class="item.icon" />
        {{ item.name }}
      </span>
    </el-row>

    <el-form
      ref="searchFormRef"
      class="search-form-content"
      label-width="80px"
      :model="form"
      :rules="searchFormRules"
    >
      <el-form-item label="出发城市" prop="departCity">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          class="el-autocomplete"
          @blur="handleDepartBlur"
          @select="handleDepartSelect"
        />
      </el-form-item>
      <el-form-item label="到达城市" prop="destCity">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          class="el-autocomplete"
          @blur="handleDestBlur"
          @select="handleDestSelect"
        />
      </el-form-item>
      <el-form-item label="出发时间" prop="departDate">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          v-model="form.departDate"
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          @change="handleDate"
        />
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">
          搜索
        </el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    // 验证出发城市与目标城市是否一样，如果一致，验证不通过
    const isDepartCity = (rule, value, cb) => {
      if (value === this.form.departCity) {
        cb(new Error('目标城市与出发城市相同'))
      } else {
        cb()
      }
    }
    return {
      tabs: [
        { icon: 'iconfont icondancheng', name: '单程' },
        { icon: 'iconfont iconshuangxiang', name: '往返' }
      ],
      currentTab: 0,
      form: {
        departCity: '',
        destCity: '',
        departCode: '',
        destCode: '',
        departDate: ''
      },
      // 出发城市下拉列表
      departCities: [],
      // 目的城市的下拉列表
      destCities: [],
      // 禁止选中今天之前的日期
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 60 * 60 * 24 * 1000
        }
      },
      // 表单验证
      searchFormRules: {
        departCity: [
          {
            required: true,
            message: '请输入出发城市'
          }
        ],
        destCity: [
          {
            required: true,
            message: '请输入目标城市'
          },
          {
            validator: isDepartCity
          }
        ],
        departDate: [
          {
            required: true,
            message: '请输入出发日期'
          }
        ]
      }
    }
  },
  mounted () {},
  methods: {
    // tab切换时触发
    handleSearchTab (item, index) {},

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch (value, cb) {
      this.queryCity(value, this.form.departCity, true, cb)
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch (value, cb) {
      this.queryCity(value, this.form.destCity, false, cb)
    },
    // 根据输入的城市值返回确却城市列表
    /**
     * @param value input选中的值
     * @param city 出发城市或目的地城市
     * @param isDepartCity 是否为出发城市
     */
    queryCity (value, city, isDepartCity, cb) {
      if (!value) {
        return false
      }
      this.$axios
        .get('/airs/city', { params: { name: city } })
        .then(({ data }) => {
          const citiesList = data.data.map((v) => {
            v.value = v.name.replace('市', '')
            return v
          })
          // 如果是出发城市赋值给出发城市列表，否则赋值给目标城市列表
          if (isDepartCity) {
            this.departCities = citiesList
          } else {
            this.destCities = citiesList
          }
          cb(citiesList)
        })
    },
    // 出发城市下拉选择时触发
    handleDepartSelect (item) {
      this.form.departCity = item.value
      this.form.departCode = item.sort
    },

    // 目标城市下拉选择时触发
    handleDestSelect (item) {
      this.form.destCity = item.value
      this.form.destCode = item.sort
    },
    // 出发城市失去焦点时触发
    handleDepartBlur () {
      // 如果用户没有选择出发城市，默认选中第一个
      if (this.departCities.length <= 0) {
        return false
      }
      this.form.departCity = this.departCities[0].value
      this.form.departCode = this.departCities[0].sort
    },
    // 目标城市失去焦点时触发
    handleDestBlur () {
      // 如果用户没有选择出发城市，默认选中第一个
      if (this.destCities.length <= 0) {
        return false
      }
      this.form.destCity = this.destCities[0].value
      this.form.destCode = this.destCities[0].sort
    },
    // 确认选择日期时触发
    handleDate (value) {},

    // 触发和目标城市切换时触发
    handleReverse () {},

    // 提交表单是触发
    handleSubmit () {
      this.$refs.searchFormRef.validate((valid) => {
        if (!valid) {
          return false
        }
        // 提交表单前把搜索记录存至本地
        this.$store.commit('air/setSearchItem', this.form)
        this.$router.push({
          path: '/air/flights',
          query: this.form
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>
