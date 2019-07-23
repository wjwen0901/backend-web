<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">基因信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>预览</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container"> 
          <el-form ref="solutionForm" :model="gene" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="基因*">
              <span>{{sessionData.gene}}</span>
              <!-- <el-input v-model="gene.gene" :placeholder="sessionData.gene"></el-input> -->
            </el-form-item>
            <el-form-item label="其他名称">
              <span>{{sessionData.alias}}</span>
              <!-- <el-input v-model="gene.alias" :placeholder="sessionData.alias"></el-input> -->
            </el-form-item>
            <el-form-item label="外显子数">
              <span>{{sessionData.exon}}</span>
              <!-- <el-input v-model="gene.exon" :placeholder="sessionData.exon"></el-input> -->
            </el-form-item>
            <el-form-item label="内含子数">
              <span>{{sessionData.intron}}</span>
              <!-- <el-input v-model="gene.intron" :placeholder="sessionData.intron"></el-input> -->
            </el-form-item> 
          </div>
          <div class="right">
            <el-form-item label="NM号">
              <span>{{sessionData.nm}}</span>
              <!-- <el-input v-model="gene.nm" :placeholder="sessionData.nm"></el-input> -->
            </el-form-item> 
            <el-form-item label="相关疾病">
                <span v-for="(item,index) in sessionData.diseaseIds" :key="index">{{item.name}} &nbsp;&nbsp;</span>
            </el-form-item>  
              <el-form-item label="靶向用药">
                 <span v-for="(item,index) in sessionData.druggeryIds" :key="index">{{item.name}}&nbsp;&nbsp;</span>
              </el-form-item>
              <el-form-item label="检测产品">
                <span v-for="(item,index) in sessionData.productIds" :key="index">{{item.name}}&nbsp;&nbsp;</span>
              </el-form-item>
          </div>   
          </el-form>
          <ul class="gene-list" >
            其他
          </ul> 
          <div class="gene-contents"> 
              <p class="title">标题：<span>其他</span> </p>
              <p v-html="sessionData.other"></p>
          </div>  
           <div class="gene-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button> 
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
           </div>
        </div> 
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "GeneEdit",
  data() {
    return { 
      list: [{ name: "其他", id: 1 }],  
      sessionData: {},
      geneId:null,
      state:null
    };
  },
  mounted() { 
    this.sessionData = JSON.parse(window.sessionStorage.getItem("gene"));
    this.getData();
    this.state = this.$route.query.state;
    console.log(this.sessionData)
  },
  methods: {
    getData(){
      this.axios({
        url: "gene/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => {
        this.id = res.data.gene.id;
        this.geneId = res.data.gene.geneId
      })
    },
    cancel(){
      this.$router.go(-1)
    } ,
    //保存
    addData() {
      var productIds = this.sessionData.productIds.map(item => {
        return item.id;
      });
      var diseaseId = this.sessionData.diseaseIds.map(item => {
        return item.id;
      });
      var medicaId = this.sessionData.druggeryIds.map(item => {
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
            url: "gene/addGene",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              gene: {
                gene: _this.sessionData.gene,
                exon: _this.sessionData.exon,
                intron: _this.sessionData.intron,
                nm: _this.sessionData.nm,
                alias: _this.sessionData.alias,
                diseaseIds: diseaseId,
                other:_this.sessionData.other,
                productIds,
                druggeryIds:medicaId
              }
            }
          })
            .then(res => {
              _this.$message({
                message: "发布成功",
                type: "success"
              });
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
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
              url: "gene/editGene",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              }, 
              data: {
                gene: {
                  id:_this.id,
                  gene: _this.sessionData.gene,
                  exon: _this.sessionData.exon,
                  intron: _this.sessionData.intron,
                  nm: _this.sessionData.nm,
                  alias: _this.sessionData.alias,
                  diseaseIds: diseaseId,
                  other:_this.sessionData.other,
                  productIds,
                  druggeryIds:medicaId
                }
              }
            })
              .then(res => {
                this.$message({
                  type:'success',
                  message:'修改成功'
                });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          } else if (this.state == 1) {
            if (this.geneId == "") {
              let instance = this.axios.create({
                headers: {
                  Authorization: window.localStorage.token,
                  "Content-Type": "application/json"
                }
              });
              let _this = this;
              instance({
                url: "gene/addTem",
                method: "post",
                headers: {
                  "Content-Type": "application/json",
                  "X-Requested-With": "XMLHttpRequest"
                },
                params: {
                  temId: _this.id
                },
                data: {
                  geneTem: {
                   gene: _this.sessionData.gene,
                    exon: _this.sessionData.exon,
                    intron: _this.sessionData.intron,
                    nm: _this.sessionData.nm,
                    alias: _this.sessionData.alias,
                    diseaseIds: diseaseId,
                    other:_this.sessionData.other,
                    productIds,
                    druggeryIds:medicaId
                  }
                }
              })
                .then(res => {
                  this.$message("修改成功");
                })
                .catch(err => {
                  _this.$message(JSON.parse(err.request.response).msg);
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
                url: "gene/editTem",
                method: "put",
                headers: {
                  "Content-Type": "application/json",
                  "X-Requested-With": "XMLHttpRequest"
                },
                params: {
                  temId: _this.id
                },
                data: {
                  geneTem: {
                    id:_this.geneId,
                    gene: _this.sessionData.gene,
                    exon: _this.sessionData.exon,
                    intron: _this.sessionData.intron,
                    nm: _this.sessionData.nm,
                    alias: _this.sessionData.alias,
                    diseaseIds: diseaseId,
                    other:_this.sessionData.other,
                    productIds,
                    druggeryIds:medicaId
                  }
                }
              })
                .then(res => {
                  this.$message("修改成功");
                })
                .catch(err => {
                  _this.$message(JSON.parse(err.request.response).msg);
                });
            }
          } 
      }
    },
    
    _initData() {
      if (this.$route.params.id !== undefined) {
        this.axios
          .get("gene/" + this.$route.params.id)
          .then(res => {
            this.gene = res.data;
            this.sampleMeta = res.data.sampleMeta;
            this.proDepts = res.data.deptName;
            if (res.data.expand !== undefined) {
              let _this = this;
              res.data.expand.forEach(function(item) {
                if (item.type === 0) {
                  _this.reportType.push(item.name);
                  if (item.remark !== undefined) {
                    _this.reportTypeOtherRemark = item.remark;
                  }
                } else {
                  _this.consultancy.push(item.name);
                  if (item.remark !== undefined) {
                    _this.consultancyOtherRemark = item.remark;
                  }
                }
              });
            }
            console.log(this.reportType);
            console.log(this.consultancy);
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    edit() {
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
          url: "gene",
          data: {
            gene: this.gene,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            userId: window.localStorage.userId
          },
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json"
          }
        })
          .then(function(res) {
            if (res.data.state === "exist alreay!") {
              _this.$message({
                message: "产品名称重复",
                type: "error"
              });
            } else {
              _this.$message({
                message: "新增成功",
                type: "success"
              });
              _this.$router.push("/gene");
            }
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
          url: "gene/" + this.$route.params.id,
          data: {
            gene: this.gene,
            deptId: this.proDepts,
            sampleMetaId: this.sampleMeta,
            solutionExpands: this.expandParams,
            userId: window.localStorage.userId
          },
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
            _this.$router.push("/gene");
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
      this.$router.push("/gene");
    }
  },
  filters: {},
  computed: {
    expandParams: function() {
      let result = [];
      let _this = this;
      if (this.reportType !== null) {
        _this.reportType.forEach(function(item) {
          let expandParams = {
            name: item,
            type: 0
          };
          if (_this.reportTypeOtherRemark !== "" && item === 3) {
            expandParams.remark = _this.reportTypeOtherRemark;
          }
          result.push(expandParams);
        });
      }
      if (this.consultancy !== null) {
        this.consultancy.forEach(function(item) {
          let expandParams = {
            name: item,
            type: 1
          };
          if (_this.consultancyOtherRemark !== "" && item === 4) {
            expandParams.remark = _this.consultancyOtherRemark;
          }
          result.push(expandParams);
        });
      }
      console.log(result);
      return result;
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
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active{
  color:goldenrod;
}
.edit-form {
  max-width: none;
}
.float-l {
  float: left;
}
.gene-select {
  width: 100%;
  text-align: center;
  display: flex;
  margin: 20px 0;
  .el-select {
    margin-left: 100px;
  }
}
.title {
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
.gene-list {
  width: 100%;
  height: 50px;
  background: #f3f3f3;
  display: flex;
  line-height: 50px;
  li {
    width: 25%;
  }
}
.gene-contents {
  width: 100%;
  height: 50px;
  line-height: 50px;
  margin-bottom: 10px;
}
.gene-btns {
  width: 100%;
  text-align: center;
  .el-button {
    margin: 0 2%;
  }
}
.gene-container {
  width: 100%;
  margin: 20px 0px;
  padding: 20px;
  background: #ffffff;
  .left {
    width: 50%;
    float: left;
    height: 100%;
  }
  .right {
    width: 50%;
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
