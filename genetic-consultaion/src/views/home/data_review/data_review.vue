<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>信息复核</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
        <el-form :inline="true" label-width="80px" label-position="left">
          <el-form-item>
            <el-button type="primary" @click="toSendEmail" :disabled="this.multipleSelection.length == 0">邮件发送报告</el-button>
          </el-form-item>
          <el-form-item class="fl-right" label="选择公司">
            <el-select class="width-100-p"
                       v-model="companyId"
                       filterable
                       remote
                       reserve-keyword
                       allow-create
                       default-first-option
                       placeholder="请输入关键词"
                       @change="getData"
                       :remote-method="getCompanyList"
                       :loading="companySelLoading">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="reportList"
        size="mini"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="sampleCode"
          label="编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="solutionName"
          label="项目"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="报告时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="比较">
          <template slot-scope="scope">
            <el-button type="success" size="mini" plain v-if="scope.row.recheckState === 0">
              {{scope.row.recheckState | stateFilter}}</el-button>
            <el-button type="warning" size="mini" plain v-else-if="scope.row.recheckState === 1"
                       @click="toRecheck(scope.row.id, scope.row.informedId)">
              {{scope.row.recheckState | stateFilter}}</el-button>
            <el-button type="danger" size="mini" plain v-else-if="scope.row.id && !scope.row.informedId"
                       @click="toEditReport(scope.row.id, scope.row.informedId)">人工检验</el-button>
            <el-button type="danger" size="mini" plain v-else-if="!scope.row.id && scope.row.informedId"
                       @click="toEditInformed(scope.row.id, scope.row.informedId)">人工检验</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="受检者"
          width="180">
          <template slot-scope="scope">
            {{scope.row.patientCellphone }}
          </template>
        </el-table-column>
        <el-table-column
          prop="salesmanCellphone"
          label="知情来源"
          width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="对照"
          width="60">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="scope.row.id && scope.row.informedId"
                       @click="toRecheck(scope.row.id, scope.row.informedId)" >查看</el-button>
            <el-button type="text" size="small" v-else-if="scope.row.id && !scope.row.informedId"
                       @click="toEditReport(scope.row.id)">完善</el-button>
            <el-button type="text" size="small" v-else-if="!scope.row.id && scope.row.informedId"
                       @click="toEditInformed(scope.row.informedId)">完善</el-button>
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

    <el-dialog title="信息复核" :visible.sync="dialogFormVisible">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <h4>报告 <el-button type="text" @click="toEditReport(report.id)">修改信息</el-button></h4>
            <p>样本编号: {{report.sampleCode}}</p>
            <p>受检者姓名: {{report.truename}}</p>
            <p>电话号码: {{report.cellphone}}</p>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light">
            <h4>知情同意 <el-button type="text" @click="toEditInformed(informed.id)">修改信息</el-button></h4>
            <p>样本编号: {{informed.sampleCode}}</p>
            <p>受检者姓名: {{informed.truename}}</p>
            <p>电话号码: {{informed.cellphone}}</p>
          </div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewPass">确定匹配</el-button>
      </div>
    </el-dialog>

    <el-dialog title="发送报告" :visible.sync="sendEmailFormVisible">
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="选择公司">
            <el-select class="width-100-p"
                       v-model="companyId"
                       filterable
                       remote
                       reserve-keyword
                       allow-create
                       default-first-option
                       placeholder="请输入关键词"
                       :remote-method="getCompanyList"
                       :loading="companySelLoading">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接收邮箱">
            <el-checkbox-group v-model="companyEmail">
              <el-checkbox v-for="email in emailList" :label="email.address" :key="email.id" checked></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="已选报告">
            <el-table
              :data="multipleSelection"
              size="mini"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
              <el-table-column
                prop="sampleCode"
                label="编号"
                width="120">
              </el-table-column>
              <!--<el-table-column-->
                <!--prop="solutionName"-->
                <!--label="项目">-->
              <!--</el-table-column>-->
              <el-table-column
                label="受检者">
                <template slot-scope="scope">
                  {{scope.row.patientName }}({{scope.row.patientCellphone }})
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="sendEmail">发送</el-button>
            <el-button @click="sendEmailFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'ReportList',
  data () {
    return {
      reportList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      dialogFormVisible: false,
      report: {},
      informed: {},
      multipleSelection: [],
      reportIds: [],
      companyId: '',
      companyList: [],
      companySelLoading: false,
      sendEmailFormVisible: false,
      companyEmail: [],
      emailList: []
    }
  },
  methods: {
    _initData () {
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.axios.get('report/recheck', {
        params: {
          userId: window.localStorage.userId,
          companyId: this.companyId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
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
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    toRecheck (id) {
      this.$router.push('/review/detail/' + id)
    },
    toEditReport (id) {
      this.$router.push('/report/edit/' + id)
    },
    toEditInformed (id) {
      this.$router.push('/informed/edit/' + id)
    },
    reviewPass () {
      this.axios.put('report/pass', {
        reportId: this.report.id,
        informedId: this.informed.id
      }).then(res => {
        this.$message({
          message: '审核成功',
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getData()
      }).catch(err => {
        this.$message({
          message: '审核失败',
          type: 'error'
        })
        console.log(err)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      let that = this
      if (this.multipleSelection.length > 0) {
        that.reportIds = []
        this.multipleSelection.forEach(function (item) {
          that.reportIds.push(item.id)
        })
      }
      console.log(that.reportIds)
    },
    toSendEmail () {
      if (this.multipleSelection.length > 0) {
        this.sendEmailFormVisible = true
        this.axios.get('email/address', {
          params: {
            companyId: this.companyId
          }
        }).then(res => {
          this.emailList = res.data
        }).catch(err => {
          console.log(err)
        })
      }
    },
    sendEmail () {
      const params = {
        companyId: this.companyId,
        reportIds: this.reportIds,
        emailAddress: this.companyEmail
      }
      const instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'email/send',
        data: params,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        _this.$message({
          message: '发送成功',
          type: 'success'
        })
        _this._initData()
        _this.sendEmailFormVisible = false
      })
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state === 0) return '完全匹配'
      if (state === 1) return '点击复核'
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
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
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
