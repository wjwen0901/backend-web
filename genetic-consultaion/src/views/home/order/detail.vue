<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/order' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{order.tid}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="order-container">
      <el-row :gutter="20">
        <el-button style="float: right;margin-right: 20px;" type="primary" @click="editPay" v-if="order.statusStr != '已完成'">确认支付</el-button>
        <el-col :span="8">
          <el-row class="order-detail">
            <span class="order-detail-title">订单编号:</span>
            <span>{{order.orderNo}}</span>
            <el-tag type="info" size="mini">{{order.statusStr}}</el-tag>
          </el-row>
          <el-row class="order-detail">
            <span class="order-detail-title">检测产品:</span>
            <span>{{order.itemTitle}}</span>
          </el-row>
          <el-row class="order-detail" v-if="skuPropertiesName.length > 0">
            <span class="order-detail-title null-title"></span>
            <span v-for="sku in skuPropertiesName" v-bind:key="sku">
              {{sku.k}}:{{sku.v}}
            </span>
          </el-row>
          <el-row class="order-detail">
            <span class="order-detail-title">下单时间:</span>
            <span>{{order.createTime | formatDate}}</span>
          </el-row>
          <el-row class="order-detail" v-if="order.payTime !== null">
            <span class="order-detail-title">支付时间:</span>
            <span>{{order.payTime | formatDate}}</span>
          </el-row>
          <el-row class="order-detail" v-if="order.payTime !== null">
            <span class="order-detail-title">支付金额:</span>
            <span>{{order.payment}}¥</span>
          </el-row>
          <el-row class="order-detail" v-if="order.payTime !== null">
            <span class="order-detail-title">快递单号:</span>
            <span>{{order.expressCode}}</span>
            <el-button type="text" @click="imgPath(order.expressPath)">查看源文件</el-button>
          </el-row>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row class="order-detail">
            <span class="order-detail-title">知情同意:</span>
            <el-table
              :data="informedList"
              size="mini"
              border
              style="width: 100%">
              <el-table-column
                label="操作"
                width="180">
                <template slot-scope="scope">
                  <div class="img-info">
                    <el-button type="text" @click="imgPath(scope.row.path)">查看源文件</el-button>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="sampleCode"
                label="条码编号"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="sampleCode"
                label="受检者"
                width="180">
                <template slot-scope="scope">
                  {{scope.row.truename}}<span v-if="scope.row.cellphone != null">({{scope.row.cellphone}})</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态"
                width="180">
                <template slot-scope="scope">
                  <el-tag size="mini">{{scope.row.state | stateFilter}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="上传时间">
                <template slot-scope="scope">
                  {{scope.row.createTime | formatDate}}
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-col>
      </el-row>


    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'orderList',
  data () {
    return {
      order: {},
      skuPropertiesName: [],
      informedList: []
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('order/' + this.$route.params.id, {
        params: {
          userId: window.localStorage.userId
        },
      }).then(res => {
        this.order = res.data
        this.order.expressCode = this.$route.query.expressCode
        this.skuPropertiesName = JSON.parse(this.order.skuPropertiesName)
        if (this.$route.query.expressId !== undefined) {
          this.axios.get('express/' + this.$route.query.expressId, {
            params: {
              userId: window.localStorage.userId
            },
          }).then(resExp => {
            this.order.expressCode = resExp.data.expressOrder.expressCode
            this.order.expressPath = resExp.data.expressOrder.path
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('informed/order', {
        params: {
          orderId: this.$route.params.id,
          userId: window.localStorage.userId
        },
      }).then(res => {
        this.informedList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    imgPath (path) {
      this.axios.get('oss/upload/show', {
        params: {
          objectKey: path,
          userId: window.localStorage.userId
        },
      }).then(res1 => {
        window.open(res1.data)
      }).catch(err => {
        console.log(err)
      })
    },
    editPay () {
      this.$alert('一定要确认客户已支付哦！！！', '确认已付款', {
        confirmButtonText: '确定',
        callback: action => {
          this.order.statusStr = '已付款'
          this.order.payTime = new Date()
          var instance = this.axios.create({
            headers: {
              'Authorization': window.localStorage.token,
              'Content-Type': 'application/json'
            }
          })
          let _this = this
          instance({
            method: 'put',
            url: 'order',
            data: this.order,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            },
            params: {
              userId: window.localStorage.userId
            }
          }).then(function (response) {
            _this.$message({
              message: '修改成功',
              type: 'success'
            })
            _this._initData()
          })
        }
      });

    }
  },
  filters: {
    stateFilter: function (state) {
      if (state <= 1) return '实验中'
      if (state === 2) return '无法识别'
      if (state === 3) return '报告已出'
    }
  },
  computed: {},
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this._initData()
    loading.close()
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .order-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .order-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .order-detail {
    margin-bottom: 10px;
    font-size: 14px;
    .order-detail-title {
      font-weight: bold;
      margin-right: 10px;
    }
    .null-title {
      padding-left: 62px;
    }
  }
  .fl-right {
    float: right;
  }
  .img-info {
    img {
      width: 100%;
    }
  }
</style>
