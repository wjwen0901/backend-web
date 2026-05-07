<template>
  <div class="pc-page pc-informed-upload">
    <div class="pc-page-title">
      <h2>上传知情同意</h2>
      <span class="desc">指定送检医院 / 科室 / 医生，上传知情同意 PDF 或图片</span>
    </div>

    <div class="upload-grid">
      <div class="upload-main-col">
        <div class="pc-card" v-if="order.id !== undefined">
          <div class="card-title">订单 &amp; 项目</div>
          <el-form :model="order" label-width="120px" label-position="left" size="small">
            <el-form-item label="订单编号">
              <span class="mono">{{ order.tid }}</span>
            </el-form-item>
            <el-form-item label="检测项目">
              {{ order.itemTitle }}
            </el-form-item>
          </el-form>
        </div>

        <div class="pc-card">
          <div class="card-title">送检信息</div>
          <el-form
            ref="informedConsent"
            :rules="rules"
            :model="informedConsent"
            label-width="120px"
            label-position="left"
            size="small">
            <el-form-item label="送检医院" prop="hospital">
              <el-select
                class="full-w"
                v-model="informedConsent.hospital"
                filterable
                remote
                reserve-keyword
                allow-create
                default-first-option
                placeholder="请输入关键词"
                :remote-method="getHospitalList"
                :loading="hospitalSelLoading">
                <el-option v-for="item in hospitalList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送检科室" prop="dept">
              <el-select
                class="full-w"
                v-model="informedConsent.dept"
                filterable
                remote
                reserve-keyword
                allow-create
                default-first-option
                placeholder="请输入关键词"
                :remote-method="getDeptList"
                :loading="deptSelLoading">
                <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="送检医生" prop="doctor">
              <el-input class="full-w" v-model="informedConsent.doctor" placeholder="例如 王大夫"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div class="pc-card">
          <div class="card-title">知情同意文件</div>
          <el-form :rules="fileRules" :model="fileForm" ref="fileForm" size="small">
            <el-form-item prop="fileNum">
              <div tabindex="0" class="pc-dragger" id="selectfiles">
                <i class="el-icon-upload ic"></i>
                <div class="dragger-main">将文件拖到此处，或<em>点击上传</em></div>
                <div class="dragger-sub">支持 jpg / png / bmp / pdf / doc · 单文件 ≤ 10GB</div>
                <input type="file" name="file" multiple="multiple" class="el-upload__input">
              </div>
              <ul class="file-list" id="ossfile">
                <li
                  class="file-item is-ready"
                  :id="file.id"
                  v-for="file in fileList"
                  :key="file.id"
                  :ref="file.id">
                  <i class="el-icon-document file-ic"></i>
                  <span class="file-name">{{ file.name }} <span class="file-size">({{ file.size | formatSize }})</span></span>
                  <el-progress v-if="file.percent !== 100" :percentage="file.percent" :stroke-width="6" class="file-progress"></el-progress>
                  <el-tag v-else class="el-tag--succ">完成</el-tag>
                  <i class="el-icon-close file-close" @click="deleteUploadFile(file.id)"></i>
                </li>
              </ul>
              <div id="container"></div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-upload2" @click="submitForm">提交知情同意</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="upload-side-col">
        <div class="pc-card">
          <div class="card-title">上传流程</div>
          <div class="pc-steps">
            <div class="pc-step" :class="stepCls(1)">
              <div>
                <div class="t">1. 准备订单</div>
                <div class="d">从订单列表跳入会自动带入 orderId</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(2)">
              <div>
                <div class="t">2. 填写送检信息</div>
                <div class="d">医院 / 科室 / 医生 三项必填</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(3)">
              <div>
                <div class="t">3. 上传文件</div>
                <div class="d">支持 jpg / png / bmp / pdf / doc</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(4)">
              <div>
                <div class="t">4. 自动入库</div>
                <div class="d">上传完成后系统自动关联订单</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pc-card">
          <div class="card-title">提示</div>
          <ul class="hints">
            <li>已配置过的医院 / 科室 / 医生会被记住</li>
            <li>失败时刷新页面再试 OSS 签名会自动续期</li>
            <li>大文件请勿关闭页面，进度条会显示百分比</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import plupload from 'plupload'

export default {
  name: 'InformedUpload',
  data () {
    const checkFileNum = (rule, value, callback) => {
      if (this.fileNum === 0) callback(new Error('请选择文件'))
      else callback()
    }
    return {
      sec: window.localStorage.sec === undefined
        ? 'upload,upload:informed,upload:report,upload:medical-records,informed:list,report:list'
        : window.localStorage.sec,
      informedConsent: {
        hospital: window.localStorage.hospital !== undefined ? parseInt(window.localStorage.hospital) : '',
        dept: window.localStorage.dept !== undefined ? parseInt(window.localStorage.dept) : '',
        doctor: window.localStorage.doctor || '',
        name: window.localStorage.fullName || '',
        cellphone: window.localStorage.cellphone || ''
      },
      fileForm: {},
      rules: {
        hospital: [{ required: true, message: '请选择送检医院', trigger: 'change' }],
        dept: [{ required: true, message: '请选择送检科室', trigger: 'change' }],
        doctor: [{ required: true, message: '请填写送检医生', trigger: 'blur' }]
      },
      fileRules: {
        fileNum: [{ required: true, validator: checkFileNum, trigger: 'blur' }]
      },
      hospitalList: [],
      deptList: [],
      hospitalSelLoading: false,
      deptSelLoading: false,
      fileNum: 0,
      accessid: '',
      host: '',
      policyBase64: '',
      signature: '',
      callbackbody: '',
      key: '',
      expire: 0,
      g_object_name: '',
      g_object_name_type: '',
      uniqueKey: '',
      fileList: [],
      uploader: {},
      order: {}
    }
  },
  filters: {
    formatSize (fileSize) { return plupload.formatSize(fileSize) }
  },
  computed: {
    currentStep () {
      if (this.fileList.some(f => f.percent === 100)) return 4
      if (this.fileNum > 0) return 3
      if (this.informedConsent.hospital && this.informedConsent.dept && this.informedConsent.doctor) return 2
      return 1
    }
  },
  methods: {
    stepCls (n) {
      if (n < this.currentStep) return 'is-done'
      if (n === this.currentStep) return 'is-current'
      return ''
    },
    getHospitalList (query) {
      if (!query) {
        this.hospitalList = []
        return
      }
      this.hospitalSelLoading = true
      this.axios.get('hospital', { params: { keywords: query } })
        .then(res => { this.hospitalList = (res.data && res.data.list) || [] })
        .catch(err => console.log(err))
        .then(() => { this.hospitalSelLoading = false })
    },
    getDeptList (query) {
      if (!query) {
        this.deptList = []
        return
      }
      this.deptSelLoading = true
      this.axios.get('hospital-dept', { params: { keywords: query } })
        .then(res => { this.deptList = res.data || [] })
        .catch(err => console.log(err))
        .then(() => { this.deptSelLoading = false })
    },
    submitForm () {
      this.$refs.informedConsent.validate(valid => {
        if (!valid) return
        if (this.fileNum === 0) {
          this.$message.warning('请选择文件')
          return
        }
        this.$nextTick(() => {
          this.setUploadParam(this.uploader, '', false)
        })
      })
    },
    sendRequest () {
      const xmlhttp = new XMLHttpRequest()
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/policy/informed?userId=' + window.localStorage.userId
      xmlhttp.open('GET', serverUrl, false)
      xmlhttp.setRequestHeader('Authorization', window.localStorage.token)
      xmlhttp.send('userId=' + window.localStorage.userId)
      return xmlhttp.responseText
    },
    getSignature () {
      const obj = JSON.parse(this.sendRequest())
      this.host = obj.host
      this.policyBase64 = obj.policy
      this.accessid = obj.accessid
      this.signature = obj.signature
      this.expire = parseInt(obj.expire, 10)
      this.callbackbody = obj.callback
      this.key = obj.dir
      this.uniqueKey = obj.uniqueKey
    },
    randomString (len = 32) {
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      let pwd = ''
      for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return pwd
    },
    getSuffix (filename) {
      const pos = filename.lastIndexOf('.')
      return pos !== -1 ? filename.substring(pos) : ''
    },
    calculateObjectName (filename) {
      if (this.g_object_name_type === 'local_name') {
        this.g_object_name += filename
      } else if (this.g_object_name_type === 'random_name') {
        this.g_object_name = this.key + this.randomString(10) + this.getSuffix(filename)
      }
    },
    setUploadParam (up, filename) {
      this.getSignature()
      this.g_object_name = this.key
      if (filename !== '') this.calculateObjectName(filename)
      const newMultipartParams = {
        key: this.g_object_name + this.uniqueKey + '.' + filename.split('.').pop(),
        policy: this.policyBase64,
        OSSAccessKeyId: this.accessid,
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
      const idx = this.fileList.findIndex(f => f.id === id)
      if (idx > -1) this.fileList.splice(idx, 1)
      this.fileNum = this.fileList.length
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
          mime_types: [{ title: '允许上传文件类型', extensions: 'jpg,jpeg,gif,png,bmp,pdf,doc,docx' }],
          max_file_size: '10gb',
          prevent_duplicates: true
        },
        init: {
          FilesAdded: (up) => {
            that.fileList = up.files
            that.fileNum = up.files.length
          },
          BeforeUpload: (up, file) => {
            that.setUploadParam(up, file.name)
          },
          FileUploaded: (up, file, info) => {
            const d = document.getElementById(file.id)
            if (info.status !== 200) {
              d.setAttribute('class', 'el-upload-list__item is-warning')
              return
            }
            d.setAttribute('class', 'el-upload-list__item is-success')
            const param = {
              userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
              name: that.informedConsent.name,
              cellphone: that.informedConsent.cellphone,
              doctor: that.informedConsent.doctor,
              fileName: file.name,
              size: file.size,
              mimeType: file.type,
              uniqueKey: up.settings.multipart_params.uniqueKey,
              filePath: up.settings.multipart_params.key,
              objectKey: up.settings.multipart_params.key,
              orderId: that.$route.query.orderId
            }
            if (isNaN(parseInt(that.informedConsent.hospital))) {
              window.localStorage.hospitalName = that.informedConsent.hospital
              param.hospitalName = that.informedConsent.hospital
            } else {
              window.localStorage.hospital = that.informedConsent.hospital
              param.hospitalId = that.informedConsent.hospital
            }
            if (isNaN(parseInt(that.informedConsent.dept))) {
              window.localStorage.deptName = that.informedConsent.dept
              param.deptName = that.informedConsent.dept
            } else {
              window.localStorage.dept = that.informedConsent.dept
              param.deptId = that.informedConsent.dept
            }
            if (window.localStorage.companyId !== undefined) param.companyId = window.localStorage.companyId
            window.localStorage.doctor = that.informedConsent.doctor

            that.axios.post('informed/upload', param, { params: param })
              .then(() => {
                that.$notify({ message: '上传成功', type: 'success', customClass: 'pc-toast' })
                if (isNaN(parseInt(that.informedConsent.hospital))) {
                  that.axios.get('hospital/name', { params: { name: that.informedConsent.hospital } })
                    .then(r => { window.localStorage.hospital = r.data.id })
                    .catch(err => console.log(err))
                }
                if (isNaN(parseInt(that.informedConsent.dept))) {
                  that.axios.get('hospital-dept/name', { params: { name: that.informedConsent.dept } })
                    .then(r => { window.localStorage.dept = r.data.id })
                    .catch(err => console.log(err))
                }
              })
              .catch(err => {
                console.log(err)
                that.$message.error((err && err.data && err.data.message) || '上传记录入库失败')
              })
          },
          UploadComplete: () => {
            that.$notify({ message: '全部上传成功', type: 'success', customClass: 'pc-toast' })
            if (that.sec.includes('data-collect:informed')) {
              that.$router.push('/informed/list')
            } else {
              that.$router.push('/informed/info/list')
            }
          },
          Error: (up, err) => {
            console.log('上传失败：', err, up)
            if (err.code === -600) {
              that.$message.error('文件大小超出限制，限制大小为 10GB')
            } else if (err.status === 403) {
              that.$message.error('页面失效，请刷新页面后重新上传')
            } else {
              that.$message.error('上传失败，请刷新页面后重试')
            }
          }
        }
      })
      uploader.init()
      that.uploader = uploader
    },
    getOrder () {
      this.axios.get('order/' + this.$route.query.orderId)
        .then(res => { this.order = res.data || {} })
        .catch(err => console.log(err))
    },
    initData () {
      if (this.$route.query.orderId !== undefined) this.getOrder()
    }
  },
  mounted () {
    this.$nextTick(() => { this.upload() })
  },
  created () {
    this.initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pc-informed-upload {
  .upload-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 16px;
  }

  .upload-main-col,
  .upload-side-col {
    display: flex;
    flex-direction: column;
    gap: 16px;
    min-width: 0;
  }

  .card-title {
    font-size: var(--pc-fs-14);
    font-weight: 600;
    color: var(--pc-ink-800);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: var(--pc-bd-hair);
  }

  .mono {
    font-family: var(--pc-font-mono);
    font-variant-numeric: tabular-nums;
  }

  .full-w { width: 100%; }

  .file-list {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    background: var(--pc-ink-50);
    border: var(--pc-bd-hair);
    border-radius: var(--pc-r-4);
    font-size: var(--pc-fs-13);

    &.is-ready { color: var(--pc-ink-700); }
    &.is-success { color: var(--pc-succ-700); background: var(--pc-succ-100); }
    &.is-warning { color: var(--pc-warn-700); background: var(--pc-warn-100); }
  }

  .file-ic { color: var(--pc-ink-500); }
  .file-name { flex: 1; word-break: break-all; }
  .file-size { color: var(--pc-ink-400); margin-left: 4px; font-variant-numeric: tabular-nums; }
  .file-progress { width: 140px; }
  .file-close {
    color: var(--pc-ink-400);
    cursor: pointer;
    transition: color var(--pc-dur-2);
    &:hover { color: var(--pc-pos-600); }
  }

  .hints {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-600);
    line-height: 1.7;

    li {
      padding-left: 14px;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        left: 4px;
        top: 9px;
        width: 4px;
        height: 4px;
        background: var(--pc-ink-300);
        border-radius: 50%;
      }
    }
  }
}

::v-deep .pc-toast {
  width: auto;
  max-width: 320px;
}
</style>
