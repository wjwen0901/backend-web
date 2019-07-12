<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">产品介绍</el-breadcrumb-item>
          <el-breadcrumb-item>新增</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container"> 
          <el-form ref="solutionForm" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="产品名称*">
              <el-input v-model="name" :disabled='names' placeholder="请输入产品名称"></el-input>
            </el-form-item>
            <el-form-item label="适用阶段">
              <Input  v-on:ipt="ipt" v-for="(item,index) in sum" :key="index" /><span class="add" @click="add">+</span> 
            </el-form-item>
            <el-form-item label="适用科室">
              <el-select :disabled='departments' v-model="department" filterable multiple placeholder="请选择">
                <el-option
                  v-for="item in depart"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="检测内容*">
              <el-input
              :disabled='briefs'
                type="textarea"
                :rows="2"
                v-model="brief"
                placeholder="请输入检测的内容">
              </el-input>
            </el-form-item> 
            <el-form-item  label="临床意义">
              <el-input
                type="textarea"
                :disabled='purposes'
                v-model="purpose"
                :rows="2"
                placeholder="请输入临床意义">
              </el-input>
            </el-form-item> 
          </div>  
          <div class="chang">
            检测厂商
          </div>
          </el-form>
          <div class="gene-select"> 
              <el-select class="width-100-p" :disabled='proDepts1' style="width:300px"  v-model="proDepts"  filterable placeholder="请选择">
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select> 
          <el-select v-model="products" :disabled='products1'  filterable multiple placeholder="请选择产品">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </div>
           <div class="gene-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled = " openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disableds">暂存</el-button>
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
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
      names:false,
      content:'',
      products:[],
      manufacturer:'',
      openIsDisabled:false,
      options: [], 
      sum:1,
      brief:'',
      briefs:false,
      purpose:'',
      purposes:false,
      list:[],
      department:[],
      departments:false,
      products1:false,
      depart:[],
      proDepts:"",
      proDepts1:false,
      deptList:[],
      id:'',
      
    }
  },
  components:{
    Input
  }, 
  methods: {
    
    disableds(){
      this.openIsDisabled = !this.openIsDisabled;
      this.names = !this.names
      this.briefs = !this.briefs;
      this.purposes = !this.purposes;
      this.departments = !this.departments;
      this.products1 = !this.products1;
      this.proDepts1 = !this.proDepts1
      if(this.id==''){
         let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
      instance({
        url:'product/addTem',
        method:'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{
            name:_this.name, 
            brief:_this.brief,
            purpose : _this.purpose,
            deptIds:this.department,
            screenings:this.list,
            solutionIds:this.products
        }
      }).then(res=>{
        this.$message('暂存成功')
        this.id = res.id
      })
      }else{ 
        let instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
      instance({
        url:'product/addTem',
        method:'put',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        data:{
            id:_this.id,
            name:_this.name, 
            brief:_this.brief,
            purpose : _this.purpose,
            deptIds:this.department,
            screenings:this.list,
            solutionIds:this.products
        }
      }).then(res=>{
        this.$message('修改成功') 
      })
      }  
    },   
    add(){
        this.sum++
    },
    ipt(data) { 
      this.list.push(data);   
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

            name:_this.name, 
            brief:_this.brief,
            purpose : _this.purpose,
            deptIds:this.department,
            screenings:this.list,
            solutionIds:this.products
        }
      }).then(res=>{
        this.$message('发布成功') 
      })
    },
     preview(){
      this.$router.push({
        name:'ProductClPreview',
        query:{
            name:this.name, 
            brief:this.brief,
            purpose : this.purpose,
            deptIds:this.department,
            screenings:this.list,
            solutionIds:this.products
        }
      })
      var obj = {};
      obj.name = this.name;
      obj.brief=this.brief,
      obj.purpose = this.purpose,
      obj.deptIds=this.department,
      obj.screenings=this.list,
      obj.solutionIds=this.products
      window.sessionStorage.setItem('pro',JSON.stringify(obj))
    },
    getKe(){
      this.axios({
        url:'hospital-dept'
      }).then(res=>{
          this.depart = res.data
      })
    },
    getCompany(){
      this.axios({
        url:'company'
      }).then(res=>{
        this.deptList=res.data; 
      })
    },
    companyIds(){ 
      this.axios({
        url:'solution/solutionByCompany',
        params:{
          companyId:this.proDepts
        }
      }).then(res=>{
        console.log(res.data)
        this.options = res.data.solutions;
      })
    }
  }, 
   mounted(){
     this.getCompany()
     this.companyIds()
     this.getKe()
   },
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
