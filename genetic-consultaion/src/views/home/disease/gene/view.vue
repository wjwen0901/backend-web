<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">基因信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container">
          <el-form ref="solutionForm" :model="gene" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="基因*">
              <span>{{datas.gene}}</span>
            </el-form-item>
            <el-form-item label="其他名称">
              <span>{{datas.alias}}</span>
            </el-form-item>
            <el-form-item label="外显子数">
              <span>{{datas.exon}}</span>
            </el-form-item>
            <el-form-item label="内含子数">
              <span>{{datas.intron}}</span>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="NM号">
              <span>{{datas.nm}}</span>
            </el-form-item>
            <el-form-item label="相关疾病">
              <span v-for="(item,index) in Name.diseases" :key="index">{{item.diseaseName}} </span>
            </el-form-item>
            <el-form-item label="靶向用药">
              <span v-for="(item,index) in Name.druggerys" :key="index">{{item.druggeryName}} </span>
            </el-form-item>
            <el-form-item label="检测产品">
              <span v-for="(item,index) in Name.products" :key="index">{{item.productName}} </span>
            </el-form-item>
          </div>
          </el-form>
          <ul class="gene-list" >
            其他
          </ul>
          <div class="gene-contents">
              <p class="title">标题：<span>其他</span> </p>
              <p v-html="datas.other"></p>

          </div>
          <div class="gene-select">

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'GeneEdit',
  data () {
    return {
      source:'',
      source1:'',
      testproduct:'',
      targeting:'',
      content:'',
      proDepts: [],
      list:[{name:'其他',id:1}],
      cur:0,
      value: [],
      openIsDisabled:false,
      title:'',
      //检测基因
      relatedgene:[],
      geneOption: [],
      geneList: [],
      geneLoading: false,
      geneState: [],
      //靶向用药
      medicaId:[],
      medicaOption: [],
      medicaList: [],
      medicaLoading: false,
      medicaState: [],
      //检测产品
      productId:[],
      productOption: [],
      productList: [],
      productLoading: false,
      productState: [],
      datas:{}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData(){
      this.axios({
        url:"gene/byId",
        params:{
          id:this.$route.query.data.id,
          state:this.$route.query.data.state
        }
      }).then(res=>{
        this.datas = res.data.gene;
        this.Name = res.data;
        console.log(res.data)
      })
    },
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('gene/' + this.$route.params.id, {
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          }
        }).then(res => {
          this.gene = res.data
          this.sampleMeta = res.data.sampleMeta
          this.proDepts = res.data.deptName
          if (res.data.expand !== undefined) {
            let _this = this
            res.data.expand.forEach(function (item) {
              if (item.type === 0) {
                _this.reportType.push(item.name)
                if (item.remark !== undefined) {
                  _this.reportTypeOtherRemark = item.remark
                }
              } else {
                _this.consultancy.push(item.name)
                if (item.remark !== undefined) {
                  _this.consultancyOtherRemark = item.remark
                }
              }
            })
          }
          console.log(this.reportType)
          console.log(this.consultancy)
        }).catch(err => {
          console.log(err)
        })
      }
    },
    edit () {
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'post',
          url: 'gene',
          data: {
            gene: this.gene,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (res) {
          if (res.data.state === 'exist alreay!') {
            _this.$message({
              message: '产品名称重复',
              type: 'error'
            })
          } else {
            _this.$message({
              message: '新增成功',
              type: 'success'
            })
            _this.$router.push('/gene')
          }
        }).catch(function () {
          _this.$message({
            message: '新增失败',
            type: 'error'
          })
        })
      } else {
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'put',
          url: 'gene/' + this.$route.params.id,
          data: {
            gene: this.gene,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams,
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
          },
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function () {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this.$router.push('/gene')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/gene')
    }
  },
  filters: {},
  computed: {
    expandParams: function () {
      let result = []
      let _this = this
      if (this.reportType !== null) {
        _this.reportType.forEach(function (item) {
          let expandParams = {
            'name': item,
            'type': 0
          }
          if (_this.reportTypeOtherRemark !== '' && item === 3) {
            expandParams.remark = _this.reportTypeOtherRemark
          }
          result.push(expandParams)
        })
      }
      if (this.consultancy !== null) {
        this.consultancy.forEach(function (item) {
          let expandParams = {
            'name': item,
            'type': 1
          }
          if (_this.consultancyOtherRemark !== '' && item === 4) {
            expandParams.remark = _this.consultancyOtherRemark
          }
          result.push(expandParams)
        })
      }
      console.log(result)
      return result
    }
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

  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active{
  color:goldenrod;
}
.edit-form{
  max-width: none;
}
  .float-l {
    float: left;
  }
  .gene-select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }
  .title{
      background: #f3f3f3;
      padding-left: 5px;
        input{
          width: 93%;
          border:0;
          outline: none;
          height: 28px;
          background: #f3f3f3;
        }
    }
  .gene-list{
    width: 100%;
    height: 50px;
    background: #f3f3f3;
    display: flex;
    line-height: 50px;
    li{
      width: 25%;
    }
  }
  .gene-contents{
    width: 100%;
    height: 100px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .gene-btns{
    width: 100%;
    text-align: center;
    .el-button{
      margin:0 2%;
    }
  }
  .gene-container {
    width: 100%;
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .left{
      width: 50%;
      float: left;
      height: 100%;
    }
    .right{
      width:50%;
      float: right;
      height: 100%;
    }
    .el-input {
      width: 100%;
    }
    .edit-form {
      max-width: 800px;
      .url-name {
        width: 160px;
        float: left;
      }
      .url {
        margin-left: 20px;
        width: calc(100% - 180px);
        float: left;
      }
    }
  }
  .gene-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .width-100-p {
    width: 100%
  }
  .img-content {
    margin: 20px 0px 20px 20px;
    height: 700px;
    background: #ffffff;
    overflow: auto;
    img {
      width: 100%;
    }
  }
</style>
