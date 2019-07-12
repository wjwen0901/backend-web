<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>疾病管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入疾病名称/英文名/OMIM" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="diseaseList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="中文名称">
        </el-table-column>
        <el-table-column
          prop="nameen"
          label="英文名称">
        </el-table-column>
        <el-table-column
          prop="gene"
          label="相关基因">
        </el-table-column>
        <el-table-column
          prop="omim"
          label="OMIM"
          width="80">
        </el-table-column>
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
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row.id,scope.row.state)">查看详情</el-button>
            <el-button type="text" size="small" @click="toEdit(scope.row.id,scope.row.state)" >编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 50, 100, 150]"
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
  name: 'DiseaseList',
  data () {
    return {
      diseaseList: [],
      pageNum: 1,
      pageSize: 10,
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
      console.log(process.env.DISEASE_API)
      console.log(process.env)
      let instance = this.axios.create({
        baseURL: process.env.DISEASE_PC_API,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'get',
        url: 'https://qa.mdhcare.cn/mdhcare-backend/disease/page', 
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        },
        params:{
          pageSize : this.pageSize,
          pageNum : this.pageNum,
          param:this.condition
        }
      }).then(function (res) {
        console.log(res.data)
        _this.diseaseList = res.data.diseases
        _this.totalPage = res.data.totalNum
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
    //编辑
    toEdit (id,state) {
      this.$router.push({
         name:'DiseaseEdit',
         query:{
           id,
           state
         }
      })
    },
    //查看
    toDetail (id,state) {
      console.log(id,state)
      this.$router.push({
         name:'DiseaseView',
         query:{
           id,
           state
         }
      })
    },
    //新增
    toAdd () {
      this.$router.push({
        name: 'DiseaseAdd'
      })
    },
    toDelete (id) {
      this.$confirm('确认删除？')
        .then(_ => {
          this.axios.delete('disease/' + id).then(res => {
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
