<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-hospital" size="small" type="primary" @click="toAdd" v-if="roleCode === 'manager' || roleCode === 'jk-service'">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入医院名称" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="hospitalList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="医院名称">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="渠道负责人">
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="name"-->
          <!--label="病种"-->
          <!--width="180">-->
        <!--</el-table-column>-->
        <el-table-column
          prop="period"
          label="样本数量"
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
  name: 'HospitalList',
  data () {
    return {
      hospitalList: [],
      pageNum: window.sessionStorage.hospitalPageNum === undefined ? 1 : parseInt(window.sessionStorage.hospitalPageNum),
      pageSize: window.sessionStorage.hospitalPageSize === undefined ? 20 : parseInt(window.sessionStorage.hospitalPageSize),
      totalPage: 0,
      paramSelect: '',
      condition: null,
      roleCode: window.localStorage.role
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('hospital/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId,
          condition: this.condition
        }
      }).then(res => {
        this.hospitalList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.hospitalPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.hospitalPageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({
        path: '/hospital/edit/' + id
      })
    },
    toAdd () {
      this.$router.push({
        name: 'HospitalAdd'
      })
    },
    toDelete (id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.axios.delete('hospital/' + id).then(res => {
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
    .add-hospital {
    }
  }
</style>
