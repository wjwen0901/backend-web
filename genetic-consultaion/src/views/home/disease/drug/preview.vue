<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/drug' }">指南管理</el-breadcrumb-item>
          <el-breadcrumb-item>预览</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="drug-container">
          <el-form ref="solutionForm"  label-width="100px" size="mini" class="edit-form clearfix">
            <div class="form-left">
              <el-form-item label="中文标题*">
                <span>{{sessionData.title}}</span>
              </el-form-item>
              <el-form-item label="制定者*"> 
                <span v-for="(item,index) in sessionData.framers" :key="index">{{item}}</span>
              </el-form-item>
              <el-form-item label="发布日期*"> 
                <span v-for="(item,index) in sessionData.publishDate" :key="index">{{item}}</span>                
              </el-form-item> 
              <el-form-item label="检测产品" > 
                <span v-for="(item,index) in sessionData.productIds" :key="index">{{item.name}}</span>
              </el-form-item>
            </div>
            <div class="form-right">
              <el-form-item label="英文标题*" > 
                <span v-for="(item,index) in sessionData.titleEn" :key="index">{{item}}</span>                                
              </el-form-item>
              <el-form-item label="出处*"> 
                <span v-for="(item,index) in sessionData.provenance" :key="index">{{item}}</span>         
              </el-form-item> 
              <el-form-item label="相关疾病"> 
                <span v-for="(item,index) in sessionData.diseaseIds" :key="index">{{item.name}}</span>
              </el-form-item>
              <el-form-item label="相关基因"> 
                <span v-for="(item,index) in sessionData.geneId" :key="index">{{item.name}}</span>
              </el-form-item>
            </div>
            <div class="form-line">
              <ul class="form-list" >
                <li v-for="(item,index) in list" :key="index" @click="cur=index" :class="{active:cur==index}">
                 {{item.id}}.{{item.name}}
                </li> 
              </ul>
              <div class="from-contents" v-show="cur==0"> 
                <span v-for="(item,index) in sessionData.guideFileAttrs" :key="index">{{item.file_source}}</span>
              </div>
              <div class="from-contents" v-show="cur==1"> 
                <span v-html="sessionData.other"></span>
              </div> 
           <el-form-item class="from-btns">
                <el-button type="primary" @click="addData" :disabled = "openIsDisabled">发布</el-button>  
                <el-button @click="cancel" :disabled = " openIsDisabled ">取消</el-button> 
            </el-form-item>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
    <div tabindex="0" class="el-upload el-upload--picture-card" id="selectfiless" style="display:none;">
        <i class="el-icon-plus"></i>
        <input type="file" name="file" multiple="multiple"  class="el-upload__input">
    </div>
  </div>
</template>
<script>
import plupload from "plupload";
import qs from "qs";
export default {
  name: 'DiseaseEdit',
  data () {
    return {
      data: [],
      addRowData: ['add'],  
      cur: 0,
      list:[{name:'指南',id:1},{name:'其他',id:2}],  
      loadings: false,
      states: [],
      sessionData:{},
      productId:'',
      productName:[],
      userId: window.localStorage.userId,
      accesskey: "",
      host: "",
      policyBase64: "",
      signature: "",
      fileNum:'',
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
      files:[],
      dis:0
    }
  }, 
  methods: { 
    cancel(){
      this.$router.go(-1)
    }, 
      sendRequest() {
      const xmlhttp = new XMLHttpRequest();
      const param = this.userId > 0 ? "?userId=" + this.userId : "";
      const serverUrl =
        "https://test.mdhcare.com/mdhcare-backend/oss/upload/policy/database-guide" + param; 
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
      console.log("osss---------------") 
      console.log("https://" + this.host) 
      up.setOption({
        url: "https://" + this.host,
        multipart_params: newMultipartParams
      });
      console.log(up) 
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
            console.log(files);
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
              that.addData1();  
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
    },
    addData1(){ 
      var diseaseIds = this.sessionData.diseaseIds.map(item=>{
        return item.id
      })
      var geneIds = this.sessionData.geneId.map(item=>{
        return item.id
      })
      var productIds = this.sessionData.productIds.map(item=>{
        return item.id 
      })
      if (this.$route.query.id == undefined) {   
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
              other:_this.sessionData.other,
              title:_this.sessionData.title,
              titleEn:_this.sessionData.titleEn,
              framers:_this.sessionData.framers,
              provenance:_this.sessionData.provenance,
              publishDate:_this.sessionData.publishDate,
              diseaseIds,
              geneIds
            },
            productIds,
            guideFileAttrs:_this.files 
            }
          })
            .then(res => {
              this.temid = res.data.id;
              window.localStorage.removeItem("params") 
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
              url: "guideManage/editGuide",
              method: "put",
              headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
              },
              params: {
                temId: _this.temid
              },
              data: {
                guide: {
                  id:_this.$route.query.id,
                  other:_this.sessionData.other,
                  title:_this.sessionData.title,
                  titleEn:_this.sessionData.titleEn,
                  framers:_this.sessionData.framers,
                  provenance:_this.sessionData.provenance,
                  publishDate:_this.sessionData.publishDate,
                  diseaseIds,
                  geneIds
                  },
                  productIds,
                  guideFileAttrs:_this.files 
              }
            })
              .then(res => {
                window.localStorage.removeItem("params") 
                _this.$message({
                  message: "发布成功",
                  type: "success"
                });
              })
              .catch(err => {
                _this.$message(JSON.parse(err.request.response).msg);
              });
          } else if (this.state == 1) {
            if (this.guideId == "") {
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
                  temId: _this.$route.query.id
                },
                data: {
                  guide: {
                    id:_ths.route.query.id,
                    other:_this.sessionData.other,
                    title:_this.sessionData.title,
                    titleEn:_this.sessionData.titleEn,
                    framers:_this.sessionData.framers,
                    provenance:_this.sessionData.provenance,
                    publishDate:_this.sessionData.publishDate,
                    diseaseIds,
                    geneIds
                  },
                  productIds,
                  guideFileAttrs:_this.files 
                }
              })
                .then(res => {
                  window.localStorage.removeItem("params")
                  this.$message({
                    type:'success',
                    message:'发布成功'
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
                  temId: _this.geneIds
                },
                data: {
                  guide: {
                    id: _this.$route.query.id,
                    other:_this.sessionData.other,
                    title:_this.sessionData.title,
                    titleEn:_this.sessionData.titleEn,
                    framers:_this.sessionData.framers,
                    provenance:_this.sessionData.provenance,
                    publishDate:_this.sessionData.publishDate,
                    diseaseIds,
                    geneIds
                  },
                  productIds,
                  guideFileAttrs:_this.files 
                }
              })
                .then(res => {
                  this.$message({
                    type:'success',
                    message:'发布成功'
                  });
                  window.localStorage.removeItem("params")
                })
                .catch(err => {
                  _this.$message(JSON.parse(err.request.response).msg);
                });
            }
          } 
      }
    }, 
    addData(){  
      // this.uploader.files = this.sessionData.guideFileList;  
      this.sessionData.guideFileList.forEach((item, index) => {
        console.log(typeOf(item))
        console.log("file " + index)
        console.log(item)
        this.uploader.addFile(item)
      })
      if(this.sessionData.guideFileList.length ==0){
        this.addData1()
      }else{
        console.log(1)
        this.setUploadParam(this.uploader,"", false);  
      }
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
  filters: {
    formatSize(fileSize) {
      return plupload.formatSize(fileSize);
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
    //上传
    this.$nextTick(() => {
      this.upload();
    });
  },
  mounted () { 
    this.sessionData = JSON.parse(window.sessionStorage.getItem("drug"));
    this.state = this.$route.query.state;
    this.guideId = this.sessionData.guideId; 
    console.log(this.state)
    console.log(this.sessionData.title)
    
  }, 
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.active{
  color:goldenrod;
}
.edit-form{
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
    display: flex; 
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
