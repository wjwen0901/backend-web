<!-- 参数说明
  index：图片索引值(为了区分同一页面多个文件上传的字段)  1多文件，0一个文件
  add_img：添加图片事件
  del_img：删除图片
  fileType：文件类型（1，图片；2，其他文件）
  css：图片上传时显示的样式
  uploadType：设置上传的域名"wechat-file|report|informed"
-->
<template>
  <div>
    <!-- 点击上传无按钮和提示 css=1 -->
    <div id="container" v-if='css==1'>
      <div class="upload-demo" id="selectfiles">
        <div tabindex="0" class="el-upload el-upload--text">
            <span  class="el-button el-button--default">上传</span>
            <input type="file" name="file" multiple="multiple" class="el-upload__input" id='uploadChange'>
        </div>
      </div>
    </div>
    <!-- 点击上传有按钮和提示 css=2 -->
    <div id="container" v-if='css==2'>
      <div class="upload-demo" id="selectfiles">
        <div tabindex="0" class="el-upload el-upload--text">
            <span  class="el-button el-button--default el-button--small">+</span>
            <input type="file" name="file" multiple="multiple" class="el-upload__input" id='uploadChange'>
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
      </div>
      <button id="postfiles">上传成功</button>
    </div>
    <!-- 可拖拽上传 -->
    <div v-if='css==3'>
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
    <!-- 缩略图上传 -->
    <div id="container" v-if='css==4'></div>
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
    }
  },
  props: {
    fileId: '',
    // beforeUpload: Function,  
    css:'',     //上传的css样式
    index:'',    //上传的多个文件还是一个文件
    uploadType:''  //上传的接口后缀名
  },
  beforeCreate () { },
  mounted () {
    this.$nextTick(() => {
      this.upload()
    })
  },
  methods: {
    // 向阿里云发送请求
    sendRequest () {
     const xmlhttp = new XMLHttpRequest()
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/policy/'+this.uploadType + '?userId=' + window.localStorage.userId
      xmlhttp.open('GET', serverUrl, false)
      xmlhttp.setRequestHeader('Authorization', window.localStorage.token)
      xmlhttp.send('userId=' + window.localStorage.userId)
      return xmlhttp.responseText
    },
    // 获取阿里云请求的返回值
    getSignature () {
      const body = this.sendRequest();
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
    // 设置32位的随机字符串
    randomString (len = 32) {
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      const maxPos = chars.length
      let pwd = ''
      for (let i = 0; i < len; i += 1) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return pwd
    },
    // 获取文件后缀
    getSuffix (filename) {
      const pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    },
    // 获取文件名字
    calculateObjectName (filename) {
      if (this.g_object_name_type === 'local_name') {
        this.g_object_name += `${filename}`
      } else if (this.g_object_name_type === 'random_name') {
        const suffix = this.getSuffix(filename)
        this.g_object_name = this.key + this.randomString(10) + suffix
      }
      return ''
    },
    // 获取上传完成的文件名字
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
    // 设置上传参数
    setUploadParam (up, filename, ret) {
      this.getSignature()
      // console.log(this)
      this.g_object_name = this.key
      if (filename !== '') {
        this.calculateObjectName(filename)
      }
      //上传时的附加参数
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
        url: 'https://' + this.host,//服务器端接收和处理上传文件的脚本地址
        multipart_params: newMultipartParams//上传时的附加参数
      })
      up.start()//开始上传队列中的文件
    },
    deleteUploadFile (id) {
      this.uploader.removeFile(id)
      for (let i = 0; i < this.fileList.length; i++) {
        if (id === this.fileList[i].id) {
          // console.log(id === this.fileList[i].id)
          this.fileList.splice(i, 1)
        }
      }
    },
    upload () {
      const that = this
      let multiSelection=true;
      if(this.index==1){multiSelection=true}else{multiSelection=false}
      const uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',//用来指定上传方式
        browse_button: 'selectfiles',//触发input[file]文件选择对话框的DOM元素
        multi_selection: multiSelection,//是否可以在文件浏览对话框中选择多个文件
        container: document.getElementById('container'),//用来指定Plupload所创建的html结构的父容器
        flash_swf_url: '../../static/plupload-2.3.6/js/Moxie.swf',//flash上传组件的url地址
        silverlight_xap_url: '../../static/plupload-2.3.6/js/Moxie.xap',//silverlight上传组件的url地址
        filters: {
          mime_types: [{//允许上传文件的类型
            title: '允许上传文件类型',
            extensions: 'jpg,gif,png,bmp,pdf'
          }],
          // 最大只能上传10GB的文件
          max_file_size: '10gb',//允许上传文件的大小
          // 不允许队列中存在重复文件
          prevent_duplicates: true //是否允许选取重复的文件
        },
        // 实例化Uploader对象完成触发init
        init: {
          // 当Init事件发生后触发监听函数参数
          PostInit: () => {
            this.ossFile = '';
            let postfiles=document.getElementById('postfiles');
            if(postfiles){
              // 触发上传按钮上传
              postfiles.onclick = () => {
                that.setUploadParam(uploader, '', false)
                return false;
              }
            };
          },
          // 当文件添加到上传队列后触发监听函数
          FilesAdded: (up, files) => {
            that.fileList = up.files;
            // 自动上传
            var uploadChange=document.getElementById('uploadChange');
            if(uploadChange){
                that.setUploadParam(uploader, '', false)
            }
          },
          // 当队列中的某一个文件正要开始上传前触发监听函数
          BeforeUpload: (up, file) => {
            that.setUploadParam(up, file.name, true)
          },
          // 会在文件上传过程中不断触发，可以用此事件来显示上传进度监听函数
          UploadProgress: (up, file) => {
          },
          // 当队列中的某一个文件上传完成后触发监听函数
          // FileUploaded: (up, file, info) => {
          //   const d = document.getElementById(file.id)
          //   if (info.status === 200) {
          //     d.setAttribute('class', 'el-upload-list__item is-success')
          //   } else {
          //     d.setAttribute('class', 'el-upload-list__item is-warning')
          //   }
          // },
          // 当队列中的某一个文件上传完成后触发监听函数
          FileUploaded: (up, file, info) => {
              if (info.status === 200) {
                // console.log('filePath',up.settings.multipart_params.key);
                this.$emit('key',up.settings.multipart_params.key);
              } 
          },
          UploadComplete: (up) => {
            this.$notify({
              message: '上传成功',
              type: 'success',
              customClass: 'my-message'
            })
          },
          // 当发生错误时触发监听函数
          Error: (up, err) => {
            // console.log('上传失败：', err, that.onError, up)
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
