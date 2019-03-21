<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>知情管理</el-breadcrumb-item>
      <el-breadcrumb-item>知情列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <el-table
        :data="informedList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="sampleCode"
          label="条码编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="上传时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fullName"
          label="上传人">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="state"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 0">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 1" type="info">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 2" type="danger">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else-if="scope.row.state === 3" type="success">{{scope.row.state | stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" type="text" size="small">查看</el-button>
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
  name: 'InformedUpload',
  data () {
    return {
      informedList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0
    }
  },
  methods: {
    _initData () {
      this.pageNum = window.sessionStorage.informedPageNum === undefined ? 1 : parseInt(window.sessionStorage.informedPageNum)
      this.pageSize = window.sessionStorage.informedPageSize === undefined ? 20 : parseInt(window.sessionStorage.informedPageSize)
      this.getData()
    },
    getData () {
      this.axios.get('informed', {
        params: {
          userId: window.localStorage.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.informedList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
        window.sessionStorage.informedPageNum = this.pageNum
        window.sessionStorage.informedPageSize = this.pageSize
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
        name: 'InformedEdit',
        params: { informedId: id }
      })
    }
  },
  filters: {
    stateFilter: function (state) {
      if (state === 0) return '新增'
      if (state === 1) return '已录入'
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
