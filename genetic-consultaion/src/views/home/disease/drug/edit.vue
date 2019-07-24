<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">指南管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{menuInfo}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm" :model="drug" label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题*"> 
                <el-input v-model="drug.title" :disabled="drugNames" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="制定者*">
                <el-input v-model="drug.framers" :disabled="customizers" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="发布日期*"> 
                 <el-date-picker
                    v-model="nowDate"
                    :disabled="inaccurates"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请输入">
                  </el-date-picker>
              </el-form-item> 
              <el-form-item label="检测产品">
               <el-select 
                  v-model="newProduct"
                  :disabled="products"
                  value-key="name"
                  multiple
                  style="width:390px"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请选择"
                  :remote-method="remoteMethod"
                  :loading="loadings">
                  <el-option
                    v-for="item in productOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="英文标题*">
                <el-input v-model="drug.titleEn" :disabled="drugNameEns" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="出处*">
                <el-input v-model="drug.provenance" :disabled="producers" placeholder="请输入"></el-input>
              </el-form-item> 
              <el-form-item label="相关疾病">
                 <el-select
                  v-model="diseaseIds"
                  :disabled="diseases"
                  value-key="name"
                  multiple
                  filterable
                  remote
                  style="width:390px"
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
              <el-form-item label="相关基因">
                 <el-select
                  v-model="geneId"
                  :disabled="genes"
                  value-key="name"
                  multiple
                  style="width:390px"
                  filterable
                  remote
                  reserve-keyword 
                  placeholder="请选择"
                  :remote-method="geneRemote"
                  :loading="geneLoading">
                  <el-option
                    v-for="item in geneOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="form-list" >
                <li v-for="(item,index) in list" :key="index" @click="cur=index" :class="{active:cur==index}">
                 {{item.id}}.{{item.name}}
                </li> 
              </ul>
              <div class="from-contents" v-show="cur==0">
                <div>
                  <span v-for="(item,index) in path" :key="index"  class="path" @click="paths(item.path)">{{item.file_source}}</span> 
                </div>
                <div class="ap-upload">
                  <div class="u-select">
                  <!-- <p class="form-group-title">选择文件</p> -->
                      <div class="upload-row">
                      <div tabindex="0" class="el-upload el-upload--picture-card" id="selectfiless" >
                          <i class="el-icon-plus"></i>
                          <input type="file" name="file" multiple="multiple"  class="el-upload__input">
                      </div>
                      <div class="el-upload__tip">只能上传jpg/gif/png/bmp/pdf文件，且不超过5G</div>
                      <ul class="el-upload-list el-upload-list--text" id="ossfile">
                          <li tabindex="0" class="el-upload-list__item is-ready" :id="file.id" v-for="file in fileList" v-bind:key="file.id" ref="file.id">
                          <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}} ({{file.size | formatSize}})</a>
                          <label class="el-upload-list__item-status-label">
                              <i class="el-icon-upload-success el-icon-circle-check"></i>
                          </label>
                          <i class="el-icon-close" @click="deleteUploadFile(file.id)"></i>
                          </li>
                      </ul> 
                      <div id="containers"></div>
                      </div>
                      </div>
                  </div>
              </div>
              <div class="from-contents" v-show="cur==1">
                <div class="edit_container">
                    <quill-editor 
                      v-model="drug.other" 
                      :disabled="countenes"
                      ref="myQuillEditor" 
                      @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                      @change="onEditorChange($event)">
                    </quill-editor> 
                </div>
              </div> 
           <el-form-item class="from-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>
                <!-- <el-button type="primary" @click="preview" :disabled = " openIsDisabled ">预览</el-button> -->
                <el-button type="primary"  @click="disableds">暂存</el-button>
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
import plupload from "plupload";
import qs from "qs"; 
export default {
  name: "DiseaseEdit",
  data() {
    return {
      data: [],
      dis:0,
      files: [],
      addRowData: ["add"],
      fda: {},
      cfda: {},
      drug: {
        source: {},
        titleEn: ""
      },
      nowDate: "",
      newProduct: {},
      diseaseIds: {},
      geneId: [],
      product: [],
      disease: [],
      gene: [],
      valueList: [],
      content: "",
      sampleMeta: [],
      proDepts: [],
      menuInfo: this.$route.query.id === undefined ? "新增" : "编辑",
      reportType: [],
      consultancy: [],
      deptList: [],
      productOption: [],
      reportTypeOtherRemark: "",
      consultancyOtherRemark: "",
      cur: 0,
      list: [{ name: "指南", id: 1 }, { name: "其他", id: 2 }],
      openIsDisabled: false,
      options: [],
      diseaseOption: [],
      geneOption: [],
      value: [],
      lists: [],
      geneList: [],
      diseaseList: [],
      loadings: false,
      geneLoading: false,
      diseaseLoading: false,
      states: [],
      diseaseState: [],
      geneState: [],
      //禁止
      drugNames: false,
      customizers: false,
      inaccurates: false,
      products: false,
      drugNameEns: false,
      producers: false,
      diseases: false,
      genes: false,
      countenes: false,
      values: false,
      value1s: false,
      datas: {},
      guideId: "",
      dataOne: {},
      //上传
      userId: window.localStorage.userId,
      report: {
        fullName:
          window.localStorage.fullName === undefined
            ? ""
            : window.localStorage.fullName,
        cellphone:
          window.localStorage.cellphone === undefined
            ? ""
            : window.localStorage.cellphone,
        companyId:
          window.localStorage.companyId === undefined
            ? ""
            : window.localStorage.companyId
      },
      readyName: "",
      readyCellphone: "",
      name: "",
      cellphone: "",
      nameError: false,
      cellphoneError: false,
      fileError: false,
      fileNum: 0,
      accessid: "",
      accesskey: "",
      host: "",
      policyBase64: "",
      signature: "",
      callbackbody: "",
      filename: "",
      key: "",
      expire: 0,
      g_object_name: "",
      g_object_name_type: "",
      now: Date.parse(new Date()) / 1000,
      uniqueKey: "",
      fileList: [],
      uploader: {},
      hasUserInfo: false,
      projects: [],
      companyList: [],
      param: [],
      newDates: "",
      path: []
    };
  }, 
  mounted() {
    this.lists = this.states.map(item => {
      return { value: item.id, label: item.name };
    });
    this.diseaseList = this.diseaseState.map(item => {
      return { value: item.id, label: item.name };
    });
    this.geneList = this.geneState.map(item => {
      return { value: item.id, label: item.name };
    });
    //上传
    this.$nextTick(() => {
      this.upload();
    });
    this.state = this.$route.query.state;
    this.companyIds();
    this.getCompany();
    this.getDatas();
  },
  methods: {  
    del() {
      this.path = "";
    },
    paths(val) {
      this.axios({
          url: "oss/upload/show",
          params: {
            objectKey: val,
            bucket: "mdhcare"
          }
        }).then(res => {
      window.open(res.data); 
        });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    getCompany() {
      this.axios({
        url: "company"
      }).then(res => {
        this.valueList = res.data;
      });
    },
    companyIds() {
      this.axios({
        url: "solution/solutionByCompany",
        params: {
          companyId: this.proDepts
        }
      }).then(res => {
        this.options = res.data.solutions;
      });
    },
    //预览
    preview() { 
      console.log(this.path)
      var nowDates = this.nowDate.split(",");
      var titleEn = this.drug.titleEn.split(",");
      var framers = this.drug.framers.split(",");
      var provenance = this.drug.provenance.split(",");
      var obj = {};
      (obj.other = this.drug.other),
        (obj.title = this.drug.title),
        (obj.titleEn = titleEn),
        (obj.framers = framers),
        (obj.provenance = provenance),
        (obj.publishDate = nowDates),
        (obj.diseaseIds = this.diseaseIds),
        (obj.productIds = this.newProduct);
        obj.geneId = this.geneId;
        obj.guideId = this.guideId;
        obj.guideFileAttrs = this.path;
        obj.guideFileList = this.fileList
        window.sessionStorage.setItem("drug", JSON.stringify(obj));
        this.$router.push({
          name: "DrugPreview",
          query: {
            id: this.$route.query.id,
            state: this.$route.query.state
          }
        });
    },
    addData1(){
      var geneIds = this.geneId.map(item => {
          return item.id;
        });
        var diseaseIds = this.diseaseIds.map(item => {
          return item.id;
        });
        var productIds = this.newProduct.map(item => {
          return item.id;
        }); 
        if (this.$route.query.id == undefined) {
          if (this.drug.title == undefined || this.drug.framers == undefined ||
              this.nowDate == undefined || this.drug.titleEn == "" ||
              this.drug.provenance == "") {
            this.$message("请输入带有*的信息");
          } else {
            console.log(this.drug)
            var nowDates = this.nowDate.split(",");
            var titleEn = this.drug.titleEn.split(",");
            var framers = this.drug.framers.split(",");
            var provenance = this.drug.provenance.split(",");
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "guideManage/addGuide",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              data: {
                guide: {
                  other: _this.drug.other,
                  title: _this.drug.title,
                  titleEn,
                  framers,
                  provenance,
                  publishDate: nowDates,
                  diseaseIds,
                  geneIds
                },
                productIds,
                guideFileAttrs: _this.files
              }
            })
              .then(res => {
                this.temid = res.data.id; 
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
          if (
            this.drug.title == "" &&
            this.drug.framers == "" &&
            this.nowDate == "" &&
            this.drug.titleEn == "" &&
            this.drug.provenance == ""
          ) {
            this.$message("请输入带有*的信息");
          } else {
            var nowDates = this.nowDate.split(",");
            var titleEn = this.drug.titleEn.split(",");
            var framers = this.drug.framers.split(",");
            var provenance = this.drug.provenance.split(",");
            if (this.state == 0) {  
              let instance = this.axios.create({
                headers: {
                  Authorization: window.localStorage.token,
                  "Content-Type": "application/json"
                }
              });
              let _this = this;
              instance({
                url: "guideManage/editGuide",
                method: "put",
                headers: {
                  "Content-Type": "application/json",
                  "X-Requested-With": "XMLHttpRequest"
                }, 
                data: {
                  guide: {
                    id: _this.id,
                    other: _this.drug.other,
                    title: _this.drug.title,
                    titleEn,
                    framers,
                    provenance,
                    publishDate: nowDates,
                    diseaseIds,
                    geneIds
                  },
                  productIds,
                  guideFileAttrs: _this.files
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
            } else if (this.state == 1) {
              if (this.guideId == undefined) {
                let instance = this.axios.create({
                  headers: {
                    Authorization: window.localStorage.token,
                    "Content-Type": "application/json"
                  }
                });
                let _this = this;
                instance({
                  url: "guideManage/addGuide",
                  method: "post",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                  }, 
                  params: {
                    temId: _this.id
                  },
                  data: {
                    guide: { 
                      other: _this.drug.other,
                      title: _this.drug.title,
                      titleEn,
                      framers,
                      provenance,
                      publishDate: nowDates,
                      diseaseIds,
                      geneIds
                    },
                    productIds,
                   guideFileAttrs: _this.files
                  }
                })
                  .then(res => { 
                    this.$message({
                      type: "success",
                      message: "发布成功"
                    });
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
                  url: "guideManage/editGuide",
                  method: "put",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest"
                  },
                  params: {
                    temId: _this.id
                  },
                  data: {
                    guide: {
                      id: _this.guideId,
                      other: _this.drug.other,
                      title: _this.drug.title,
                      titleEn,
                      framers,
                      provenance,
                      publishDate: nowDates,
                      diseaseIds,
                      geneIds
                    },
                    productIds,
                    guideFileAttrs: _this.files
                  }
                })
                  .then(res => {
                    this.$message({
                      type: "success",
                      message: "发布成功"
                    });  
                  })
                  .catch(err => {
                    _this.$message(JSON.parse(err.request.response).msg);
                  });
              }
            }
          }
        } 
    },
    //发布
    addData() {  
      if(this.fileNum==0){
        this.addData1();
      }else{ 
          this.dis=2; 
          this.setUploadParam(this.uploader, "", false);  
      }
    },
     //暂存
     disableds(){
        if(this.fileNum==0){
          this.disableds1() 
        }else{ 
          this.dis=1; 
          this.setUploadParam(this.uploader, "", false);   
        }
      },
    disableds1() {
      var geneIds = this.geneId.map(item => {
        return item.id;
      });
      var diseaseIds = this.diseaseIds.map(item => {
        return item.id;
      });
      var productIds = this.newProduct.map(item => {
        return item.id;
      });
      this.openIsDisabled = !this.openIsDisabled;
      this.drugNames = !this.drugNames;
      this.customizers = !this.customizers;
      this.inaccurates = !this.inaccurates;
      this.products = !this.products;
      this.drugNameEns = !this.drugNameEns;
      this.producers = !this.producers;
      this.diseases = !this.diseases;
      this.genes = !this.genes;
      this.countenes = !this.countenes;
      this.values = !this.values;
      this.value1s = !this.value1s;
      if (this.$route.query.id == undefined) {
        var titleEn = this.drug.titleEn.split(",");
        var framers = this.drug.framers.split(",");
        var provenance = this.drug.provenance.split(",");
        var nowDates = this.nowDate.split(",");
        if (
          this.drug.title == "" &&
          this.drug.framers == "" &&
          this.nowDate == "" &&
          this.drug.titleEn == "" &&
          this.drug.provenance == ""
        ) {
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
            url: "guideManage/addTem",
            method: "post",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest"
            },
            data: {
              guideTem: {
                guideId: _this.id,
                other: _this.drug.other,
                title: _this.drug.title,
                titleEn,
                framers,
                provenance,
                publishDate: nowDates,
                diseaseIds,
                geneIds
              },
              productIds,
              guideFileAttrs: _this.files
            }
          })
            .then(res => {
              window.localStorage.removeItem("params");
              this.$message({
                type: "success",
                message: "暂存成功"
              });
            })
            .catch(err => {
              _this.$message(JSON.parse(err.request.response).msg);
            });
        }
      } else {
        var titleEn = this.drug.titleEn.split(",");
        var framers = this.drug.framers.split(",");
        var provenance = this.drug.provenance.split(",");
        var nowDates = this.nowDate.split(",");
        if (
          this.drug.title == "" &&
          this.drug.framers == "" &&
          this.nowDate == "" &&
          this.drug.titleEn == "" &&
          this.drug.provenance == ""
        ) {
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
              url: "guideManage/addTem",
              method: "post",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              
              data: {
                guideTem: {
                  guideId: _this.id,
                  other: _this.drug.other,
                  title: _this.drug.title,
                  titleEn,
                  framers,
                  provenance,
                  publishDate: nowDates,
                  diseaseIds,
                  geneIds
                },
                productIds,
                guideFileAttrs: _this.files
              }
            })
              .then(res => {
                window.localStorage.removeItem("params");
                this.$message({
                  type: "success",
                  message: "暂存成功"
                });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          } else if (this.state == 1) {
            let instance = this.axios.create({
              headers: {
                Authorization: window.localStorage.token,
                "Content-Type": "application/json"
              }
            });
            let _this = this;
            instance({
              url: "guideManage/editTem",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              data: {
                guideTem: {
                  id: _this.id,
                  guideId: _this.id,
                  drugId:_this.drugId,
                  other: _this.drug.other,
                  title: _this.drug.title,
                  titleEn,
                  framers,
                  provenance,
                  publishDate: nowDates,
                  diseaseIds,
                  geneIds
                },
                productIds,
                guideFileAttrs: _this.files
              }
            })
              .then(res => {
                window.localStorage.removeItem("params");
                this.$message({
                  type: "success",
                  message: "暂存成功"
                });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          }
        }
      }
    },
    
    //获取信息
    getDatas() {
      this.axios({
        url: "guideManage/byId",
        params: {
          id: this.$route.query.id,
          state: this.$route.query.state
        }
      }).then(res => {
        console.log(res.data);
        this.drug = res.data.guide;
        this.guideId = res.data.guide.guideId;
        this.id = res.data.guide.id;
        this.nowDate = res.data.guide.publishDate.join(",");
        this.drug.framers = res.data.guide.framers.join(",");
        this.drug.provenance = res.data.guide.provenance.join(",");
        this.drug.titleEn = res.data.guide.titleEn.join(","); 
        this.path = res.data.guide.files; 

        this.geneId = res.data.genes == undefined ? [] : res.data.genes.map(item => {
          this.geneOption.push({ id: item.geneId, name: item.geneName });
          return {
            id: item.geneId,
            name: item.geneName
          };
        });
        this.diseaseIds = res.data.diseases == undefined ? [] : res.data.diseases.map(item => {
          this.diseaseOption.push({
            id: item.diseaseId,
            name: item.diseaseName
          });
          return {
            id: item.diseaseId,
            name: item.diseaseName
          };
        });
        this.newProduct = res.data.products == undefined ? [] :  res.data.products.map(item => {
          this.productOption.push({
            id: item.productId,
            name: item.productName
          });
          return {
            id: item.productId,
            name: item.productName
          };
        });
      });
    },
    //检测产品、
    getData(product) {
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
    remoteMethod(query) {
      this.getData(query);
      if (query !== "") {
        this.loadings = true;
        setTimeout(() => {
          this.loadings = false;
        }, 200);
      } else {
        this.options = [];
      }
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
    //相关基因
    geneGetdata(gene) {
      this.axios({
        url: "gene/all",
        params: {
          keyWord: gene
        }
      }).then(res => {
        this.geneOption = res.data.genes.map((item, index) => {
          return {
            id: item.id,
            name: item.gene
          };
        });
      });
    },
    geneRemote(query) {
      this.geneGetdata(query);
      if (query !== "") {
        this.geneLoading = true;
        setTimeout(() => {
          this.geneLoading = false;
        }, 200);
      } else {
        this.geneOption = [];
      }
    },
   
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
          .get("drug/" + this.$route.params.id)
          .then(res => {
            this.drug = res.data;
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
          })
          .catch(err => {});
      }
      this.axios
        .get("hospital-dept")
        .then(res => {
          this.deptList = res.data;
        })
        .catch(err => {});
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
          url: "drug",
          data: {
            drug: this.drug,
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
              _this.$router.push("/drug");
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
          url: "drug/" + this.$route.params.id,
          data: {
            drug: this.drug,
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
            _this.$router.push("/drug");
          })
          .catch(function() {
            _this.$message({
              message: "修改失败",
              type: "error"
            });
          });
      }
    },
    sendRequest() {

      const xmlhttp = new XMLHttpRequest();
      const param = this.userId > 0 ? "?userId=" + this.userId : ""; 
      const serverUrl =process.env.PRODUCT + "oss/upload/policy/database-guide" +  param;   
      xmlhttp.open("GET", serverUrl, false);
      xmlhttp.setRequestHeader("Authorization", window.localStorage.token);
      xmlhttp.send();
      return xmlhttp.responseText;
    },
    getSignature() {
      const body = this.sendRequest();
      const obj = JSON.parse(body);
      this.host = obj.host;
      this.policyBase64 = obj.policy;
      this.accessid = obj.accessid;
      this.signature = obj.signature;
      this.expire = parseInt(obj.expire, 10);
      this.callbackbody = obj.callback;
      this.key = obj.dir;
      this.uniqueKey = obj.uniqueKey;
      return true;
    },
    calculateObjectName(filename) {
      if (this.g_object_name_type === "local_name") {
        this.g_object_name += `${filename}`;
      } else if (this.g_object_name_type === "random_name") {
        const suffix = this.getSuffix(filename);
        this.g_object_name = this.key + this.randomString(10) + suffix;
      }
      return "";
    },
    getUploadedObjectName(filename) {
      if (this.g_object_name_type === "local_name") {
        let tmpName = this.g_object_name;
        tmpName = tmpName.replace(`${filename}`, filename);
        return tmpName;
      } else if (this.g_object_name_type === "random_name") {
        return this.g_object_name;
      }
      return "";
    },
    randomString(len = 32) {
      const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      const maxPos = chars.length;
      let pwd = "";
      for (let i = 0; i < len; i += 1) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    getSuffix(filename) {
      const pos = filename.lastIndexOf(".");
      let suffix = "";
      if (pos !== -1) {
        suffix = filename.substring(pos);
      }
      return suffix;
    },
    setUploadParam(up, filename, ret) {
      this.getSignature();
      this.g_object_name = this.key;
      if (filename !== "") {
        this.calculateObjectName(filename);
      }
      const newMultipartParams = {
        key:
          this.g_object_name + this.uniqueKey + "." + filename.split(".").pop(),
        policy: this.policyBase64,
        OSSAccessKeyId: this.accessid,
        // 让服务端返回200,不然，默认会返回204
        success_action_status: "200",
        signature: this.signature,
        callback: this.callbackbody,
        uniqueKey: this.uniqueKey
      };
      up.setOption({
        url: "https://" + this.host,
        multipart_params: newMultipartParams
      });
      up.start();
    },
    deleteUploadFile(id) {
      this.uploader.removeFile(id);
      for (let i = 0; i < this.fileList.length; i++) {
        if (id === this.fileList[i].id) {
          this.fileList.splice(i, 1);
        }
      }
    },
    upload() {
      const that = this;
      const uploader = new plupload.Uploader({
        runtimes: "html5,flash,silverlight,html4",
        browse_button: "selectfiless",
        multi_selection: true,
        containers: "containers",
        flash_swf_url: "/static/plupload-2.3.6/js/Moxie.swf",
        silverlight_xap_url: "/static/plupload-2.3.6/js/Moxie.xap",
        max_retries: 3,
        filters: {
          mime_types: [
            {
              title: "允许上传文件类型",
              extensions: "jpg,gif,png,bmp,pdf"
            }
          ],
          // 最大只能上传10GB的文件
          max_file_size: "10gb",
          // 不允许队列中存在重复文件
          prevent_duplicates: true
        },
        init: {
          // PostInit: () => {
          //   document.getElementById('postfiles').onclick = () => {
          //     that.setUploadParam(uploader, '', false)
          //     return false
          //   }
          // },
          FilesAdded: (up, files) => {
            that.fileList = up.files;
            that.fileNum = up.files.length;  
          },
          BeforeUpload: (up, file) => {
            that.setUploadParam(up, file.name, true);
          },
          UploadProgress: (up, file) => {},
          FileUploaded: (up, file, info) => {
            const d = document.getElementById(file.id);
            if (info.status === 200) {
              d.setAttribute("class", "el-upload-list__item is-success");
              const params = {
                fileName: file.name,
                size: file.size,
                mimeType: file.type,
                uniqueKey: up.settings.multipart_params.uniqueKey,
                filePath: up.settings.multipart_params.key,
                objectKey: up.settings.multipart_params.key
              };
              that.files.push(params);  
              //这里
            } else {
              d.setAttribute("class", "el-upload-list__item is-warning");
            }
          },
          UploadComplete: up => {
            up.refresh(); 
            if(that.dis == 1){
                that.disableds1()  
            }else if(that.dis==2){
              that.addData1(); 
            }
          },
          Error: (up, err) => {
            console.log("上传失败：", err, that.onError, up);
            if (err.code === -600) {
              this.$message({
                message: "文件大小超出限制，限制大小为5GB",
                type: "error",
                customClass: "my-message"
              });
            } else if (err.status === 403) {
              this.$message({
                message: "页面失效，请刷新页面后重新上传文件!",
                type: "error",
                customClass: "my-message"
              });
            } else {
              this.$message({
                message: "上传失败，请刷新页面后重新上传文件！",
                type: "error",
                customClass: "my-message"
              });
            }
            if (that.onError) {
              that.onError(err.message, up, err);
            }
          }
        }
      });
      uploader.init();
      that.uploader = uploader;
    }
  },
  filters: {
    formatSize(fileSize) {
      return plupload.formatSize(fileSize);
    }
  },
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
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.path{
  cursor:pointer;
}
.active {
  color: goldenrod;
}
.edit-form {
  max-width: none;
}
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
.form-list {
  width: 100%;
  display: flex;
  height: 100px;
  line-height: 100px;
  background: #f3f3f3;
  li {
    width: 20%;
    text-align: center;
  }
}
.from-select {
  width: 100%;
  text-align: center;
  display: flex;
  justify-content: space-around;
}
.from-contents {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
}
.from-btns {
  width: 100%;
  text-align: center;
  .el-button {
    margin: 0 2%;
  }
}
.drug-container .header {
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
