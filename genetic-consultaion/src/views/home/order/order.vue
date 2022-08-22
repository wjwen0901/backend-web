<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
        <el-button class="but" type="warning" size="small" @click="exportData">导出</el-button>
        <el-input placeholder="请输入下单人姓名/手机号/检测项目" v-model="condition" class="input-with-select" style="width:400px">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :row-key="getRowKeys"
        :data="orderList"
        size="mini"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
          reserve-selection
          header-align="center"
          align="center"
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="orderNo"
          label="订单编号"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="itemTitle"
          label="检测项目">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="solutionName"-->
          <!--label="实验室"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <el-table-column
          align="center"
          header-align="center"
          prop="payment"
          label="支付价格"
          width="120">
          <template slot-scope="scope" v-if="scope.row.payment !== undefined">
            {{scope.row.payment}}¥
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="受检者"
          width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.pName != undefined">
              <span>
                {{scope.row.pName}}({{scope.row.pCellphone || '-'}})
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          label="下单人"
          width="100">
          <template slot-scope="scope">
            {{scope.row.fullName}}
<!--            ({{scope.row.cellphone}})-->
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="createTime"
          label="报告时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="statusStr"
          label="订单状态"
          width="90">
        </el-table-column>
        <el-table-column
        header-align="center"
        align="center"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="toUploadInformed(scope.row.id)">上传知情</el-button>
            <el-button type="text" size="medium" @click="toUploadReport(scope.row.id)"
                       v-if="scope.row.reportNum === 0 && roleCode === 'manager'">上传报告</el-button>
            <el-button type="text" size="medium" @click="toInformedDetail(scope.row.id,scope.row.expressCode,scope.row.expressId)">查看</el-button>
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
      checkIds:[],//选中的ID
      orderList: [],
      // pageNum: window.sessionStorage.orderPageNum === undefined ? 1 : window.sessionStorage.orderPageNum,
      // pageSize: window.sessionStorage.orderPageSize === undefined ? 20 : window.sessionStorage.orderPageSize,
      pageNum:1,
      pageSize:20,
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
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  methods: {
    //复选框选中状态
    handleSelectionChange(val){
      this.checkIds = val
    },
    //唯一ID
    getRowKeys(row){
      return row.id
    },
    //导出
    exportData(){
      //处理选中ID
      let ids = []
      if(this.checkIds.length!==0){
       ids = this.checkIds.map(item => {
          return item.id
        })
       this.exportPutData(ids)
      }else{
         this.$confirm('此操作将导出当前全部数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.exportPutData([])
        }).catch(() => {
          console.log('取消')       
        });
      }
    },
    //导出数据后台接口
    exportPutData(val){
      this.axios.get('order/user/export', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          ids:val.toString(),
          condition:this.condition
        },
        responseType: 'blob'
      }).then(res => {
        const blob = new Blob(
          [res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const aEle = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        aEle.href = href;
        const today = new Date();
        aEle.download = "订单列表" + today.getFullYear() + '-'+ (today.getMonth()+1)+ '-' + today.getDate() + ".xls";  // 下载后文件名
        document.body.appendChild(aEle);
        aEle.click();     // 点击下载
        document.body.removeChild(aEle); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
      })
    },
    _initData () {
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.loading = true
      this.axios.get('order/user', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition
        }
      }).then(res => {
        this.orderList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    getCompanyList () {
      this.axios.get('company/CustCompany', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
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
          informedId: informedId,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        },
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
    }
  },
  filters: {},
  computed: {},
  created () {
    // let loading = this.$loading({
    //   lock: true,
    //   text: 'Loading',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.7)'
    // })
    this._initData()
    // loading.close()
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
      width: 100%;
      float: right;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      .but{
        width: 80px;
      }
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
