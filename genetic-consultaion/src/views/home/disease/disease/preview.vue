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
                <p class="title">标题：<input placeholder="请输入标题" v-model="content2" :disabled='btitle2' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[0].症状">   
                </div>
              </div>
              <div class="content" v-show="cur==1"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content3" :disabled='btitle3' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[1].表现">  
                </div>
              </div>  
              <div class="content" v-show="cur==2"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content4" :disabled='btitle4' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[2].诊断方法"> 
                 
                </div>
              </div>
              <div class="content" v-show="cur==3"> 
                <p class="title">标题：<input placeholder="请输入标题"  v-model="content5" :disabled='btitle5' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[3].病因及危险因素">  
                </div>
              </div>
              <div class="content" v-show="cur==4"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content6" :disabled='btitle6' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[4].预防"> 
                 
                </div>
              </div>
              <div class="content" v-show="cur==5"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content7" :disabled='btitle7' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[5].筛查"> 
                
                </div>
              </div>
              <div class="content" v-show="cur==6"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content8" :disabled='btitle8' type="text"></p> 
                <div class="edit_container" v-html="sessionData.catalog[6].治疗方案">  
                </div>
              </div>
              <div class="content" v-show="cur==7"> 
                <p class="title">标题：<input placeholder="请输入标题" v-model="content9" :disabled='btitle9' type="text"></p>
                <div class="edit_container" v-html="sessionData.catalog[7].其他">  
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
        return { guideId: item.id };
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
        } else if (this.state == 1) {
          if (this.diseaseId == "") {
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
          }
        }
      }
    },
    _initData() {
      let instance = this.axios.create({
        baseURL: process.env.DISEASE_PC_API,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      if (this.$route.params.id !== undefined) {
        instance({
          method: "get",
          url: "diseaseData/getDisease",
          params: {
            id: this.$route.params.id
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        }).then(function(res) {
          _this.disease = res.data.disease;
          if (_this.disease.deptId === undefined) {
            _this.disease.deptId = [];
          } else {
            _this.disease.deptId = _this.disease.deptId.map(Number);
          }
          _this.guides = [];
          if (_this.disease.guides !== undefined) {
            _this.guides = _this.disease.guides;
          }
          if (_this.disease.catalog === undefined) {
            _this.disease.catalog = [];
          }
        });
      }
      instance({
        method: "get",
        url: "guide/getGuides",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        },
        params: {
          pageNum: 1,
          pageSize: 10,
          param: ""
        }
      }).then(function(res) {
        _this.guideList = res.data;
      });

      this.axios
        .get("hospital-dept")
        .then(res => {
          this.deptList = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    edit() {
      this.disease.deptId = this.disease.deptId.map(String);
      this.disease.guides = this.guides;
      if (this.$route.params.id === undefined) {
        let instance = this.axios.create({
          headers: {
            Authorization: window.localStorage.token,
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          method: "post",
          url: "disease/eidtDisease",
          data: {
            disease: this.disease,
            userId: window.localStorage.userId
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function(res) {
            _this.$message({
              message: "新增成功",
              type: "success"
            });
            _this.$router.push("/disease");
          })
          .catch(function() {
            _this.$message({
              message: "新增失败",
              type: "error"
            });
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
          method: "put",
          url: "disease/eidtDisease",
          data: this.disease,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function() {
            _this.$message({
              message: "修改成功",
              type: "success"
            });
            _this.$router.push("/disease");
          })
          .catch(function() {
            _this.$message({
              message: "修改失败",
              type: "error"
            });
          });
      }
    },
    cancel() {
      this.$router.go(-1);
    },
    remoteMethod(query) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        let instance = this.axios.create({
          baseURL: process.env.DISEASE_PC_API,
          headers: {
            "Content-Type": "application/json"
          }
        });
        let _this = this;
        instance({
          method: "get",
          url: "guide/getGuides",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          },
          params: {
            pageNum: 1,
            pageSize: 10,
            param: query
          }
        }).then(function(res) {
          _this.guideList = res.data;
          console.log(_this.guideList);
        });
      }, 200);
    },
    toAddCatelog() {
      this.disease.catalog.push({ name: "", content: "" });
    },
    deleteCatelog(index) {
      this.disease.catalog.splice(index, 1);
    }
  },
  mounted() {
    this.sessionData = JSON.parse(window.sessionStorage.getItem("disease")); 
    this.getData()
    this.state = this.$route.query.state;
    console.log(this.sessionData);
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  created() {
    let loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    this._initData();
    loading.close();
  },
  destroyed() {}
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
