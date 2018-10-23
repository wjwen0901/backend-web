<template>
  <el-container>
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
            <span class="status">{{scope.row.statusStr}}</span>
          </div>
          <div class="item-title">
            {{scope.row.itemTitle}}
            <span class="money">{{scope.row.payment}} ¥</span>
          </div>
          <div class="right-btn">
            <el-button v-if="scope.row.reportNum>0" type="primary" size="mini" plain @click="toShowReport(scope.row.id)">查看报告</el-button>
            <el-button v-if="scope.row.informedNum>0" type="primary" size="mini" plain @click="toShowInformed(scope.row.id, scope.row.tid)">查看知情</el-button>
            <el-button v-if="scope.row.informedNum==0" type="primary" size="mini" plain @click="toUploadInformed(scope.row.id, scope.row.tid)">上传知情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
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
      totalPage: 0
    }
  },
  methods: {
    getList () {
      this.axios.get('order/page', {
        params: {
          openId: this.$route.query.openid
        }
      }).then(res => {
        this.orderList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    toUploadInformed (orderId, orderNo) {
      this.$router.push({path: '/wechat/informed/upload', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo}})
    },
    toUploadReport (orderId, orderNo) {
      this.$router.push({path: '/wechat/report/upload', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo}})
    },
    toShowReport (orderId, orderNo) {
      this.$router.push({path: '/wechat/report/list', query: {openid: this.$route.query.openid, orderId: orderId, orderNo: orderNo}})
    }
  },
  watch: {},
  created () {
    this.getList()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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

</style>
