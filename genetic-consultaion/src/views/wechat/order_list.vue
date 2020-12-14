<template>
  <el-container>
    <el-main class="order-container">
      <el-table
        :data="orderList"
        style="width: 100%"
        size="mini">
        <el-table-column
          prop="tid">
          <template slot-scope="scope">
            <div class="order-title">
              <div>
                订单编号：{{scope.row.tid}}
              </div>
              <div>
                创建时间：{{scope.row.createTime | formatDate}}
              </div>
              <div>
                下单人：{{scope.row.fullName}}({{scope.row.cellphone}})
              </div>
              <div v-if="scope.row.pName != undefined">
                受检者：{{scope.row.pName}}({{scope.row.pCellphone}})
              </div>
              <span class="status">{{scope.row.statusStr}}</span>
            </div>
            <div class="item-title">
              {{scope.row.itemTitle}}
              <span class="money">{{scope.row.payment}} ¥</span>
            </div>
            <div class="express" v-if="scope.row.expressCode != undefined">
              <p>快递单号：{{scope.row.expressCode}}</p>
            </div>
            <div class="right-btn">
              <el-button v-if="scope.row.reportNum>0" type="primary" size="mini" plain @click="toShowReport(scope.row.id)">查看报告</el-button>
              <el-button v-if="scope.row.informedNum>0" type="primary" size="mini" plain @click="toShowInformed(scope.row.id, scope.row.tid)">查看知情</el-button>
              <el-button v-if="scope.row.expressCode>0" type="primary" size="mini" plain @click="toShowExpress(scope.row.id, scope.row.tid, scope.row.expressId)">查看快递单</el-button>
              <el-button v-if="scope.row.expressCode == undefined" type="primary" size="mini" plain @click="toUploadExpress(scope.row.id, scope.row.tid)">上传快递单</el-button>
              <el-button v-if="scope.row.informedNum==0" type="primary" size="mini" plain @click="toUploadInformed(scope.row.id, scope.row.tid)">上传知情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'informed_list',
  data () {
    return {
      orderList: [],
      pageNum: 1,
      pageSize: 100,
      totalPage: 0,
      companyId: 0
    }
  },
  methods: {
    getList () {
      this.axios.get('order/page', {
        params: {
          openId: this.$route.query.openid,
          companyId: this.$route.query.companyId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.companyId = res.data.companyId
        this.orderList = res.data.pageList.list
        this.pageSize = res.data.pageList.pageSize
        this.pageNum = res.data.pageList.pageNum
        this.totalPage = res.data.pageList.total
      }).catch(err => {
        console.log(err)
      })
    },
    toUploadInformed (orderId, orderNo) {
      this.$router.push({path: '/wechat/informed/upload', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId}})
    },
    toUploadReport (orderId, orderNo) {
      this.$router.push({path: '/wechat/report/upload', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId}})
    },
    toShowReport (orderId, orderNo) {
      this.$router.push({path: '/wechat/report/list', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId}})
    },
    toShowInformed (orderId, orderNo) {
      this.$router.push({path: '/wechat/informed/list', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId}})
    },
    toUploadExpress (orderId, orderNo, expressId) {
      this.$router.push({path: '/wechat/express/upload', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId, expressId: expressId}})
    },
    toShowExpress (orderId, orderNo, expressId) {
      this.$router.push({path: '/wechat/express/show', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo, companyId: this.companyId, expressId: expressId}})
    }
  },
  watch: {},
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.getList()
    loading.close()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .order-container {
    padding: 0;
  }
  .search-input {
    margin-top: 10px;
  }
  .order-title {
    position: relative;
    div {
      line-height: 18px;
    }
    .status {
      position: absolute;
      right: 0;
      bottom: 2px;
    }
  }
  .item-title {
    position: relative;
    padding: 8px 0px;
    font-size: 14px;
    font-weight: bold;
    .money {
      position: absolute;
      right: 0;
      bottom: 10px;
      font-size: 12px;
      color: #E6A23C;
      display: inline-block;
    }
  }
  .right-btn {
    .el-button {
      margin-left: 10px;
      float: right;
    }
  }
  .express {
    margin: 0;
    position: relative;
    p {
      margin: 0;
    }
    :before {
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
      content: '';
      display: block;
      height: 1px;
      background: #EBEEF5;
    }
  }
</style>
