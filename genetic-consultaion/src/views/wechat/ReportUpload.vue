<template>
  <el-container>
    <div class="mdh-mobile-form">
      <div class="title-info" v-if="hasUserInfo">
        欢迎您，{{readyName}}({{readyCellphone}})
        <el-button class="update-btn" type="text" @click="updateUserInfo">更正信息</el-button>
      </div>
      <div v-else>
        <p class="form-group-title">您的信息</p>
        <div class="mdh-input-row">
          <label>姓名</label>
          <input type="text" v-model="name" placeholder="请输入姓名">
          <span class="error-tip" v-if="nameError">姓名不可为空</span>
        </div>
        <div class="mdh-input-row">
          <label>电话</label>
          <input type="text" v-model="cellphone" placeholder="请输入手机号">
          <span class="error-tip" v-if="cellphoneError">手机号不可为空</span>
        </div>
      </div>
      <p class="form-group-title">选择文件</p>
      <div class="upload-row">
        <div tabindex="0" class="el-upload el-upload--picture-card" id="selectfiles">
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
        <div id="container"></div>
      </div>
      <div class="btn-row">
        <el-button type="primary" @click="toUpload">开始上传</el-button>
      </div>
    </div>
  </el-container>
</template>

<script>
import plupload from 'plupload'
export default {
  name: 'report-upload',
  data () {
    return {
      userId: 0,
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

      hasUserInfo: false
    }
  },
  props: {
    fileId: '',
    beforeUpload: Function,
    onSuccess: Function,
    onError: Function,
    onProgress: Function
  },
  beforeCreate () {
  },
  mounted () {
    this.$nextTick(() => {
      this.upload()
    })
  },
  methods: {
    updateUserInfo () {
      this.hasUserInfo = false
    },
    toUpload () {
      if (this.name.trim() === '') {
        this.nameError = true
        return false
      }
      if (this.cellphone.trim() === '') {
        this.cellphoneError = true
        return false
      }
      if (this.fileNum === 0) {
        this.fileError = true
        return false
      }
      this.setUploadParam(this.uploader, '', false)
    },
    // 上传方法 ---待抽提成组件
    sendRequest () {
      const xmlhttp = new XMLHttpRequest()
      const param = this.userId > 0 ? ('&userId=' + this.userId) : ''
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/policy/report' +
        '?name=' + this.name + '&cellphone=' + this.cellphone + param
      xmlhttp.open('GET', serverUrl, false)
      xmlhttp.setRequestHeader('Authorization', window.localStorage.token)
      xmlhttp.send()
      return xmlhttp.responseText
    },
    getSignature () {
      const body = this.sendRequest()
      const obj = JSON.parse(body)
      if (obj.status === 'userError' || obj.status === 'registerError') {
        this.$notify.error({
          title: '错误',
          message: '用户未注册,请微信联系我们注册'
        })
        return false
      }
      this.host = obj.host
      this.policyBase64 = obj.policy
      this.accessid = obj.accessid
      this.signature = obj.signature
      this.expire = parseInt(obj.expire, 10)
      this.callbackbody = obj.callback
      this.key = obj.dir
      this.uniqueKey = obj.uniqueKey
      return true
    },
    randomString (len = 32) {
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const maxPos = chars.length
      let pwd = ''
      for (let i = 0; i < len; i += 1) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    getSuffix (filename) {
      const pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    },
    calculateObjectName (filename) {
      if (this.g_object_name_type === 'local_name') {
        this.g_object_name += `${filename}`
      } else if (this.g_object_name_type === 'random_name') {
        const suffix = this.getSuffix(filename)
        this.g_object_name = this.key + this.randomString(10) + suffix
      }
      return ''
    },
    getUploadedObjectName (filename) {
      if (this.g_object_name_type === 'local_name') {
        let tmpName = this.g_object_name
        tmpName = tmpName.replace(`${filename}`, filename)
        return tmpName
      } else if (this.g_object_name_type === 'random_name') {
        return this.g_object_name
      }
      return ''
    },
    setUploadParam (up, filename, ret) {
      this.getSignature()
      this.g_object_name = this.key
      if (filename !== '') {
        this.calculateObjectName(filename)
      }
      const newMultipartParams = {
        key: this.g_object_name + this.uniqueKey + '.' + filename.split('.').pop(),
        policy: this.policyBase64,
        OSSAccessKeyId: this.accessid,
        // 让服务端返回200,不然，默认会返回204
        success_action_status: '200',
        signature: this.signature,
        callback: this.callbackbody,
        uniqueKey: this.uniqueKey
      }
      up.setOption({
        url: 'https://' + this.host,
        multipart_params: newMultipartParams
      })
      up.start()
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
      const that = this
      const uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: 'selectfiles',
        multi_selection: true,
        container: 'container',
        flash_swf_url: '../../static/plupload-2.3.6/js/Moxie.swf',
        silverlight_xap_url: '../../static/plupload-2.3.6/js/Moxie.xap',
        max_retries: 3,
        filters: {
          // mime_types: [{
          //   title: '允许上传文件类型',
          //   extensions: 'jpg,gif,png,bmp,pdf,doc,docx'
          // }],
          // 最大只能上传10GB的文件
          max_file_size: '10gb',
          // 不允许队列中存在重复文件
          prevent_duplicates: true
        },
        init: {
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
                name: this.name,
                cellphone: this.cellphone,
                fileName: file.name,
                size: file.size,
                mimeType: file.type,
                uniqueKey: up.settings.multipart_params.uniqueKey,
                filePath: up.settings.multipart_params.key,
                objectKey: up.settings.multipart_params.key
              }
              if (this.userId > 0) {
                param.userId = this.userId
              }
              if (this.$route.query.openid !== undefined) {
                param.openId = this.$route.query.openid
              }
              this.axios.post('report/upload', param).then(res => {
                this.$message({
                  message: '上传成功',
                  type: 'success',
                  center: true,
                  customClass: 'my-message'
                })
              }).catch(err => {
                this.$message({
                  message: err.data.message,
                  type: 'error',
                  customClass: 'my-message'
                })
                console.log(err)
              })
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
    initData () {
      if (this.$route.query.openid !== undefined) {
        this.axios.get('user/openid', {
          params: {
            openId: this.$route.query.openid
          }
        }).then(res => {
          this.userId = res.data.id
          this.readyName = res.data.fullName
          this.readyCellphone = res.data.cellphone
          this.name = res.data.fullName
          this.cellphone = res.data.cellphone
          if (this.readyName !== undefined && this.readyCellphone !== undefined) {
            this.hasUserInfo = true
            console.log(this.hasUserInfo)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  created () {
    this.initData()
  },
  filters: {
    formatSize (fileSize) {
      return plupload.formatSize(fileSize)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .el-container {
    background: #f2f2f2;
  }
  .upload-main {
    background: #f2f2f2;
    overflow: hidden;
  }
  .el-header {
    margin-top: 20px;
    text-align: left;
    height: 40px !important;
  }
  .float-l {
    float: left;
  }
  .upload-content {
    position: relative;
    float: left;
  }
  .upload-btn {
    width: 150px;
  }
  .mdh-mobile-form {
    width: 100%;
    margin: 0;
    padding: 0;
    .form-group-title {
      padding-left: 20px;
      font-size: 12px;
      color: #333333;
    }
  }
  .mdh-input-row {
    position: relative;
    width: 100%;
    background: #fff;
    height: 40px;
    padding: 0;
    label {
      position: absolute;
      left: 0;
      top: 0;
      width: 80px;
      padding-left: 20px;
      line-height: 40px;
      font-size: 14px;
    }
    input {
      height: 40px;
      width: calc(100%);
      padding: 0px 0px 0px 80px;
      border: 0;
      line-height: 40px;
    }
    .next-step {
      position: absolute;
      right: 0;
      top: 0;
      display: inline-block;
      padding: 0px 10px;
      line-height: 40px;
      color: #333333;
    }
    &:after {
      position: absolute;
      right: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      content: '';
      /*border-bottom: 1px solid #c8c7cc;*/
      -webkit-transform: scaleY(.5);
      transform: scaleY(.5);
      background-color: #c8c7cc;
    }
  }
  .upload-row {
    position: relative;
    padding: 0px 20px;
  }
  .btn-row {
    padding: 20px 20px;
    .el-button {
      width: 100%;
    }
  }
  input::-webkit-input-placeholder{
    color:#c0c0c0;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color:#c0c0c0;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color:#c0c0c0;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color:#c0c0c0;
  }
  input:focus {
    outline:none;
    border: 0;
  }
  .error-tip {
    color: #F56C6C;
    position: absolute;
    right: 30px;
    top: 0;
    font-size: 10px;
    line-height: 40px;
  }

  .title-info {
    padding: 5px 20px;
    font-size: 14px;
  }
  .update-btn {
    margin-left: 10px;
    font-size: 12px;
  }
  .my-message {
    width: 80%;
    min-width: auto;
    background-color: rgba(0, 0, 0, .6);
    border-color: rgba(0, 0, 0, .6);
  }
</style>
