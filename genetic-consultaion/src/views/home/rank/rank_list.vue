<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>实验室排名列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入产品名称/适用科室" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="rankList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="companyId"
          label="实验室编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="实验室名称">
        </el-table-column>
        <el-table-column
          prop="totalScore"
          label="总评分">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.companyId, scope.row.companyName)">编辑</el-button>
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
  name: 'RankList',
  data () {
    return {
      rankList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      paramSelect: '',
      condition: null
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('assess/total', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.rankList = res.data
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.length
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.productPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.productPageNum = val
      this.getData()
    },
    toDetail (id, name) {
      this.$router.push({
        path: '/rank/edit/' + id + '?name=' + name
      })
    },
    toAdd () {
      this.$router.push({
        path: '/rank/add'
      })
    },
    toDelete (id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.axios.delete('solution/' + id).then(res => {
            this.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '删除失败',
              type: 'error'
            })
          })
        })
        .catch(_ => {})
    }
  },
  filters: {
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
  .product-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .header {
      margin-bottom: 20px;
      font-size: 18px;
    }
    .search-box {
      width: 400px;
      float: right;
      margin-bottom: 10px;
    }
    .add-solution {
    }
  }
</style>
