<template>
  <el-container>
    <el-table
      :data="reportList"
      style="width: 100%"
      size="mini">
      <el-table-column
        prop="tid">
        <template slot-scope="scope">
          <div class="order-title">
            <div>
              受检者姓名：{{scope.row.patientName}}({{scope.row.patientCellphone}})
            </div>
            <div>
              创建时间：{{scope.row.createTime | formatDate}}
            </div>
          </div>
          <div class="item-title">
            {{scope.row.solutionName}}
          </div>
          <div class="right-btn">
            <el-button type="primary" size="mini" plain @click="toReportDetail(scope.row.id)">查看报告</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-container>
</template>
<script>
export default {
  name: 'report_list',
  data () {
    return {
      reportList: [],
      pageNum: 1,
      pageSize: 100,
      totalPage: 0
    }
  },
  methods: {
    getList () {
      this.axios.get('report/wechat', {
        params: {
          openid: this.$route.query.openid,
          orderId: this.$route.query.orderId
        }
      }).then(res => {
        this.reportList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    toReportDetail (id) {
      this.axios.get('report/' + id).then(res => {
        this.report = res.data
        this.axios.get('oss/upload/show', {
          params: {
            objectKey: res.data.path
          }
        }).then(res1 => {
          this.$router.push({path: '/report/view/', query: {path: res1.data}})
        }).catch(err => {
          console.log(err)
        })
      }).catch(err => {
        console.log(err)
      })
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
