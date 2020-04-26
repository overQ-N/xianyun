<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人{{ totalPrice }}</h2>
      <el-form ref="orderFormRef1" class="member-info" :model="orderForm" :rules="orderFormRules">
        <div v-for="(item, index) in orderForm.users" :key="index" class="member-info-item">
          <el-form-item label="乘机人类型" prop="users" :show-message="false">
            <el-input v-model="item.username" placeholder="姓名" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1" />
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型" prop="users">
            <el-input v-model="item.id" placeholder="证件号码" class="input-with-select">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true" />
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">
        添加乘机人
      </el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div v-for="(item,index) in detail.insurances" :key="index" class="insurance-item">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleInsurance(item.id)"
          />
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form ref="orderFormRef2" label-width="80px" :model="orderForm" :rules="orderFormRules">
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="orderForm.contactName" />
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input v-model="orderForm.contactPhone" placeholder="请输入内容">
              <template slot="append">
                <el-button @click="handleSendCaptcha">
                  发送验证码
                </el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="orderForm.captcha" />
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">
          提交订单{{ totalPrice }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    const checkUsers = (rule, value, cb) => {
      let valid = true
      value.forEach((v) => {
        if (!valid) {
          return false
        }
        if (v.username.trim() === '') {
          valid = false
          return cb(new Error('请填写乘客信息'))
        }
        if (v.id.trim() === '') {
          valid = false
          return cb(new Error('请填写乘客证件信息'))
        }
      })
      if (valid) {
        cb()
      }
    }
    return {
      orderForm: {
        // 验证码
        captcha: '',
        users: [{ username: '', id: '' }],
        // 保险
        insurances: [],
        // 联系人
        contactName: '',
        contactPhone: '',
        invoice: '',
        seat_xid: '',
        air: '' // 航班id
      },
      detail: { seat_infos: {} },
      orderFormRules: {
        users: [
          {
            validator: checkUsers,
            trigger: 'blur'
          }
        ],
        contactName: [
          {
            required: true,
            message: '请填写联系人信息'
          }
        ],
        contactPhone: [
          {
            required: true,
            message: '请填写联系人号码'
          }
        ],
        captcha: [
          {
            required: true,
            message: '请填写验证码'
          }
        ]
      }
    }
  },
  computed: {
    // 计算总价
    totalPrice () {
      let price = 0
      // 机票价
      price += this.detail.seat_infos.org_settle_price
      // 燃油机建费用
      price += this.detail.airport_tax_audlet
      // 保险费用
      this.orderForm.insurances.forEach((v) => {
        this.detail.insurances.forEach((item) => {
          if (v === item.id) {
            price += item.price
          }
        })
      })
      price *= this.orderForm.users.length
      this.$store.commit('air/setTotalPrice', { totalPrice: price, users: this.orderForm.users.length })
      return ''
    }
  },

  mounted () {
    const { id } = this.$route.query
    const seatXid = this.$route.query.seat_xid
    // 把航班id和座位赋值给表单
    this.orderForm.air = id
    this.orderForm.seat_xid = seatXid
    this.getInsurance(id, seatXid)
  },
  methods: {
    getInsurance (id, seatXid) {
      // 获取保单列表
      this.$axios({
        url: '/airs/' + id,
        params: {
          seat_xid: seatXid
        }
      }).then(({ data }) => {
        this.detail = data
        this.$store.commit('air/setOrderDetail', this.detail)
      })
    },
    // 添加乘机人
    handleAddUsers () {
      this.orderForm.users.push({
        username: '',
        id: ''
      })
    },
    // 选择保险时触发
    handleInsurance (id) {
      // 如果表单中已存在，再次选择时删除
      // 如果表单中没有，则添加
      const index = this.orderForm.insurances.findIndex(v => v === id)
      if (index === -1) {
        this.orderForm.insurances.push(id)
      } else {
        this.orderForm.insurances.splice(index, 1)
      }
    },
    // 移除乘机人
    handleDeleteUser (index) {
      this.orderForm.users.splice(index, 1)
    },

    // 发送手机验证码
    handleSendCaptcha () {
      if (this.orderForm.contactPhone) {
        this.$store
          .dispatch('user/getCode', { tel: this.orderForm.contactPhone })
          .then((res) => {
            this.$message.success('验证码发送成功,模拟验证码为', res.code)
          })
      } else {
        this.$refs.orderFormRef2.validateField('contactPhone')
      }
    },

    // 提交订单
    handleSubmit () {
      let valid1 = false
      this.$refs.orderFormRef2.validate((valid) => {
        if (!valid) { return false }
        valid1 = true
      })
      this.$refs.orderFormRef1.validate((valid) => {
        if (!valid) { return false }
        if (valid1 && valid) {
          this.$axios({
            method: 'POST',
            url: '/airorders',
            data: this.orderForm,
            headers: {
              Authorization: 'Bearer ' + this.$store.state.user.userInfo.token
            }
          }).then(({ data }) => {
            this.$message.success('创建订单成功!')
            const { id } = data.data
            this.$router.push({
              path: '/air/pay',
              query: {
                id
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
