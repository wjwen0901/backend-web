<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/disease' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="disease-container">
          <el-form ref="solutionForm"  label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文名称*"> 
                <span>{{datas.name}}</span>
              </el-form-item>
              <el-form-item label="英文名称*"> 
                <span>{{datas.nameen}}</span>
              </el-form-item>
              <el-form-item label="其他名称"> 
                <span>{{datas.alias}}</span>
              </el-form-item>
              <el-form-item label="OMIM"> 
                <span>{{datas.omim}}</span>
              </el-form-item>
              <el-form-item label="疾病类型">
                <span>{{datas.muttype}}</span>
              </el-form-item>
             <el-form-item label="靶向用药"> 
              </el-form-item>
              <el-form-item label="相关指南"> 
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式"> 
              </el-form-item>
              <el-form-item label="突变类型"> 
                <span>{{datas.mode}}</span>
              </el-form-item>
              <el-form-item label="发病年龄"> 
                <span>{{datas.age}}</span>
              </el-form-item>
              <el-form-item label="发病概率"> 
                <span>{{datas.morbidity}}</span>
              </el-form-item>
              <el-form-item label="适用科室"> 
            </el-form-item>
              <el-form-item label="检测产品"> 
              </el-form-item>
              <el-form-item label="相关基因"> 
                <span>{{datas.gene}}</span>
            </el-form-item>  
            </div>
            <div class="form-line">
              <ul class="list">
                <li v-for="(item,index) in list " :key="index"  @click="cur=index" :class="{active:cur==index}">
                  {{item.id}}.{{item.name}}
                </li>
              </ul> 
              <div class="content" v-show="cur==0">
                <p>12简介</p>
                <p class="title">标题：<input placeholder="请输入标题"  type="text"></p> 
                <div class="edit_container">  
              </div> 
              </div>
              <div class="content" v-show="cur==1">
                <p>简3介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==2">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==3">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==4">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==5">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==6">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==7">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==8">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="content" v-show="cur==9">
                <p>简介</p>
                <p class="title">标题：<input placeholder="请输入标题" type="text"></p>  
              </div>
              <div class="select">
                <el-select v-model="value" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-select v-model="value1" placeholder="请选择"> 
              </el-select>
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
      datas:{},
      list:[{name:'简介',id:1},{name:'表现',id:2},{name:'预防',id:3},{name:'检测产品',id:1},
      {name:'简介',id:1},{name:'简介',id:1},{name:'简介',id:1},{name:'简介',id:1},
      {name:'简介',id:1},{name:'简介',id:1}],
      cur:0
    }
  }, 
  mounted () { 
    //获取详情
    this.getDatas()
  },
methods: { 
  getDatas(){
    this.axios({
      url:"disease/byId",
      params:{
        id:this.$route.query.id,
        state:this.$route.query.state
      }
    }).then(res=>{
      console.log(res.data)
      this.datas = res.data.disease
    })  
  },  
},
created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.getDatas()
    loading.close()
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  *{
    list-style: none;
  }
  .float-l {
    float: left;
  }
  .list{ 
    width: 100%;
    height: 150px;
    line-height: 75px;
    display: flex;
    background:#ccc;
    flex-wrap: wrap; 
    li{
      width: 180px;
    }
  }
  .select{
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: space-around;
    margin-top: 100px;
  }
  .content{
    width: 100%;
    height: 100px;
    .title{ 
      height: 30px;
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
  }
  .disease-container {
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
          margin-top: 60px;
          text-align: center;
          .el-button{
            margin: 0 20px;
          }
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
  .disease-container .header {
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
