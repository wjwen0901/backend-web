<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>元鹊管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
        <el-input placeholder="请输入下单人姓名/手机号/检测项目" v-model="condition" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <el-table
        :data="orderList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="tid"
          label="订单编号"
          width="184">
        </el-table-column>
        <el-table-column
          prop="itemTitle"
          label="检测项目">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="solutionName"-->
          <!--label="实验室"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="payment"
          label="支付价格"
          width="120">
          <template slot-scope="scope" v-if="scope.row.payment !== undefined">
            {{scope.row.payment}}¥
          </template>
        </el-table-column>
        <el-table-column
          label="下单人"
          width="180">
          <template slot-scope="scope">
            {{scope.row.fullName}}({{scope.row.cellphone}})
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="报告时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="订单状态"
          width="70">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="250">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="toUploadInformed(scope.row.id)">上传知情</el-button>
            <el-button type="text" size="medium" @click="toUploadReport(scope.row.id)"
                       v-if="scope.row.reportNum === 0 && roleCode === 'manager'">上传报告</el-button>
            <el-button type="text" size="medium" @click="toInformedDetail(scope.row.id)">查看</el-button>
            <!--<el-button type="text" size="medium" @click="toEdit">编辑</el-button>-->
            <!--<el-button type="text" size="medium" @click="toUploadInformed(scope.id)" v-if="ro">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 150]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'orderList',
  data () {
    return {
      orderList: [],
      pageNum: window.sessionStorage.orderPageNum === undefined ? 1 : window.sessionStorage.orderPageNum,
      pageSize: window.sessionStorage.orderPageSize === undefined ? 20 : window.sessionStorage.orderPageSize,
      totalPage: 0,
      dialogFormVisible: false,
      multipleSelection: [],
      reportIds: [],
      companyId: '',
      companyList: [],
      companySelLoading: false,
      sendEmailFormVisible: false,
      companyEmail: [],
      emailList: [],
      roleCode: window.localStorage.role,
      condition: null
    }
  },
  methods: {
    _initData () {
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.axios.get('order/user', {
        params: {
          userId: window.localStorage.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition
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
    getCompanyList () {
      this.axios.get('company/CustCompany', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.orderPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.orderPageNum = val
      this.getData()
    },
    toRecheck (reportId, informedId) {
      this.axios.get('report/recheck/' + reportId, {
        params: {
          informedId: informedId
        }
      }).then(res => {
        this.informed = res.data.informed
        this.report = res.data.report
        this.dialogFormVisible = true
      }).catch(err => {
        console.log(err)
      })
    },
    toUploadInformed (id) {
      this.$router.push({path: '/informed/upload', query: {orderId: id}})
    },
    toUploadReport (id) {
      this.$router.push({path: '/report/upload', query: {orderId: id}})
    },
    toInformedDetail (id) {
      this.$router.push('/order/' + id)
    }
  },
  filters: {},
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
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .search-box {
      width: 400px;
      float: right;
      margin-bottom: 10px;
    }
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .search-box {
    min-height: 30px;
    padding-bottom: 10px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 10px 20px;
  }
  .fl-right {
    float: right;
  }
</style>
