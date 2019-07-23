<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>指南管理</el-breadcrumb-item>
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
        :data="drugList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="中文标题">
        </el-table-column>
        <el-table-column
          prop="titleEn"
          label="英文标题">
        </el-table-column>
        <el-table-column
          prop="framers"
          label="制定者">
        </el-table-column>
        <el-table-column
          prop="provenance"
          label="出处">
        </el-table-column> 
        <el-table-column
          prop="publishDate"
          label="发布日期"
          width="180"> 
        </el-table-column>
        <el-table-column
          prop="producer" 
          label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.state==1">暂存</span>
            <span v-if="scope.row.state==0">发布</span>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id,scope.row.state)">查看详情</el-button>
            <el-button type="text" size="small" @click="toEdit(scope.row.id,scope.row.state)">编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id,scope.row.state)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"  
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'DrugList',
  data () {
    return {
      drugList: [],
      pageNum:1,
      pageSize: 10, 
      paramSelect: '',
      condition: null,
      totalPage: 0
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('guideManage/page', { 
        params:{
          pageSize:this.pageSize,
          pageNum:this.pageNum,
          param:this.condition
        }
      }).then(res => { 
        console.log(res.data)
        this.drugList = res.data.guides 
        this.totalPage = res.data.totalNum
      }).catch(err => { 
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
    toEdit (id,state) {
      this.$router.push({
        name:'DrugEdit',
        params: {'id': id},
        query:{
          id,state
        }
      })
    },
    toDetail (id,state) {
      this.$router.push({
        name:'DrugView',
        query:{
          id,state
        }
      })
    },
    toAdd () {
      this.$router.push({
        name: 'DrugAdd'
      })
    },
    toDelete (id,state) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.axios({
            url:'guideManage',
            method:"delete",
            params:{
              id,state
            }
          }).then(res => {
            this.getData()
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }).catch(err => { 
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
  }
</style>
