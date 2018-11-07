<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>产品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入内容" v-model="paramInfo" class="input-with-select">
            <el-select v-model="paramSelect" slot="prepend" placeholder="请选择" class="param-select">
              <el-option label="方案名称" value="1"></el-option>
              <el-option label="适用科室" value="2"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="solutionList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="name"
          label="产品名称">
          label="产品名称">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="适用科室">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="病种"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="period"
          label="检测周期"
          width="100">
          <template slot-scope="scope" v-if="scope.row.period !== undefined">
            {{scope.row.period}}个工作日
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="人群受众"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="create_time"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id)">编辑</el-button>
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
  name: 'ProductList',
  data () {
    return {
      solutionList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      paramSelect: '',
      paramInfo: ''
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
          pageSize: this.pageSize
        }
      }).then(res => {
        this.solutionList = res.data.list
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
        path: '/product/edit/' + id
      })
    },
    toAdd () {
      this.$router.push({
        name: 'ProductAdd'
      })
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
<style>
  .el-select .el-input {
    width: 110px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>
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
