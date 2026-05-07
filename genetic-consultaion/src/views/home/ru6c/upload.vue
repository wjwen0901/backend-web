<template>
  <div class="pc-page pc-ru6c-upload">
    <div class="pc-page-title">
      <h2>上传下机文件</h2>
      <span class="desc">上传 .zip 压缩包，系统自动分析并入库</span>
    </div>

    <div class="upload-grid">
      <div class="upload-main-col">
        <div class="pc-card">
          <div class="card-title">下机文件</div>
          <el-form :rules="fileRules" :model="fileForm" ref="fileForm" size="small">
            <el-form-item prop="fileNum">
              <div tabindex="0" class="pc-dragger" id="selectfiles">
                <i class="el-icon-upload ic"></i>
                <div class="dragger-main">将 .zip 文件拖到此处，或<em>点击上传</em></div>
                <div class="dragger-sub">仅支持 .zip 压缩文件 · 单文件 ≤ 10GB</div>
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
              <el-button type="primary" icon="el-icon-upload2" @click="submitForm">上传并分析</el-button>
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
                <div class="t">1. 准备 .zip 包</div>
                <div class="d">下机文件压缩为单一 zip</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(2)">
              <div>
                <div class="t">2. 上传到 OSS</div>
                <div class="d">分片传输，进度条会显示百分比</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(3)">
              <div>
                <div class="t">3. 触发分析</div>
                <div class="d">系统自动调用 release/data 分析模板</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(4)">
              <div>
                <div class="t">4. 查看结果</div>
                <div class="d">完成后跳转到分析列表</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pc-card">
          <div class="card-title">提示</div>
          <ul class="hints">
            <li>分析模板默认 <span class="mono">MODEL_renhe</span></li>
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
import { apiSubmit } from '@/utils/pc'

export default {
  name: 'Ru6cUpload',
  data () {
    const checkFileNum = (rule, value, callback) => {
      if (this.fileNum === 0) callback(new Error('请选择文件'))
      else callback()
    }
    return {
      fileForm: {},
      fileRules: {
        fileNum: [{ required: true, validator: checkFileNum, trigger: 'blur' }]
      },
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
      uploader: {}
    }
  },
  filters: {
    formatSize (fileSize) { return plupload.formatSize(fileSize) }
  },
  computed: {
    currentStep () {
      const allDone = this.fileNum > 0 && this.fileList.every(f => f.percent === 100)
      if (allDone) return 4
      if (this.fileList.some(f => f.percent > 0 && f.percent < 100)) return 3
      if (this.fileNum > 0) return 2
      return 1
    }
  },
  methods: {
    stepCls (n) {
      if (n < this.currentStep) return 'is-done'
      if (n === this.currentStep) return 'is-current'
      return ''
    },
    submitForm () {
      if (this.fileNum === 0) {
        this.$message.warning('请选择文件')
        return
      }
      this.$nextTick(() => {
        this.setUploadParam(this.uploader, '', false)
      })
    },
    sendRequest () {
      const xmlhttp = new XMLHttpRequest()
      const serverUrl = this.axios.defaults.baseURL + '/oss/upload/policy/ru6c-analysis?userId=' + window.localStorage.userId
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
        url: 'https://' + this.host.replace('mdhcare', 'cels'),
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
          mime_types: [{ title: '允许上传文件类型', extensions: 'zip' }],
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
              fileName: file.name,
              size: file.size,
              mimeType: file.type,
              uniqueKey: up.settings.multipart_params.uniqueKey,
              filePath: up.settings.multipart_params.key,
              objectKey: up.settings.multipart_params.key,
              template: 'MODEL_renhe'
            }
            if (window.localStorage.companyId !== undefined) param.companyId = window.localStorage.companyId

            apiSubmit(that.axios, 'post', 'release/data', param)
              .catch(err => {
                console.log(err)
                that.$message.error((err && err.data && err.data.message) || '触发分析失败')
              })
          },
          UploadComplete: () => {
            that.$notify({ message: '上传成功', type: 'success', customClass: 'pc-toast' })
            that.$confirm('上传成功，是否查看分析列表?', '上传完成', {
              confirmButtonText: '查看列表',
              cancelButtonText: '继续上传',
              type: 'success'
            }).then(() => {
              that.$router.push('/ru6c/list')
            }).catch(() => {})
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
    }
  },
  mounted () {
    this.$nextTick(() => { this.upload() })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.pc-ru6c-upload {
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
    font-size: var(--pc-fs-12);
    background: var(--pc-ink-100);
    color: var(--pc-ink-700);
    padding: 1px 6px;
    border-radius: var(--pc-r-2);
  }

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
