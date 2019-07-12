<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">产品介绍</el-breadcrumb-item>
          <el-breadcrumb-item>预览</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container"> 
          <el-form ref="solutionForm" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="产品名称*">
              <span>{{this.$route.query.name}}</span>
            </el-form-item>
            <el-form-item label="适用阶段">
              <span></span>
            </el-form-item>
            <el-form-item label="适用科室"> 
              <span v-for="(item,index) in departs" :key="index">{{item}}</span>
            </el-form-item>
            <el-form-item label="检测内容*">
               <span>{{this.$route.query.briefs}}</span>
            </el-form-item>
            <el-form-item label="临床意义"> 
              <span>{{this.$route.query.purpose}}</span>
            </el-form-item> 
          </div>  
          <div class="chang">
            检测厂商
          </div>
          </el-form>
          <div class="gene-select"> 
              <el-select class="width-100-p" style="width:300px" @change="companyIds" v-model="proDepts"  filterable placeholder="请选择">
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> 
          <el-select v-model="products" placeholder="请选择产品">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          </div> 
          <div class="gene-btns">
                <el-button type="primary" @click="addData" >保存</el-button>
                <el-button @click="cancel" >取消</el-button> 
           </div>
        </div> 
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Input from '../../../../components/inputs'
export default {
  name: 'GeneEdit',
  data () {
    return {  
      Significance:'',
      name:'',
      content:'',
      products:'',
      manufacturer:'',
      openIsDisabled:false,
      options: [], 
      sum:1,
      list:[],
      department:'',
      depart:[],
      proDepts:"",
      deptList:[],
      datas:[],
      departs:[],
      screening:[],
      sessionData:{}
    }
  },
  components:{
    Input
  },
  props: {},
  methods: {
    disableds(){
      this.openIsDisabled = !this.openIsDisabled
    },    
    getData(){
      this.axios({
        url:'product/productById',
        params:{
          id:this.$route.query.id,
          state:this.$route.query.state
        }
      }).then(res=>{
        this.datas = res.data.product;
        console.log(res.data)
        console.log(this.datas)
        this.departs = res.data.depts.map((item,index)=>{
          return  item.name 
        })  
        this.screening = res.data.screenings.map((item,index)=>{
          return item.screeningName
        })
        console.log(screening)
      })
    },
    addData(){
     let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
      let _this = this
      instance({
        url:'product',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{ 
            name:_this.sessionData.name, 
            brief:_this.sessionData.brief,
            purpose : _this.sessionData.purpose,
            deptIds:_this.sessionData.department,
            screenings:_this.sessionData.list,
            solutionIds:_this.sessionData.products
        }
      }).then(res=>{
        this.$message('发布成功') 
      })
    },
  }, 
   mounted(){
     this.getData()
     console.log(JSON.parse(window.sessionStorage.getItem("data")))
     this.sessionData = JSON.parse(window.sessionStorage.getItem("data"))
     console.log(this.sessionData.name)
   }
  // created () {
  //   let loading = this.$loading({
  //     lock: true,
  //     text: 'Loading',
  //     spinner: 'el-icon-loading',
  //     background: 'rgba(0, 0, 0, 0.7)'
  //   })
  //   this._initData()
  //   loading.close()
  // }, 
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .float-l {
    float: left;
  }
  .gene-select{
    width: 100%;
    text-align: center;
    display: flex;
    margin:40px;
    .el-select{
      margin-left: 100px;
    }
  }
  .add{ 
    position: absolute;
    top:10%;
    left:30%;
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
  .chang{
    padding-bottom: 15px;
    border-bottom:1px solid #ccc;
  }
  .gene-contents{
    width: 100%;
    height: 50px;
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
      width: 100%;
      float: left;
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
