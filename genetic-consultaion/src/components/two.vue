<template> 
      <div class="ap-upload">
        <div class="u-select">
        <p class="form-group-title">选择文件</p>
            <div class="upload-row">
            <div tabindex="0" class="el-upload el-upload--picture-card" id="selectfilesa">
                <i class="el-icon-plus"></i>
                <input type="file" name="file" multiple="multiple" class="el-upload__input">
            </div>
            <div class="el-upload__tip">只能上传jpg/gif/png/bmp/pdf文件，且不超过5G</div>
            <span class="error-tip" v-if="fileError">请选择文件</span>
            <ul class="el-upload-list el-upload-list--text" id="ossfile">
                <li tabindex="0" class="el-upload-list__item is-ready" :id="file.id" v-for="file in fileList" v-bind:key="file.id" ref="file.id">
                <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}} ({{file.size | formatSize}})</a>
                <label class="el-upload-list__item-status-label">
                    <i class="el-icon-upload-success el-icon-circle-check"></i>
                </label>
                <i class="el-icon-close" @click="deleteUploadFile(file.id)"></i>
                <i class="el-icon-close-tip">按 delete 键可删除</i>
                <el-progress :percentage="file.percent" v-if="file.percent !== 100"></el-progress>
                </li>
            </ul>
            <div id="containera"></div>
            </div>
            </div>
        </div>
</template>

<script>
import plupload from 'plupload'
import qs from 'qs'
export default {
    data(){
        return{
      userId: window.localStorage.userId,
      report: {
        fullName: window.localStorage.fullName === undefined ? '' : window.localStorage.fullName,
        cellphone: window.localStorage.cellphone === undefined ? '' : window.localStorage.cellphone,
        companyId: window.localStorage.companyId === undefined ? '' : window.localStorage.companyId
      },
      readyName: '',
      readyCellphone: '',
      name: '',
      cellphone: '',
      nameError: false,
      cellphoneError: false,
      fileError: false,
      fileNum: 0,
      accessid: '',
      accesskey: '',
      host: '',
      policyBase64: '',
      signature: '',
      callbackbody: '',
      filename: '',
      key: '',
      expire: 0,
      g_object_name: '',
      g_object_name_type: '',
      now: Date.parse(new Date()) / 1000,
      uniqueKey: '',
      fileList: [],
      uploader: {},
      hasUserInfo: false,
      projects:[],
      companyList:[], 
    
        }
    },
    mounted () {
    this.$nextTick(() => {
      this.upload()
    })
  },
  created(){
      this.initData()
  },
  methods: {
      initData () { 
        this.$axios({
        url:'https://qa.mdhcare.cn/mdhcare-backend/solution',
        params: {
          userId: this.userId
        }
      }).then(res => {
        this.projects = res.data; 
      }).catch(err => {
        console.log(err)
      })
      
       this.$axios({
        url:'https://qa.mdhcare.cn/mdhcare-backend/company/CustCompany',
        params: {
          userId: this.userId
        }
      }).then(res => {
        this.companyList = res.data; 
      }).catch(err => {
        console.log(err)
      })
    },
    toUpload () { 
        this.setUploadParam(this.uploader, '', false)
    },
    sendRequest() {
      const xmlhttp = new XMLHttpRequest();
      const param = this.userId > 0 ? "?userId=" + this.userId : ""; 
      const serverUrl ="https://qa.mdhcare.cn/mdhcare-backend/oss/upload/policy/literature"+param; 
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
        key:this.g_object_name + this.uniqueKey + "." + filename.split(".").pop(),
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
    deleteUploadFile (id) {
      this.uploader.removeFile(id)
      for (let i = 0; i < this.fileList.length; i++) {
        if (id === this.fileList[i].id) {
          console.log(id === this.fileList[i].id)
          this.fileList.splice(i, 1)
        }
      }
    },
     upload () {
      const that = this;
      const uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'selectfilesa',
        multi_selection: true,
        containera: 'containera',
        flash_swf_url: '/static/Moxie.swf',
        silverlight_xap_url: '/static/Moxie.xap',
        max_retries: 3,
        filters: {
          // mime_types: [{
          // title: '允许上传文件类型',
          // extensions: 'jpg,gif,png,bmp,pdf'
          // }],
          // 最大只能上传10GB的文件
          max_file_size: '10gb',
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
            that.fileList = up.files
            that.fileNum = up.files.length
          },
          BeforeUpload: (up, file) => {
            that.setUploadParam(up, file.name, true)
          },
          UploadProgress: (up, file) => {
          },
          FileUploaded: (up, file, info) => {
            const d = document.getElementById(file.id)
            if (info.status === 200) {
              d.setAttribute('class', 'el-upload-list__item is-success') 
              const param = {
                userId: this.userId, 
                fileName: file.name,
                name: this.report.fullName,
                cellphone: this.report.cellphone,
                size: file.size,
                mimeType: file.type,
                uniqueKey: up.settings.multipart_params.uniqueKey,
                filePath: up.settings.multipart_params.key,
                objectKey: up.settings.multipart_params.key,
                companyId: this.report.companyId,
                solutionId: this.report.solutionId
              }
               this.$emit('two',param)
               var arr=[]
               arr.push(param)
               console.log(arr)
            
            } else {
              d.setAttribute('class', 'el-upload-list__item is-warning')
            }
          },
          UploadComplete: (up) => {
            up.refresh()
          },
          Error: (up, err) => {
            console.log('上传失败：', err, that.onError, up)
            if (err.code === -600) {
              this.$message({
                message: '文件大小超出限制，限制大小为5GB',
                type: 'error',
                customClass: 'my-message'
              })
            } else if (err.status === 403) {
              this.$message({
                message: '页面失效，请刷新页面后重新上传文件!',
                type: 'error',
                customClass: 'my-message'
              })
            } else {
              this.$message({
                message: '上传失败，请刷新页面后重新上传文件！',
                type: 'error',
                customClass: 'my-message'
              })
            }
            if (that.onError) {
              that.onError(err.message, up, err)
            }
          }
        }
      })
      uploader.init()
      that.uploader = uploader
    },
  },
  filters: {
    formatSize (fileSize) {
      return plupload.formatSize(fileSize)
    } 
}
}
</script>

<style>

</style>
