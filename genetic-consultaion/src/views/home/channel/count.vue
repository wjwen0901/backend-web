<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">渠道管理</el-breadcrumb-item>
      <el-breadcrumb-item>统计</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="fullName"
          label="姓名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机号"
          width="110">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          label="上级用户">
          <template slot-scope="scope">
            {{scope.parentName}}({{scope.parentMobile}})
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="160">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button @click="selectItem(scope.row.id, scope.row.name)" type="text" size="small">生成二维码</el-button>
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

    <el-dialog title="选择产品" :visible.sync="dialogFormVisible">
      <div>
        <el-table
          :data="solutionList"
          size="mini"
          border
          style="width: 100%">
          <el-table-column
            prop="name"
            label="姓名">
          </el-table-column>
          <el-table-column
            label="操作"
            width="200">
            <template slot-scope="scope">
              <el-button @click="downloadCode(scope.row.yzAlias, scope.row.name, scope.row.period, scope.row.directPrice, scope.row.code)" type="text" size="small">下载二维码</el-button>
              <!--<el-button @click="printCode(scope.row.id)" type="text" size="small">打印二维码</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>

export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      dialogFormVisible: false,
      userId: 0,
      name: '',
      solutionList: []
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      // 获取权限列表
      this.axios.get('channel/user', {
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
        }
      }).then(res => {
        this.list = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageNum = val
    },
    downloadCode (alias, name, period, price, code) {
      this.dialogFormVisible = true
      // 获取权限列表
      this.axios.get('barcode/create/' + this.userId, {
        params: {
          alias: alias,
          name: name,
          period: '7个工作日',
          price: '1400',
          code: 'MDHC012-0001'
        }
      }).then(res => {
        window.open(this.axios.defaults.baseURL + '/barcode/down?filename=' + res.data + '&Authorization=' + window.localStorage.token)
      }).catch(err => {
        console.log(err)
      })
    },
    printCode (solutionId) {
      this.dialogFormVisible = true
    },
    selectItem (id, name) {
      this.userId = id
      this.name = name
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.solutionList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogFormVisible = true
    }
  },
  watch: {
  },
  filters: {
  },
  computed: {
  },
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
  mounted () {
  },
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
</style>
