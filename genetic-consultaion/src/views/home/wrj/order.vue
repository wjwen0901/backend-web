<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>诠见康-维汝健</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
        <el-form ref="form" :model="searchForm" label-width="80px" size="small">
          <el-row>
            <el-col :span="6">
              <el-form-item label="医院">
                <el-autocomplete
                    class="inline-input"
                  v-model="searchForm.hospitalName"
                  :fetch-suggestions="hospitalQuerySearch"
                  placeholder="请输入内容"
                  :trigger-on-focus="false"
                  @select="hospitalHandleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="科室">
                <el-select class="width-100-p" v-model="searchForm.deptId" filterable placeholder="请选择" @change="getData">
                  <el-option
                    v-for="item in depts"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="患者">
                <el-input v-model="searchForm.patient" placeholder="样本编号/姓名" @change="getData"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select v-model="searchForm.status" placeholder="请选择订单状态" @change="getData">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="待付款" value="0"></el-option>
                  <el-option label="待采样" value="1"></el-option>
                  <el-option label="待回寄" value="2"></el-option>
                  <el-option label="寄样中" value="3"></el-option>
                  <el-option label="检测中" value="4"></el-option>
                  <el-option label="报告已出" value="5"></el-option>
                  <el-option label="已发起解读" value="7"></el-option>
                  <el-option label="已取消" value="10"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下单日期">
                <el-col :span="11">
                  <el-form-item>
                    <el-date-picker type="date" placeholder="开始日期" v-model="searchForm.startDate" style="width: 100%;" @change="getData"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                  <el-form-item>
                    <el-date-picker placeholder="结束日期" v-model="searchForm.endDate" style="width: 100%;" @change="getData"></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="opera-box">
        <el-row>
<!--          <el-button type="primary" size="small" @click="toDistribution">分配解读费用</el-button>-->
<!--          <el-button type="primary" size="small" @click="toDistributionSalesman">分配市场费用</el-button>-->
          <el-button type="success" size="small" @click="confirmMoney">确认到帐</el-button>
        </el-row>
      </div>
      <el-table
        :data="orderList"
        @selection-change="handleSelectionChange"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          fixed
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="下单时间"
          width="136">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="更新时间"
          width="136">
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="订单状态"
          width="100">
        </el-table-column>
        <el-table-column
          prop="payment"
          label="支付价格"
          width="80">
          <template slot-scope="scope" v-if="scope.row.payment !== undefined">
            ¥ {{scope.row.payment}} <span v-if="scope.row.tid">(有赞)</span>
          </template>
        </el-table-column>
        <el-table-column
          label="受检者"
          width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.patientName != undefined">
              <span>
                {{scope.row.patientName}}({{scope.row.patientPhone}})
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sampleCode"
          label="样本编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="hospitalName"
          label="医院"
          width="210">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室"
          width="100">
        </el-table-column>
        <el-table-column
          prop="doctorName"
          label="医生"
          width="80">
        </el-table-column>
        <el-table-column
          prop="solutionName"
          label="检测项目"
          width="200">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="实验室"
          width="180">
        </el-table-column>
        <el-table-column
          label="服务人员"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceName != undefined">
              <span>
                {{scope.row.serviceName}}({{scope.row.servicePhone}})
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="业务代表"
          width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.salesmanName != undefined">
              <span>
                {{scope.row.salesmanName}}({{scope.row.salesmanPhone}})
              </span>
            </span>
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

    <el-dialog title="分账" :visible.sync="dialogDistributionVisible">
      <div>
        <div class="infos">
          <h5>操作说明：</h5>
          <p>1. 按医生、患者、时间等筛选订单, 为避免财务纠纷，目前仅支持选择 "一位" 医生的订单，进行操作</p>
          <p>2. 勾选需要分账的订单</p>
          <p>3. 点击"分账"按钮，显示勾选订单的医生所有的服务人员</p>
        </div>
        <el-form ref="form" :model="distribution" label-width="120px" size="small" style="width: 80%">
          <el-form-item label="相关医生">
            {{distribution.doctorNames}}
          </el-form-item>
          <el-form-item label="选择分配人员">
            <el-select v-model="distribution.userId" filterable placeholder="请选择">
              <el-option
                v-for="item in serviceUserList"
                :key="item.userId"
                :label="item.fullName"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitDistribution(1)">确定</el-button>
            <el-button @click="dialogDistributionVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="市场费用分配" :visible.sync="dialogDistributionSalesVisible">
      <div>
        <div class="infos">
          <h5>操作说明：</h5>
          <p>1. 按医生、患者、时间等筛选订单, 为避免财务纠纷，目前仅支持选择 "一位" 医生的订单，进行操作</p>
          <p>2. 勾选需要分配的订单</p>
          <p>3. 点击"分配市场费用"按钮，显示勾选订单的医生所有的服务人员</p>
        </div>
        <el-form ref="form" :model="distribution" label-width="120px" size="small" style="width: 80%">
          <el-form-item label="相关医生">
            {{distribution.doctorNames}}
          </el-form-item>
          <el-form-item label="选择分配人员">
            <el-select v-model="distribution.userId" filterable placeholder="请选择">
              <el-option
                v-for="item in serviceUserList"
                :key="item.userId"
                :label="item.fullName"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitDistribution(0)">确定</el-button>
            <el-button @click="dialogDistributionSalesVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'orderList',
  data () {
    return {
      orderList: [],
      searchForm: {},
      distribution: {},
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
      depts: [],
      serviceUserList: [],
      roleCode: window.localStorage.role,
      condition: null,
      userId: window.localStorage.userId,
      dialogDistributionVisible: false,
      dialogDistributionSalesVisible: false,
    }
  },
  methods: {
    _initData () {
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.axios.get('order/brca/page', {
        params: {
          userId: window.localStorage.userId,
          hospitalId: this.searchForm.hospitalId,
          deptId: this.searchForm.deptId,
          doctor: this.searchForm.doctor,
          patient: this.searchForm.patient,
          companyId: this.searchForm.companyId,
          status: this.searchForm.status,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate,
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
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
    hospitalQuerySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString
        }
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hospitalHandleSelect (item) {
      this.searchForm.hospitalId = item.id
      this.getData();
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
    toInformedDetail (id, expressCode, expressId) {
      this.$router.push({path: '/order/' + id, query: {expressCode: expressCode, expressId: expressId}})
    },

    // 分账
    toDistribution () {
      let doctorIds = []
      this.serviceUserList = []
      this.distribution.orderIds = []
      this.multipleSelection.forEach(item => {
        this.distribution.orderIds.push(item.orderId)
        if (doctorIds.indexOf(item.doctorId) == -1) {
          doctorIds.push(item.doctorId)
          this.distribution.doctorNames = this.distribution.doctorNames ?  (this.distribution.doctorNames + '  ' + item.doctorName) : item.doctorName
        }
      })
      doctorIds.forEach(item => {
        this.axios.get('doctor/service', {
          params: {
            doctorId: item
          }
        }).then(res => {
          if (res.data.length > 0) {
            this.serviceUserList = this.serviceUserList.concat(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      })


      this.dialogDistributionVisible = true
    },
    // 分账
    toDistributionSalesman () {
      let doctorIds = []
      this.serviceUserList = []
      this.distribution.orderIds = []
      this.multipleSelection.forEach(item => {
        this.distribution.orderIds.push(item.orderId)
        if (doctorIds.indexOf(item.doctorId) == -1) {
          doctorIds.push(item.doctorId)
          this.distribution.doctorNames = this.distribution.doctorNames ?  (this.distribution.doctorNames + '  ' + item.doctorName) : item.doctorName
        }
      })
      doctorIds.forEach(item => {
        this.axios.get('doctor/service', {
          params: {
            doctorId: item
          }
        }).then(res => {
          if (res.data.length > 0) {
            this.serviceUserList = this.serviceUserList.concat(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      })
      this.dialogDistributionVisible = true
    },
    // 分账
    toDistributionSalesman () {
      let doctorIds = []
      this.distribution.orderIds = []
      this.serviceUserList = []
      this.multipleSelection.forEach(item => {
        this.distribution.orderIds.push(item.orderId)
        if (doctorIds.indexOf(item.doctorId) == -1) {
          doctorIds.push(item.doctorId)
          this.distribution.doctorNames = this.distribution.doctorNames ?  (this.distribution.doctorNames + '  ' + item.doctorName) : item.doctorName
        }
      })
      doctorIds.forEach(item => {
        this.axios.get('doctor/salesman', {
          params: {
            doctorId: item
          }
        }).then(res => {
          if (res.data.length > 0) {
            this.serviceUserList = this.serviceUserList.concat(res.data)
          }
        }).catch(err => {
          console.log(err)
        })
      })
      this.dialogDistributionSalesVisible = true
    },
    // 分账
    submitDistribution (serviceType) {
      let _this = this
      this.distribution.serviceType = serviceType
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      instance({
        method: 'post',
        url: 'commission/distribution',
        data: this.distribution,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        _this.$message({
          message: '分账成功',
          type: 'success'
        })
        _this._initData()
        _this.dialogDistributionVisible = false
      })
    },
    confirmMoney () {
      this.multipleSelection.forEach(item => {
        this.axios.get('order/confirm', {
          params: {
            orderId: item.orderId,
            userId: this.userId
          }
        }).then(res => {
          if (res.data == 'success') {
            this.$message({
              message: '确认成功',
              type: 'success'
            })
          }
        }).catch(err => {
          console.log(err)
        })
      })
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
      border: 1px solid #ddd;
      padding: 20px 20px 0 0;
      margin-bottom: 20px;
      .line {
        text-align: center;
      }
    }
    .opera-box {
      padding-bottom: 20px;
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
  .infos {
    margin-bottom: 20px;
    background: #eee;
    padding: 20px;
    h5 {
      margin: 0 0 20px 0;
      font-size: 14px;
    }
    p{
      margin: 0 0 4px 0;
      padding: 0;
      font-size: 12px;
      line-height: 20px;
    }
  }
</style>
