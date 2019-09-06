<template>
  <el-container>
    <el-header>上传报告</el-header>
    <el-main class="upload-main">
      <el-form :rules="rules" :model="report" ref="report" label-width="120px" label-position="left" size="mini">
        <el-form-item label="订单编号" v-if="order.id !== undefined">
          {{order.tid}}
        </el-form-item>
        <!--<el-form-item label="检测项目" v-if="order.id !== undefined">-->
          <!--{{order.itemTitle}}-->
        <!--</el-form-item>-->
        <el-form-item label="选择客户公司" v-if="role === 'firm-service' || role === 'manager' || role === 'jk-service'">
          <el-select class="width-100-p"
                     v-model="report.companyId"
                     filterable
                     remote
                     reserve-keyword
                     allow-create
                     default-first-option
                     placeholder="请输入关键词"
                     :remote-method="getCompanyList"
                     :loading="companySelLoading">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择检测产品">
          <el-select class="width-100-p" v-model="report.solutionId" filterable placeholder="请选择">
            <el-option
              v-for="item in projects"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="选择客户" v-if="userId == 1">-->
          <!--<el-input v-model="report.fullName"></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="选择文件" prop="fileNum">
          <div>
            <div>
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
            <div class="el-upload__tip">请以“样本唯一编码”命名文件</div>
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
        </el-form-item>
        <el-form-item>
          <el-button class="float-l" type="primary" @click="submitForm">上传</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script>
import plupload from 'plupload'
export default {
  name: 'report-upload',
  data () {
    var checkFileNum = (rule, value, callback) => {
      if (this.fileNum === 0) {
        callback(new Error('请选择文件'))
      } else {
        callback()
      }
    }
    return {
      sec: window.localStorage.sec === undefined ? 'upload,upload:informed,upload:report,upload:medical-records,informed:list,report:list' : window.localStorage.sec,
      role: window.localStorage.role,
      report: {
        fullName: window.localStorage.fullName === undefined ? '' : window.localStorage.fullName,
        cellphone: window.localStorage.cellphone === undefined ? '' : window.localStorage.cellphone,
        companyId: window.localStorage.companyId === undefined ? '' : window.localStorage.companyId
      },
      rules: {
        fileNum: [
          {required: true, validator: checkFileNum, trigger: 'blur'}
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      companySelLoading: false,
      userSelLoading: false,
      uploadAction: this.axios.defaults.baseURL + '/report/upload',
      uploadHeader: {'Authorization': window.localStorage.token},
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
      companyList: [],
      userList: [],
      userId: window.localStorage.userId,
      order: {},
      projects: []
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
    initData () {
      this.getCompanyList()
      if (this.$route.query.orderId !== undefined) {
        this.getOrder()
      }
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getOrder () {
      this.axios.get('order/' + this.$route.query.orderId).then(res => {
        this.order = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getCompanyList () {
      this.axios.get('company/CustCompany', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
        console.log(err)
      })
    },
    submitForm () {
      this.$refs.report.validate((valid) => {
        if (valid) {
          this.$nextTick(() => {
            this.setUploadParam(this.uploader, '', false)
            // this.$refs.upload.submit()
            // this.$refs.upload.submit()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 上传方法 ---待抽提成组件
    sendRequest () {
      const xmlhttp = new XMLHttpRequest()
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/policy/report' + '?userId=' + window.localStorage.userId
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
          mime_types: [{
            title: '允许上传文件类型',
            extensions: 'jpg,jpeg,gif,png,bmp,pdf,doc,docx,xls,xlsx,csv'
          }],
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
              console.log(up)
              console.log(file.mime_types)
              const param = {
                userId: window.localStorage.userId,
                name: this.report.fullName,
                cellphone: this.report.cellphone,
                fileName: file.name,
                size: file.size,
                mimeType: file.type,
                uniqueKey: up.settings.multipart_params.uniqueKey,
                filePath: up.settings.multipart_params.key,
                objectKey: up.settings.multipart_params.key,
                companyId: this.report.companyId,
                orderId: this.$route.query.orderId,
                solutionId: this.report.solutionId
              }
              this.axios.post('report/upload', param).then(res => {
                this.$message({
                  message: '上传成功',
                  type: 'success'
                })
              }).catch(err => {
                this.$message.error(err.data.message)
                console.log(err)
              })
            } else {
              d.setAttribute('class', 'el-upload-list__item is-warning')
            }
          },
          UploadComplete: (up) => {
            this.$notify({
              message: '上传成功',
              type: 'success',
              customClass: 'my-message'
            })
            if (this.sec.includes('data-collect:informed')) {
              this.$router.push('/report/list')
            } else {
              this.$router.push('/report/info/list')
            }

          },
          Error: (up, err) => {
            console.log('上传失败：', err, that.onError, up)
            if (err.code === -600) {
              this.$message.error('文件大小超出限制，限制大小为5GB')
            } else if (err.status === 403) {
              this.$message.error('页面失效，请刷新页面后重新上传文件!')
            } else {
              this.$message.error('上传失败，请刷新页面后重新上传文件！')
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
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this.initData()
    loading.close()
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
    background: #fff;
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
</style>
