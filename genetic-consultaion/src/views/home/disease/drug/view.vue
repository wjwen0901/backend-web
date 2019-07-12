<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm"  label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题*"> 
                <span>{{datas.title}}</span>
              </el-form-item>
              <el-form-item label="制定者*">
                <span v-for="(item,index) in framser" :key='index'>{{item}}</span>
              </el-form-item>
              <el-form-item label="发布日期*">
                 {{datas.createTime}}
              </el-form-item> 
              <el-form-item label="检测产品">
                <span>{{datas.intro}}</span>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="英文标题*">
                 <span v-for="(item,index) in titlEn" :key="index">{{item}}</span>
              </el-form-item>
              <el-form-item label="出处*">
                <span v-for="(item,index) in proven" :key="index">{{item}}</span>
              </el-form-item> 
              <el-form-item label="相关疾病">
                 
              </el-form-item>
              <el-form-item label="相关基因">
                 
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="form-list" >
                <li v-for="(item,index) in list" :key="index" @click="cur=index" :class="{active:cur==index}">
                 {{item.id}}.{{item.name}}
                </li> 
              </ul>
              <div class="from-contents" v-show="cur==0"> 
              </div>
              <div class="from-contents" v-show="cur==1"> 
              </div>
               <div class="from-select">
              <p>数据来源</p> 
              </div> 
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'DiseaseEdit',
  data () {
    return { 
      cur: 0,
      list:[{name:'指南',id:1},{name:'其他',id:2}], 
      datas:{},
      framser:[],
      proven:[],
      titlEn:[]
    }
  },
  props: {},
  methods: { 
    disableds(){
      this.openIsDisabled = !this.openIsDisabled;
    },
    getDatas(){
      this.axios({
        url:'guide/byId',
        params:{
          id:this.$route.query.id,
          state:this.$route.query.state
        }
      }).then(res=>{
        console.log(res.data)
        this.datas = res.data.guide
        this.framser = res.data.guide.framers.map((item,index)=>{
          return item
        })
       this.proven = res.data.guide.provenance.map((item,index)=>{
          return item
        })
        this.titlEn = res.data.guide.titleEn.map((item,index)=>{ 
          return item
        }) 
      })
    }, 
    _initData () {
      if (this.$route.params.id !== undefined) {
        this.axios.get('drug/' + this.$route.params.id).then(res => {
          this.drug = res.data
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
      this.axios.get('hospital-dept').then(res => {
        this.deptList = res.data
      }).catch(err => {
        console.log(err)
      })
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
          url: 'drug',
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            userId: window.localStorage.userId
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
            _this.$router.push('/drug')
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
          url: 'drug/' + this.$route.params.id,
          data: {
            drug: this.drug,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams,
            userId: window.localStorage.userId
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
          _this.$router.push('/drug')
        }).catch(function () {
          _this.$message({
            message: '修改失败',
            type: 'error'
          })
        })
      }
    },
    cancel () {
      this.$router.push('/drug')
    }
  }, 
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
  mounted () { 
    this.getDatas()
  },
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .float-l {
    float: left;
  }
  .drug-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .el-input {
      width: 100%;
    }
    .edit-form {
      width: calc(100% - 40px);
      .form-left {
        width: 40%;
        float: left;
      }
      .form-right {
        padding-left: 60px;
        width: 40%;
        float: left;
      }
      .form-line {
        width: calc(80% + 60px);
        float: left;
        .btns {
          margin-left: -80px;
        }
      }
      .url-name {
        width: 200px;
        float: left;
      }
      .url {
        margin-left: 20px;
        width: 600px;
        float: left;
      }
    }
  }
  .form-list{
    width: 100%;
    display: flex;
    height: 100px;
    line-height: 100px;
    background: #f3f3f3;
    li{
      width: 20%;
      text-align: center;
    }
  }
  .from-select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
  }
  .from-contents{
    width: 100%;
    height: 200px;
    margin-bottom: 10px;
  }
  .from-btns{
    width: 100%;
    text-align: center;
    .el-button{
      margin:0 2%;
    }
  }
  .drug-container .header {
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
