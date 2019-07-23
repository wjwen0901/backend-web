<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>基因信息管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-solution" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入基因名称/其他名称/NM" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="geneList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="gene"
          label="基因">
        </el-table-column>  
        <el-table-column
          prop="exon"
          label="外显子"
          width="130">
        </el-table-column>
        <el-table-column
          prop="intron"
          label="内含子"
          width="130">
        </el-table-column>
        <el-table-column
          prop="nm"
          label="NM号">
        </el-table-column>
        <el-table-column 
          label="状态">
           <template slot-scope="scope">
            <span v-if="scope.row.state==1">暂存</span>
            <span v-if="scope.row.state==0">发布</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间" 
          width="180"> 
           <template slot-scope="scope">
            <span>{{parseInt(scope.row.createTime) | formatDate}}</span>
            </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row)">查看详情</el-button>
            <el-button type="text" size="small" @click="toEdit(scope.row.id,scope.row.state)">编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id,scope.row.state)">删除</el-button>
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
  name: 'GeneList',
  data () {
    return {
      geneList: [],
      pageNum: 1,
      pageSize: 10, 
      paramSelect: '',
      condition: null,
      totalPage: 0
    }
  },
  methods: {
     timestampToTime(timestamp) { 
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000 
        var Y = date.getFullYear() + '-'; 
       var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    },
    _initData () {
      this.getData()
    },
    getData () {
      this.axios('gene/page',{ 
        params:{
          pageSize : this.pageSize,
          pageNum : this.pageNum,
          param:this.condition 
        }
      }).then(res => {
        this.geneList = res.data.genes
        this.totalPage = res.data.totalNum 
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
    //编辑
    toEdit (id,state) {
      this.$router.push({
        name:'GeneEdit',
        params: {'id': id},
        query:{
          id,state
        }

      })
    },
    //查看
    toDetail (data) {  
      this.$router.push({
        name:'GeneView', 
        query:{
          data
        }
      })
    },
    //新增
    toAdd () {
      this.$router.push({
        name: 'GeneAdd'
      })
    },
    toDelete (id,state) {
       this.$confirm('确认删除？')
        .then(_ => {
          this.axios({
            url:'gene',
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
  mounted () {}
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
