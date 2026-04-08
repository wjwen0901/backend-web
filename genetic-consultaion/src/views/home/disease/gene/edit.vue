<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/gene' }">基因信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="gene-container">
          <el-form ref="solutionForm" :model="gene" label-width="80px" size="mini" class="edit-form clearfix">
            <div class="left">
            <el-form-item label="基因*">
              <el-input v-model="gene.gene" :disabled="genes" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="其他名称">
              <el-input v-model="gene.alias" :disabled="alia" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="外显子数">
              <el-input v-model="gene.exon" :disabled="exons" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="内含子数">
              <el-input v-model="gene.intron" :disabled="introns" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <div class="right">
            <el-form-item label="NM号">
              <el-input v-model="gene.nm" :disabled="nms" placeholder="请输入"></el-input>
            </el-form-item>
             <el-form-item label="相关疾病">
                 <el-select
                  v-model="diseaseIds"
                  :disabled="relatedgenes"
                  value-key="name"
                  multiple
                  style="width:390px"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="diseaseRemote"
                  :loading="diseaseLoading">
                  <el-option
                    v-for="item in diseaseOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="靶向用药">
                 <el-select
                  v-model="meda"
                  :disabled="medicaIds"
                  value-key="name"
                  multiple
                  filterable
                  remote
                  style="width:390px"
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="medica"
                  :loading="medicaLoading">
                  <el-option
                    v-for="item in medicaOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检测产品">
               <el-select
                  v-model="newProduct"
                  :disabled="productIds"
                  value-key="name"
                  multiple
                  style="width:390px"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="product"
                  :loading="productLoading">
                  <el-option
                    v-for="item in productOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
          </div>
          </el-form>
          <ul class="gene-list" >
            其他
          </ul>
          <div class="gene-contents">
              <p class="title">标题：<span>其他</span> </p>
          </div>
          <div class="edit_container">
              <quill-editor
              :disabled="content1"
                v-model="content"
                ref="myQuillEditor"
                @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @change="onEditorChange($event)">
              </quill-editor>
          </div>
           <div class="gene-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <el-button type="primary" @click="preview" :disabled = "openIsDisabled ">预览</el-button>
                <el-button type="primary" @click="disableds">暂存</el-button>
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
      gene: {
        source: {}
      },
      newProduct: [],
      diseaseIds: [],
      diseaseOption:[],
      meda: [],
      menuInfo: this.$route.query.id === undefined ? "新增" : "编辑",
      source: "",
      source1: "",
      options: [],
      sourceList: [],
      testproduct: "",
      targeting: "",
      content: "",
      proDepts: [],
      list: [{ name: "其他", id: 1 }],
      cur: 0,
      value: [],
      openIsDisabled: false,
      title: "",
      //检测基因
      relatedgene: [],
      geneOption: [],
      geneList: [],
      diseaseLoading: false,
      geneState: [],
      //靶向用药
      medicaId: [],
      medicaOption: [],
      medicaList: [],
      medicaLoading: false,
      medicaState: [],
      //检测产品
      productId: [],
      productOption: [],
      productList: [],
      productLoading: false,
      productState: [],
      //禁止
      genes: false,
      alia: false,
      exons: false,
      introns: false,
      nms: false,
      medicaIds: false,
      productIds: false,
      titles: false,
      sources: false,
      source1s: false,
      relatedgenes: false,
      content1: false,
      productNames: "",
      state: "",
      datas: {},
      geneId: ""
    };
  },
  mounted() {
    //相关基因
    this.geneList = this.geneState.map(item => {
      return { value: item, label: item };
    });
    //靶向用药
    this.medicaList = this.medicaState.map(item => {
      return { value: item, label: item };
    });
    //相关产品
    this.productList = this.productState.map(item => {
      return { value: item, label: item };
    });
    this.state = this.$route.query.state;
    this.companyIds();
    this.getCompany();
    this.getData();
  },
  watch: {
    newProduct: {
      handler(newName, oldName) {
        window.sessionStorage.setItem("drugs", JSON.stringify(newName));
      }
    },
    diseaseIds: {
      handler(newName, oldName) {
        window.sessionStorage.setItem("diseases", JSON.stringify(newName));
      }
    },
    meda: {
      handler(newName, oldName) {
        window.sessionStorage.setItem("meda", JSON.stringify(newName));
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    cancel() {
      this.$router.go(-1);
    },
    getCompany() {
      this.axios({
        url: "company"
      }).then(res => {
        this.sourceList = res.data;
      });
    },
    companyIds() {
      this.axios({
        url: "solution/solutionByCompany",
        params: {
          companyId: this.proDepts
        }
      }).then(res => {
        console.log(res.data);
        this.options = res.data.solutions;
      });
    },
    //获取信息
    getData() {
      this.axios({
        url: "gene/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => {
        console.log(res.data);
        this.gene = res.data.gene;
        this.geneId = res.data.gene.geneId;
        this.id = res.data.gene.id;
        this.content = res.data.gene.other;
        this.newProduct = res.data.products == undefined ? [] :  res.data.products.map(item => {
          this.productOption.push({
            id:item.productId,
            name:item.productName
          })
          return {
            id:item.productId,
            name:item.productName
          };
        });
        this.meda = res.data.druggerys == undefined ? [] : res.data.druggerys.map(item=>{
            this.medicaOption.push({id:item.druggeryId,name:item.druggeryName})
            return {id:item.druggeryId,name:item.druggeryName}
          })
       this.diseaseIds = res.data.diseases == undefined ? [] : res.data.diseases.map(item => {
          this.diseaseOption.push({
            id:item.diseaseId,
            name:item.diseaseName
          })
          return {
            id:item.diseaseId,
            name:item.diseaseName
          };
        });
      });
    },
    //发布
    addData() {
      var productIds = this.newProduct.map(item => {
        return item.id;
      });
      var diseaseId = this.diseaseIds.map(item => {
        console.log(item)
        return item.id;
      });
      var medicaId = this.meda.map(item => {
        return item.id;
      });
      if (this.$route.query.id == undefined) {
        if (this.gene.gene == "") {
          this.$message("请输入带有*的信息");
        } else {
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
                gene: _this.gene.gene,
                exon: _this.gene.exon,
                intron: _this.gene.intron,
                nm: _this.gene.nm,
                alias: _this.gene.alias,
                diseaseIds: diseaseId,
                other:_this.content,
                productIds,
                druggeryIds: medicaId
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
        }
      } else {
        if (this.gene.gene == "") {
          this.$message("请输入带有*的信息");
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
                    gene: _this.gene.gene,
                    exon: _this.gene.exon,
                    intron: _this.gene.intron,
                    nm: _this.gene.nm,
                    alias: _this.gene.alias,
                    diseaseIds: diseaseId,
                    other:_this.content,
                    productIds,
                    druggeryIds: medicaId
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
            if (this.geneId == undefined) {
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
                params: {
                  temId: _this.id
                },
                data: {
                  gene: {
                    gene: _this.gene.gene,
                    exon: _this.gene.exon,
                    intron: _this.gene.intron,
                    nm: _this.gene.nm,
                    alias: _this.gene.alias,
                    diseaseIds: diseaseId,
                    other:_this.content,
                    productIds,
                    druggeryIds: medicaId
                  }
                }
              })
                .then(res => {
                  this.$message("新增成功");
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
                url: "gene/editGene",
                method: "put",
                headers: {
                  "Content-Type": "application/json",
                  "X-Requested-With": "XMLHttpRequest"
                },
                params: {
                  temId: _this.id
                },
                data: {
                  gene: {
                    id:_this.geneId,
                    gene: _this.gene.gene,
                    exon: _this.gene.exon,
                    intron: _this.gene.intron,
                    nm: _this.gene.nm,
                    alias: _this.gene.alias,
                    diseaseIds: diseaseId,
                    other:_this.content,
                    productIds,
                    druggeryIds: medicaId
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
      }
    },
    //预览
    preview() {
      var obj = {};
      (obj.gene = this.gene.gene),
      (obj.exon = this.gene.exon),
      (obj.intron = this.gene.intron),
      (obj.nm = this.gene.nm),
      (obj.alias = this.gene.alias),
      (obj.diseaseIds = this.diseaseIds),
      (obj.productIds = this.newProduct),
      (obj.druggeryIds = this.meda);
      (obj.other = this.content),
      (obj.geneId = this.geneId)
      window.sessionStorage.setItem("gene", JSON.stringify(obj));
      this.$router.push({
        name: "GenePreview",
        query:{
          id:this.$route.query.id,
          state:this.$route.query.state
        }
      });
    },
    //相关疾病
    diseaseGetdata(disease) {
      let instance = this.axios.create({
        baseURL: process.env.PRODUCT,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      instance({
        method: "get",
        url: "diseaseData/getDiseasesByPage",
        params: {
          param: disease
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        }
      }).then(function(res) {
        _this.diseaseOption = res.data.diseases.map((item, index) => {
          return {
            id: item.id,
            name: item.name
          };
        });
      });
    },
    diseaseRemote(query) {
      this.diseaseGetdata(query);
      if (query !== "") {
        this.diseaseLoading = true;
        setTimeout(() => {
          this.diseaseLoading = false;
        }, 200);
      } else {
        this.diseaseOption = [];
      }
    },
    //靶向用药
    medicaGetdata(medica) {
      this.axios({
        url: "druggery/all",
        params: {
          keyWord: medica
        }
      }).then(res => {
        this.medicaOption = res.data.druggeries.map((item, index) => {
          return {
            id: item.id,
            name: item.drugName
          };
        });
        console.log(this.medicaOption);
      });
    },
    medica(query) {
      this.medicaGetdata(query);
      if (query !== "") {
        this.medicaLoading = true;
        setTimeout(() => {
          this.medicaLoading = false;
        }, 200);
      } else {
        this.medicaOption = [];
      }
    },
    //检测产品
    productGetdata(product) {
      let instance = this.axios.create({
        baseURL: process.env.PRODUCT,
        headers: {
          "Content-Type": "application/json"
        }
      });
      let _this = this;
      instance({
        method: "get",
        url: "product/getProductByName",
        params: {
          param: product
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "Content-Type": "application/json"
        }
      }).then(function(res) {
        _this.productOption = res.data.products.list.map((item, index) => {
          return {
            id: item.id,
            name: item.name
          };
        });
      });
    },
    product(query) {
      this.productGetdata(query);
      if (query !== "") {
        this.productLoading = true;
        setTimeout(() => {
          this.productLoading = false;
        }, 200);
      } else {
        this.productOption = [];
      }
    },
    //暂存按钮
    disableds() {
     var newProduct = this.newProduct.map(item => {
          return item.id
        });
        var meda = this.meda.map(item=>{
            return item.id
          })
       var diseaseIds = this.diseaseIds.map(item => {
             return item.id
        });
      this.openIsDisabled = !this.openIsDisabled;
      (this.genes = !this.genes),
        (this.alia = !this.alia),
        (this.exons = !this.exons),
        (this.introns = !this.introns),
        (this.nms = !this.nms),
        (this.medicaIds = !this.medicaIds),
        (this.productIds = !this.productIds),
        (this.titles = !this.titles),
        (this.sources = !this.sources),
        (this.source1s = !this.source1s),
        (this.content1 = !this.content1),
        (this.relatedgenes = !this.relatedgenes);
      if (this.$route.query.id == undefined) {
        if (this.gene.gene == "") {
          this.$message("请输入带有*的信息");
        } else {
          let instance = this.axios.create({
            headers: {
              Authorization: window.localStorage.token,
              "Content-Type": "application/json"
            }
          });
          let _this = this;
          instance({
            url: "gene/addGeneTem",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              geneTem: {
                gene: _this.gene.gene,
                exon: _this.gene.exon,
                intron: _this.gene.intron,
                nm: _this.gene.nm,
                alias: _this.gene.alias,
                diseaseIds: diseaseIds,
                other:_this.content,
                productIds: newProduct,
                druggeryIds: meda
              }
            }
          })
            .then(res => {
              this.$message({
                type:'success',
                message:'暂存成功'
              });
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
            });
        }
      } else {
        if (this.gene.gene == "") {
          this.$message("请输入带有*的信息");
        } else {
          if (this.state == 1) {
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
              data: {
                geneTem: {
                  id: _this.id,
                  geneId:_this.geneId,
                 gene: _this.gene.gene,
                exon: _this.gene.exon,
                intron: _this.gene.intron,
                nm: _this.gene.nm,
                alias: _this.gene.alias,
                diseaseIds: diseaseIds,
                productIds: newProduct,
                other:_this.content,
                druggeryIds: meda
                }
              }
            })
              .then(res => {
                this.$message({
                type:'success',
                message:'暂存成功'
              });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          } else if (this.state == 0) {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "gene/addGeneTem",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              data: {
                geneTem: {
                geneId: _this.id,
                gene: _this.gene.gene,
                exon: _this.gene.exon,
                intron: _this.gene.intron,
                nm: _this.gene.nm,
                alias: _this.gene.alias,
                diseaseIds: diseaseIds,
                productIds: newProduct,
                other:_this.content,
                druggeryIds: meda
                }
              }
            })
              .then(res => {
                this.$message({
                type:'success',
                message:'暂存成功'
              });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          }
        }
      }
    },
    //富文本
    onEditorReady(editor) {}, // 准备编辑器,
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    saveHtml: function(event) {
      alert(this.content);
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
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
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
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
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

  destroyed() {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active {
  color: goldenrod;
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
