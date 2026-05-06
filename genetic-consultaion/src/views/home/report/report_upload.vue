<template>
  <div class="pc-report-upload">
    <div class="pc-page-title">
      <h2>上传报告</h2>
      <span class="desc">为指定订单上传 PDF 报告 · 文件名需为「样本唯一编码」</span>
    </div>

    <div class="upload-grid">
      <div class="upload-main-col">
        <!-- 卡片 1：订单 & 客户 -->
        <div class="pc-card">
          <div class="card-title">订单 &amp; 客户</div>
          <el-form :model="report" label-width="120px" label-position="left" size="small">
            <el-form-item label="订单编号" v-if="order.id !== undefined">
              <span class="mono">{{ order.tid }}</span>
            </el-form-item>
            <el-form-item label="检测项目" v-if="order.itemTitle">
              {{ order.itemTitle }}
            </el-form-item>
            <el-form-item label="选择客户公司" v-if="role === 'manager' || role === 'jk-service'">
              <el-select
                class="full-w"
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
          </el-form>
        </div>

        <!-- 卡片 2：报告内容 -->
        <div class="pc-card">
          <div class="card-title">报告内容</div>
          <el-form :model="report" label-width="120px" label-position="left" size="small">
            <el-form-item label="结论">
              <el-radio-group v-model="isPositive">
                <el-radio @click.native.prevent="updatPositive(0)" :label="0">阴性</el-radio>
                <el-radio @click.native.prevent="updatPositive(1)" :label="1">阳性</el-radio>
              </el-radio-group>
              <span v-if="isPositive === 1" class="pos-tip">
                <el-tag class="el-tag--pos">阳性 · 优先寄出</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="选择检测产品">
              <el-select class="full-w" v-model="report.solutionId" filterable placeholder="请选择">
                <el-option
                  v-for="item in projects"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- 卡片 3：报告文件（plupload 容器） -->
        <div class="pc-card">
          <div class="card-title">报告文件</div>
          <el-form :rules="rules" :model="report" ref="report" size="small">
            <el-form-item prop="fileNum">
              <!-- plupload 必需的 selectfiles / container DOM id 保留 -->
              <div tabindex="0" class="pc-dragger" id="selectfiles">
                <i class="el-icon-upload ic"></i>
                <div class="dragger-main">将 PDF 文件拖到此处，或<em>点击上传</em></div>
                <div class="dragger-sub">请以「样本唯一编码」命名文件 · 单文件 ≤ 10GB</div>
                <input type="file" name="file" multiple="multiple" class="el-upload__input">
              </div>
              <ul class="file-list" id="ossfile">
                <li class="file-item is-ready"
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
              <el-button type="primary" icon="el-icon-upload2" @click="submitForm">提交报告</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 右侧：步骤条 + 概要 -->
      <div class="upload-side-col">
        <div class="pc-card">
          <div class="card-title">上传流程</div>
          <div class="pc-steps">
            <div class="pc-step" :class="stepCls(1)">
              <div>
                <div class="t">1. 选择订单</div>
                <div class="d">从订单列表跳入，已带入 orderId</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(2)">
              <div>
                <div class="t">2. 选择产品 &amp; 标记结论</div>
                <div class="d">阴性 / 阳性，影响下游寄出优先级</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(3)">
              <div>
                <div class="t">3. 上传 PDF</div>
                <div class="d">文件名 = 样本唯一编码，支持多文件</div>
              </div>
            </div>
            <div class="pc-step" :class="stepCls(4)">
              <div>
                <div class="t">4. 提交</div>
                <div class="d">提交后状态自动转为「已出报告」</div>
              </div>
            </div>
          </div>
        </div>

        <div class="pc-card">
          <div class="card-title">报告概要</div>
          <div class="summary">
            <div>订单：<b class="mono">{{ order.tid || '-' }}</b></div>
            <div v-if="order.pName">受检者：<b>{{ order.pName }}</b></div>
            <div>当前状态：<el-tag class="el-tag--prog">待复核</el-tag></div>
            <div>提交后：<el-tag class="el-tag--succ">已出报告</el-tag></div>
            <div class="api-hint">数据接口：<code>/report/upload</code></div>
          </div>
        </div>
      </div>
    </div>
  </div>
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
          { required: true, validator: checkFileNum, trigger: 'blur' }
        ]
      },
      companySelLoading: false,
      uploadAction: this.axios.defaults.baseURL + '/report/upload',
      uploadHeader: { 'Authorization': window.localStorage.token },
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
      isPositive: null,
      g_object_name: '',
      g_object_name_type: '',
      now: Date.parse(new Date()) / 1000,
      uniqueKey: '',
      fileList: [],
      uploader: {},
      companyList: [],
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      order: {},
      projects: []
    }
  },
  computed: {
    currentStep () {
      if (this.fileList.length && this.fileList.every(f => f.percent === 100)) return 4
      if (this.fileList.length) return 3
      if (this.report.solutionId || this.isPositive !== null) return 2
      return 1
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.upload()
    })
  },
  methods: {
    stepCls (n) {
      if (n < this.currentStep) return 'is-done'
      if (n === this.currentStep) return 'is-current'
      return ''
    },
    initData () {
      this.getCompanyList()
      if (this.$route.query.orderId !== undefined) {
        this.getOrder()
      }
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
        }
      }).then(res => {
        this.projects = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    updatPositive (status) {
      this.isPositive = status
      this.report.isPositive = status
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
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
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
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
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
          max_file_size: '10gb',
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
              if (d) d.setAttribute('class', 'file-item is-success')
              const param = {
                userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
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
                solutionId: this.report.solutionId,
                isPositive: this.report.isPositive
              }
              let instance = this.axios.create({
                headers: {
                  'Authorization': window.localStorage.token,
                  'Content-Type': 'application/json'
                }
              })
              instance({
                method: 'post',
                url: 'report/upload',
                params: param,
                data: param,
                headers: {
                  'X-Requested-With': 'XMLHttpRequest',
                  'Content-Type': 'application/json'
                }
              }).then(res => {
                this.$message({ message: '上传成功', type: 'success' })
              }).catch(err => {
                this.$message.error(err.data.message)
                console.log(err)
              })
            } else {
              if (d) d.setAttribute('class', 'file-item is-warning')
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
  }
}
</script>

<style lang="scss" scoped>
.pc-report-upload {
  .upload-grid {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 16px;
    align-items: start;
  }
  .upload-side-col { position: sticky; top: 0; }
  .card-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--pc-ink-900);
    margin-bottom: 12px;
  }
  .full-w { width: 100%; }
  .mono { font-family: var(--pc-font-mono); color: var(--pc-ink-700); }
  .pos-tip { margin-left: 10px; }
  .file-list {
    margin: 12px 0 0;
    padding: 0;
    list-style: none;
  }
  .file-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border: 1px solid var(--pc-ink-200);
    border-radius: 4px;
    font-size: 12.5px;
    margin-bottom: 6px;
    background: #fff;
    list-style: none;
  }
  .file-ic { color: var(--pc-primary-600); }
  .file-name { flex: 1; }
  .file-size { color: var(--pc-ink-400); }
  .file-progress { width: 120px; }
  .file-close { cursor: pointer; color: var(--pc-ink-400); }
  .dragger-main { margin-top: 6px; }
  .dragger-sub {
    font-size: 11.5px;
    color: var(--pc-ink-400);
    margin-top: 4px;
  }
  .summary {
    font-size: 12px;
    color: var(--pc-ink-600);
    line-height: 1.9;
    > div b { color: var(--pc-ink-800); }
    .api-hint {
      margin-top: 6px;
      color: var(--pc-ink-400);
      code {
        font-family: var(--pc-font-mono);
        font-size: 11.5px;
        background: var(--pc-ink-100);
        padding: 1px 6px;
        border-radius: 3px;
        color: var(--pc-ink-700);
      }
    }
  }
  .el-upload__input { display: none; }
  /* plupload 注入 mOxie 覆盖层到 #selectfiles，dragger relative 让覆盖层落在范围内 */
  .pc-dragger { position: relative; }
}
</style>
