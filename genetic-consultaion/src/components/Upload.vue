<template>
  <div>
    <div id="container">
      <div tabindex="0" class="el-upload el-upload--text" id="selectfiles">
        <div class="el-upload-dragger">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
        </div>
        <input type="file" name="file" multiple="multiple" class="el-upload__input">
      </div>
    </div>
    <div class="el-upload__tip">只能上传jpg/gif/png/bmp/pdf文件，且不超过5G</div>
    <ul class="el-upload-list el-upload-list--text" id="ossfile">
      <li tabindex="0" class="el-upload-list__item is-ready" :id="file.id" v-for="file in fileList" v-bind:key="file.id" ref="file.id">
        <a class="el-upload-list__item-name"><i class="el-icon-document"></i>{{file.name}} ({{file.size | formatSize}})</a>
        <label class="el-upload-list__item-status-label">
          <i class="el-icon-upload-success el-icon-circle-check"></i>
          </label>
        <i class="el-icon-close" @click="deleteUploadFile(file.id)"></i>
        <i class="el-icon-close-tip">按 delete 键可删除</i>
        <el-progress :percentage="file.percent"></el-progress>
      </li>
    </ul>
    <br/>
    <a id="postfiles" href="javascript:void(0);" class='btn'>开始上传</a>
    <pre id="console">{{message}}</pre>
    <p>&nbsp;</p>
  </div>
</template>

<script>
import plupload from 'plupload'
export default {
  name: 'upload',
  data () {
    return {
      ossFile: '',
      uploadMethod: '',
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
      message: '',
      uniqueKey: '',
      fileList: [],
      uploader: {},
      uploadType: 'informed'
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
    sendRequest () {
      const xmlhttp = new XMLHttpRequest()
      // 你的服务端接口地址:  参考demo:http://oss-demo.aliyuncs.com/oss-h5-upload-js-php/
      // 服务端签名后直传文档:  https://help.aliyun.com/document_detail/31926.html
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/postPolicy/' + this.uploadType + '?userId=' + window.localStorage.userId
      xmlhttp.open('GET', serverUrl, false)
      xmlhttp.setRequestHeader('Authorization', window.localStorage.token)
      xmlhttp.send('userId=' + window.localStorage.userId)
      return xmlhttp.responseText
    },
    getSignature () {
      const body = this.sendRequest()
      const obj = JSON.parse(body)
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
        callback: this.callbackbody
      }
      up.setOption({
        url: 'https://' + this.host,
        multipart_params: newMultipartParams
      })
      up.start()
    },
    deleteUploadFile (id) {
      console.log(this.fileList)
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
        container: document.getElementById('container'),
        flash_swf_url: '../../static/plupload-2.3.6/js/Moxie.swf',
        silverlight_xap_url: '../../static/plupload-2.3.6/js/Moxie.xap',
        filters: {
          mime_types: [{
            title: '允许上传文件类型',
            extensions: 'jpg,gif,png,bmp,pdf'
          }],
          // 最大只能上传10GB的文件
          max_file_size: '10gb',
          // 不允许队列中存在重复文件
          prevent_duplicates: true
        },
        init: {
          PostInit: () => {
            this.ossFile = ''
            document.getElementById('postfiles').onclick = () => {
              that.setUploadParam(uploader, '', false)
              return false
            }
          },
          FilesAdded: (up, files) => {
            that.fileList = up.files
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
            } else {
              d.setAttribute('class', 'el-upload-list__item is-warning')
            }
          },
          Error: (up, err) => {
            console.log('上传失败：', err, that.onError, up)
            if (err.code === -600) {
              that.message = '文件大小超出限制，限制大小为5GB'
            } else if (err.status === 403) {
              that.message = '页面失效，请刷新页面后重新上传文件!'
            } else {
              that.message = '上传失败，请刷新页面后重新上传文件！'
            }
            if (that.onError) {
              that.onError(err.message, up, err)
            }
          }
        }
      })
      uploader.init()
      that.uploader = uploader
    }
  },
  filters: {
    formatSize (fileSize) {
      return plupload.formatSize(fileSize)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .btn {
    color: #fff;
    background-color: #54b9f9;
    border-color: #54b9f9;
    display: inline-block;
    padding: 6px 12px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    text-decoration: none;
    vertical-align: middle;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    /*border: 1px solid transparent;*/
    border-radius: 4px;
  }

  a.btn:hover {
    background-color: #29e0f9;
  }

  .progress {
    margin-top: 2px;
    width: 200px;
    height: 14px;
    margin-left: 10px;
    display: inline-block;
    margin-bottom: 0;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
  }

  .progress-bar {
    background-color: rgb(84, 185, 249);
    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.14902) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.14902) 50%, rgba(255, 255, 255, 0.14902) 75%, transparent 75%, transparent);
    background-size: 40px 40px;
    box-shadow: rgba(0, 0, 0, 0.14902) 0 -1px 0 0 inset;
    box-sizing: border-box;
    color: rgb(255, 255, 255);
    display: block;
    float: none;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    transition-delay: 0s;
    transition-duration: 0.6s;
    transition-property: width;
    transition-timing-function: ease;
    width: 266px;
  }
</style>
