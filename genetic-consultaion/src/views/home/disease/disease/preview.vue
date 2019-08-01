<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/disease' }">疾病信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>预览</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="disease-container">
          <el-form ref="solutionForm" :model="disease" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文名称*"> 
                <span>{{sessionData.name}}</span>
              </el-form-item>
              <el-form-item label="英文名称*"> 
                <span>{{sessionData.nameen}}</span>
              </el-form-item>
              <el-form-item label="其他名称"> 
                <span>{{sessionData.alias}}</span>
              </el-form-item>
              <el-form-item label="简介"> 
                <span>{{sessionData.content}}</span>
              </el-form-item>
              <el-form-item label="OMIM"> 
                <span>{{sessionData.omim}}</span>
              </el-form-item>
              <el-form-item label="疾病类型"> 
                <span>{{sessionData.distype}}</span>
              </el-form-item>
             <el-form-item label="靶向药物"> 
               <span v-for="(item,index) in sessionData.druggeryIds" :key="index">{{item.name}}</span>
              </el-form-item>
              <el-form-item label="相关指南"> 
                 <span v-for="(item,index) in sessionData.guides" :key="index">{{item.name}}</span>
              </el-form-item> 
            </div>
            <div class="form-right">
              <el-form-item label="遗传方式"> 
                <span>{{sessionData.mode}}</span>
              </el-form-item>
              <el-form-item label="突变类型"> 
                <span>{{sessionData.muttype}}</span>
              </el-form-item>
              <el-form-item label="发病年龄"> 
                <span>{{sessionData.age}}</span>
              </el-form-item>
              <el-form-item label="发病概率"> 
                <span>{{sessionData.morbidity}}</span>
              </el-form-item>
              <el-form-item label="科室*">  
                <span v-for="(item,index) in sessionData.deptId" :key="index">{{item.name}}</span>
              </el-form-item>
              <el-form-item label="检测产品">  
                <span v-for="(item,index) in sessionData.productIds" :key="index">{{item.name}}</span>
              </el-form-item>
              <el-form-item label="致病基因"> 
                <span v-for="(item,index) in sessionData.genes" :key="index">{{item.name}}</span>
              </el-form-item> 
            </div>
            <div class="form-line">
              <ul class="list">
                <li v-for="(item,index) in list " :key="index"  @click="cur=index" :class="{active:cur==index}">
                  {{item.id}}.{{item.name}}
                </li>
              </ul> 
              <div class="content" v-show="cur==0"> 
                <p class="title">标题：<span>{{sessionData.catalog[0].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[0].content">   
              </div>
              </div>
              <div class="content" v-show="cur==1"> 
                <p class="title">标题：<span>{{sessionData.catalog[1].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[1].content">  
                </div>
              </div>  
              <div class="content" v-show="cur==2"> 
                <p class="title">标题：<span>{{sessionData.catalog[2].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[2].content">  
                </div>
              </div>
              <div class="content" v-show="cur==3"> 
                <p class="title">标题：<span>{{sessionData.catalog[2].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[3].content">  
                </div>
              </div>
              <div class="content" v-show="cur==4"> 
                <p class="title">标题：<span>{{sessionData.catalog[3].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[4].content">
                </div>
              </div>
              <div class="content" v-show="cur==5"> 
                <p class="title">标题：<span>{{sessionData.catalog[5].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[5].content">
                </div>
              </div>
              <div class="content" v-show="cur==6"> 
                <p class="title">标题：<span>{{sessionData.catalog[6].name}}</span></p> 
                <div class="edit_container" v-html="sessionData.catalog[6].content">  
                </div>
              </div>
              <div class="content" v-show="cur==7"> 
                <p class="title">标题：<span>{{sessionData.catalog[7].name}}</span> </p>
                <div class="edit_container" v-html="sessionData.catalog[7].content">  
                </div>  
              </div>
              <el-form-item class="btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">保存</el-button>  
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "DiseaseEdit",
  data() {
    return {
      valueList: [],
      data: [],
      addRowData: ["add"],
      disease: {
        name: "",
        nameen: "",
        alias: "",
        omim: "",
        distype: "",
        deptId: "",
        guide: "",
        mode: "",
        muttype: "",
        age: "",
        morbidity: "",
        department: "",
        product: "",
        gene: ""
      },
      deptList: [],
      guideList: [],
      guides: [],
      loading: false,
      list: [
        { name: "症状", id: 1 },
        { name: "表现", id: 2 },
        { name: "诊断方法", id: 3 },
        { name: "病因及危险因素", id: 4 },
        { name: "预防", id: 5 },
        { name: "筛查", id: 6 },
        { name: "治疗方案", id: 7 },
        { name: "其他", id: 8 }
      ],
      content2: "症状",
      content3: "表现",
      content4: "诊断方法",
      content5: "病因及危险因素",
      content6: "预防",
      content7: "筛查",
      content8: "治疗方案",
      content9: "其他",
      options: [],
      value: "",
      value1: "",
      cur: 0,
      content: `<p>hello world</p>`,
      editorOption: {},
      openIsDisabled: false,
      optionss: [],
      lists: [],
      loadings: false,
      states: [],
      sessionData: {}
    };
  },
  methods: {
    getData(){
      this.axios({
        url: "disease/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => { 
        this.diseaseId = res.data.disease.diseaseId;
        this.id = res.data.disease.id;
      })
    },
    //保存
    addData() {
      var guides = this.sessionData.guides.map((item, index) => {
        return { guideId: item.id};
      });
      var druggeryIds = this.sessionData.druggeryIds.map(item => {
        return item.id;
      });
      var productIds = this.sessionData.productIds.map(item => {
        return item.id;
      });
      var deptId = this.sessionData.deptId.map(item => {
        return item.id;
      });
      var genes = this.sessionData.genes.map(item => {
        return item.id;
      }); 
      if (this.$route.query.id == undefined) {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          url: "disease/addDisease",
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          data: {
            disease: {
              name: _this.sessionData.name,
              nameen: _this.sessionData.nameen,
              muttype: _this.sessionData.muttype,
              mode: _this.sessionData.mode,
              alias: _this.sessionData.alias,
              age: _this.sessionData.age,
              omim: _this.sessionData.omim,
              morbidity: _this.sessionData.morbidity,
              distype: _this.sessionData.distype,
              content:_this.sessionData.content,
              catalog: _this.sessionData.catalog,
              deptId,
              genes,
              druggeryIds,
              guides
            },
            productIds
          }
        })
          .then(res => {
            this.$message({
              type: "success",
              message: "发布成功"
            });
          })
          .catch(err => {
            this.$message(JSON.parse(err.request.response).mag);
          });
      } else {   
        if (this.state == 0) {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "disease/eidtDisease",
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              disease: {
                id: _this.id,
                name: _this.sessionData.name,
                nameen: _this.sessionData.nameen,
                muttype: _this.sessionData.muttype,
                mode: _this.sessionData.mode,
                alias: _this.sessionData.alias,
                age: _this.sessionData.age,
                omim: _this.sessionData.omim,
                morbidity: _this.sessionData.morbidity,
                distype: _this.sessionData.distype,
                catalog: _this.sessionData.catalog,
                content:_this.sessionData.content,
                deptId,
                genes,
                druggeryIds,
                guides
              },
              productIds
            }
          })
            .then(res => {
              _this.$message({
                message: "修改成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message(JSON.parse(err.request.response).mag);
            });
        } else if (this.state == 1) {
          if (this.diseaseId == undefined) {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "disease/addDisease",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params: {
                temId: _this.id
              },
              data: {
                disease: {
                  name: _this.sessionData.name,
                  nameen: _this.sessionData.nameen,
                  muttype: _this.sessionData.muttype,
                  mode: _this.sessionData.mode,
                  alias: _this.sessionData.alias,
                  age: _this.sessionData.age,
                  omim: _this.sessionData.omim,
                  morbidity: _this.sessionData.morbidity,
                  distype: _this.sessionData.distype,
                  catalog: _this.sessionData.catalog,
                  content:_this.sessionData.content,
                  deptId,
                  genes,
                  druggeryIds,
                  guides
                },
                productIds
              }
            })
              .then(res => {
                _this.$message({
                message: "发布成功",
                type: "success"
              });
              })
              .catch(err => {
                this.$message(JSON.parse(err.request.response).mag);
              });
          } else {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "disease/eidtDisease",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params: {
                temId: _this.id
              },
              data: {
                disease: {
                  id: _this.diseaseId,
                  name: _this.sessionData.name,
                  nameen: _this.sessionData.nameen,
                  muttype: _this.sessionData.muttype,
                  mode: _this.sessionData.mode,
                  alias: _this.sessionData.alias,
                  age: _this.sessionData.age,
                  omim: _this.sessionData.omim,
                  morbidity: _this.sessionData.morbidity,
                  distype: _this.sessionData.distype,
                  catalog: _this.sessionData.catalog,
                  content:_this.sessionData.content,
                  deptId,
                  genes,
                  druggeryIds,
                  guides
                },
                productIds
              }
            })
              .then(res => {
                _this.$message({
                message: "修改成功",
                type: "success"
              });
              })
              .catch(err => {
                this.$message(JSON.parse(err.request.response).mag);
              });
          }
        }
      }
    }, 
    cancel() {
      this.$router.go(-1);
    }
  },
  mounted() {
    this.sessionData = JSON.parse(window.sessionStorage.getItem("disease"))
    this.state = this.$route.query.state
    this.getData()
    console.log(this.sessionData.catalog[6].name)
    console.log(this.sessionData)
  },
  created() {
    let loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this.getData();
    loading.close();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active {
  color: goldenrod;
}
* {
  list-style: none;
}
.edit-form {
  max-width: none;
}
.float-l {
  float: left;
}
.list {
  width: 100%;
  height: 150px;
  line-height: 75px;
  display: flex;
  background: #ccc;
  flex-wrap: wrap;
  li {
    width: 180px;
  }
}
.select {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-around;
  margin-top: 100px;
}
.content {
  width: 100%;
  height: 100px;
  .title {
    height: 30px;
    background: #f3f3f3;
    padding-left: 5px;
    input {
      width: 93%;
      border: 0;
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
        .el-button {
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
  width: 100%;
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
