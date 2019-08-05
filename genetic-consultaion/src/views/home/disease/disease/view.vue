<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/disease' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
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
              <el-form-item label="简介"> 
                <span>{{datas.content}}</span>
              </el-form-item>
              <el-form-item label="OMIM"> 
                <span>{{datas.omim}}</span>
              </el-form-item>
              <el-form-item label="疾病类型">
                <span>{{datas.distype}}</span>
              </el-form-item>
             <el-form-item label="靶向用药"> 
               <span v-for="(item,index) in Name.relationDruggery" :key="index">{{item.druggeryName}}</span>
              </el-form-item>
              <el-form-item label="相关指南"> 
                <p v-for="(item,index) in titles" :key="index">{{item.tilte}}</p>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式"> 
                <span>{{datas.mode}}</span>
              </el-form-item>
              <el-form-item label="突变类型"> 
                <span>{{datas.muttype}}</span>
              </el-form-item>
              <el-form-item label="发病年龄"> 
                <span>{{datas.age}}</span>
              </el-form-item>
              <el-form-item label="发病概率"> 
                <span>{{datas.morbidity}}</span>
              </el-form-item>
              <el-form-item label="适用科室"> 
                <span v-for="(item,index) in Name.depts" :key="index">{{item.deptName}} </span>
              </el-form-item>
              <el-form-item label="检测产品"> 
                <span v-for="(item,index) in Name.products" :key="index"> {{item.productName}}</span>
              </el-form-item>
              <el-form-item label="相关基因"> 
                <span v-for="(item,index) in Name.relationGene" :key="index">{{item.geneName}} &nbsp;&nbsp;&nbsp;</span>
            </el-form-item>  
            </div>
            <div class="form-line">
              <ul class="list">
                <li v-for="(item,index) in list " :key="index"  @click="cur=index" :class="{active:cur==index}">
                  {{item.id}}.{{item.name}}
                </li>
              </ul>
              <div class="content" v-show="cur==0"> 
                <p class="title">标题：<span>{{datas.catalog[0].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[0].content"></div>
              </div>
              <div class="content" v-show="cur==1"> 
                <p class="title">标题：<span>{{datas.catalog[1].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[1].content">  
                </div>
              </div>  
              <div class="content" v-show="cur==2"> 
                <p class="title">标题：<span>{{datas.catalog[2].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[2].content">  
                </div>
              </div>
              <div class="content" v-show="cur==3"> 
                <p class="title">标题：<span>{{datas.catalog[2].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[3].content">  
                </div>
              </div>
              <div class="content" v-show="cur==4"> 
                <p class="title">标题：<span>{{datas.catalog[3].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[4].content">
                </div>
              </div>
              <div class="content" v-show="cur==5"> 
                <p class="title">标题：<span>{{datas.catalog[5].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[5].content">
                </div>
              </div>
              <div class="content" v-show="cur==6"> 
                <p class="title">标题：<span>{{datas.catalog[6].name}}</span></p> 
                <div class="edit_container" v-html="datas.catalog[6].content">  
                </div>
              </div>
              <div class="content" v-show="cur==7"> 
                <p class="title">标题：<span>{{datas.catalog[7].name}}</span> </p>
                <div class="edit_container" v-html="datas.catalog[7].content">  
                </div>  
              </div>
              <div class="select">  
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
      Name:{},
      list:[ 
        { name: "症状", id: 1 },
        { name: "表现", id: 2 },
        { name: "诊断方法", id: 3 },
        { name: "病因及危险因素", id: 4 },
        { name: "预防", id: 5 },
        { name: "筛查", id: 6 },
        { name: "治疗方案", id: 7 },
        { name: "其他", id: 8 }
      ], 
      content2:'症状', 
      content3:'表现',
      content4:'诊断方法',
      content5:'病因及危险因素',
      content6:'预防',
      content7:'筛查',
      content8:'治疗方案',
      content9:'其他',
      cur:0,
      dataOne:{},
      titles:[]
    }
  }, 
  mounted () { 
    // 获取详情
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
      // 指南
      this.titles = res.data.disease.guides.map(item => {
        return item
      })
      console.log(this.titles)
      this.Name = res.data
    })
  }
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
.active{
  color:goldenrod;
}
  *{
    list-style: none;
  }
  .edit-form{
  max-width: none;
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
