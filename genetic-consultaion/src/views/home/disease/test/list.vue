<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>检测项目管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入药物名称" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="testList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="nameCh"
          label="项目名称">
        </el-table-column>
        <el-table-column
          prop="nameEn"
          label="英文缩写">
        </el-table-column>
        <el-table-column
          prop="type"
          label="所属类别">
        </el-table-column>
        <el-table-column
          prop="rrs"
          label="参考范围">
        </el-table-column>
        <el-table-column
          prop="operationTime"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.operationTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id)">查看详情</el-button>
            <el-button type="text" size="small" @click="toEdit(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
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
  name: 'Test',
  data () {
    return {
      testList: [],
      pageNum: window.sessionStorage.productPageNum === undefined ? 1 : window.sessionStorage.productPageNum,
      pageSize: window.sessionStorage.productPageSize === undefined ? 20 : window.sessionStorage.productPageSize,
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
      this.axios.get('solution/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId,
          condition: this.condition
        }
      }).then(res => {
        this.testList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
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
    toEdit (id) {
    },
    toDetail (id) {
      this.$router.push({
        path: '/product/edit/' + id
      })
    },
    toAdd () {
      this.$router.push({
        name: 'ProductAdd'
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
