<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>报告管理</el-breadcrumb-item>
      <el-breadcrumb-item>报告列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <!--<el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>-->
        <div class="search-box">
          <el-input placeholder="请输入条码编号/受检者姓名/手机号" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="reportList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="solutionName"
          label="检测产品"
          width="180">
        </el-table-column>
        <el-table-column
          prop="fileName"
          label="文件名称">
        </el-table-column>
        <el-table-column
          prop="sampleCode"
          label="条码编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="truename"
          label="受检者姓名">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="受检者电话">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id)">查看文件</el-button>
            <!--<el-button type="text" size="small" @click="toDetail(scope.row.id)">编辑</el-button>-->
            <!--<el-button type="text" size="small" @click="toDetail(scope.row.id)">删除</el-button>-->
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
  name: 'ReportList',
  data () {
    return {
      reportList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: ''
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('report', {
        params: {
          userId: window.localStorage.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.condition
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({
        name: 'ReportEdit',
        params: { reportId: id }
      })
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state === 0) return '新增'
      if (state === 1) return '已录入'
      if (state === 2) return '无法识别'
      if (state === 3) return '关联知情'
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

</style>
