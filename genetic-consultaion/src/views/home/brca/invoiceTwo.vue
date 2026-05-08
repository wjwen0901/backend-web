<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
          <el-breadcrumb-item>发票记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 张发票</div>
      </div>

      <div class="opera-box">
        <el-input
          placeholder="搜索发票抬头"
          v-model="keyword"
          size="small"
          clearable
          class="search-input"
          @input="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button type="warning" size="small" @click="exportData">导出数据</el-button>
        <el-popover placement="bottom-end" width="320" v-model="validateSatus">
          <div class="popover-title">
            <i class="el-icon-info"></i>
            <span>选择需要设置的发票状态</span>
          </div>
          <div class="popover-radios">
            <el-radio-group v-model="setStatus" size="small">
              <el-radio-button v-for="item in radioList" :key="item.id" :label="item.id">{{ item.name }}</el-radio-button>
            </el-radio-group>
          </div>
          <div class="popover-actions">
            <el-button size="mini" @click="cancelStatus">取消</el-button>
            <el-button type="primary" size="mini" @click="confirmStatus">确定</el-button>
          </div>
          <el-button slot="reference" size="small" type="primary">设置发票状态</el-button>
        </el-popover>
      </div>

      <el-table
        :data="invoiceList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载发票列表"
        style="width: 100%">
        <el-table-column prop="invoiceType" label="类型" width="100" fixed="left"></el-table-column>
        <el-table-column label="状态" width="120" fixed="left">
          <template slot-scope="scope">
            <el-tag :class="tagClassOf(invoiceStatusType(scope.row.statusStr))" size="mini" disable-transitions>{{ scope.row.statusStr || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="抬头" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.title">{{ scope.row.title }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="税号" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.dutyNumber">{{ scope.row.dutyNumber }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120" align="right">
          <template slot-scope="scope">
            <span class="num amount">¥{{ scope.row.price || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接收方式" min-width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.receivingMode === 0 && scope.row.receiver">
              <span class="meta">纸质 ·</span>
              {{ scope.row.receiver.receiver }}
              <span class="meta">{{ scope.row.receiver.cellphone }}</span>
              <p class="receiver-addr">{{ formatAddress(scope.row.receiver) }}</p>
            </div>
            <div v-else-if="scope.row.receivingMode === 1">
              <span class="meta">电子 ·</span>
              <span class="num">{{ scope.row.email }}</span>
            </div>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.applyTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮寄时间" width="140">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.sendTime">{{ scope.row.sendTime | formatDate }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)">订单</el-button>
            <el-button type="text" size="mini" @click="toConfirm(scope.row, true)" v-if="scope.row.status === 1">审核提醒</el-button>
            <el-button type="text" size="mini" @click="toConfirm(scope.row, false)" v-if="scope.row.status === 1 || scope.row.status === 2">邮寄</el-button>
            <el-button type="text" size="mini" @click="toConfirm(scope.row, false)" v-if="scope.row.status === 3">重新邮寄</el-button>
            <el-button type="text" size="mini" @click="toPdf(scope.row)" v-if="scope.row.receivingMode === 1">发邮件</el-button>
            <el-button type="text" size="mini" @click="downloadEmail(scope.row)" v-if="scope.row.invoiceFiles && scope.row.invoiceFiles.length">下载附件</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">还没有发票记录</p>
            <p class="empty-hint">{{ keyword ? '换个关键词试试' : '用户申请发票后会在这里显示' }}</p>
          </div>
        </template>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 150]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>

      <el-dialog title="审核通过" :visible.sync="dialogConfirmFormVisible" width="640px">
        <div class="callout">
          <h5>开票人信息</h5>
          <p>抬头：{{ expressItem.title || '—' }}</p>
          <p>税号：{{ expressItem.dutyNumber || '—' }}</p>
          <p>金额：<span class="num amount">¥{{ expressItem.price || 0 }}</span></p>
          <p>收件人：{{ expressItem.dContact }} · {{ expressItem.dTel }}</p>
          <p class="addr">{{ expressItem.dProvince }} {{ expressItem.dCity }} {{ expressItem.dCounty }} {{ expressItem.dAddress }}</p>
        </div>
        <el-form ref="form" :model="expressItem" label-width="100px" size="small">
          <el-form-item label="通知内容">
            <el-input
              type="textarea"
              :rows="3"
              v-model="expressItem.note"
              placeholder="您的发票将于 14 个工作日内开出，请关注快递消息">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogConfirmFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInvoice">确定发送</el-button>
        </span>
      </el-dialog>

      <el-dialog title="订单详情" :visible.sync="dialogEditFormVisible" width="800px">
        <el-table :data="invoiceDetail" size="mini" border style="width: 100%">
          <el-table-column prop="orderNo" label="订单编号" width="200">
            <template slot-scope="scope"><span class="num">{{ scope.row.orderNo }}</span></template>
          </el-table-column>
          <el-table-column prop="productName" label="检测产品" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hospitalName" label="送检医院" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" width="120" align="right">
            <template slot-scope="scope"><span class="num amount">¥{{ scope.row.orderPrice || 0 }}</span></template>
          </el-table-column>
          <el-table-column label="下单时间" width="140">
            <template slot-scope="scope"><span class="num">{{ scope.row.create_time | formatDate }}</span></template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="寄送发票" :visible.sync="dialogExpressFormVisible" width="640px">
        <div class="callout" v-if="expressItem.dContact">
          <h5>收件人信息</h5>
          <p>{{ expressItem.dContact }} · {{ expressItem.dTel }}</p>
          <p class="addr">{{ expressItem.dProvince }} {{ expressItem.dCity }} {{ expressItem.dCounty }} {{ expressItem.dAddress }}</p>
        </div>
        <el-form ref="form" :model="expressItem" label-width="100px" size="small">
          <el-form-item label="寄件人姓名">
            <el-input v-model="expressItem.jContact"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input type="tel" v-model="expressItem.jTel"></el-input>
          </el-form-item>
          <el-form-item label="公司 / 单位">
            <el-input v-model="expressItem.jCompany"></el-input>
          </el-form-item>
          <el-form-item label="省市区">
            <el-cascader class="width-100-p" :options="regionData" v-model="areaInfo" @change="addressHandleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="expressItem.jAddress"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="2" v-model="expressItem.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogExpressFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onExpressSubmit">确定寄送</el-button>
        </span>
      </el-dialog>

      <el-dialog title="发送电子邮件" :visible.sync="dialogPdfVisible" width="640px">
        <div class="upload-email">
          <el-upload
            ref="upload"
            action=""
            drag
            multiple
            accept=".pdf"
            :before-upload="beforeUpload"
            :file-list="fileData"
            :http-request="getOss"
            :on-remove="handelRemove"
            :on-success="handelSuccess"
            :on-error="handelError">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">仅支持 PDF · 单文件 ≤ 10MB</div>
          </el-upload>
        </div>
        <span slot="footer">
          <el-button @click="dialogPdfVisible = false">取消</el-button>
          <el-button type="primary" @click="send" :disabled="buttonDisable" :loading="buttonLoad">发送邮件</el-button>
        </span>
      </el-dialog>

      <el-dialog title="选择要下载的文件" :visible.sync="dialogDownloadVisible" width="640px">
        <div class="download-actions">
          <el-button type="primary" icon="el-icon-download" size="small" :disabled="emilPathList.length === 0" @click="downloadBatchEmail">下载选中</el-button>
        </div>
        <el-table size="small" ref="multipleTable" border :data="downloadFileList" @selection-change="handleSelectionChange" :row-key="handleReserve">
          <el-table-column align="center" type="selection" width="60"></el-table-column>
          <el-table-column align="left" label="文件名称" prop="fileName"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { formatDate, formatAddress, BRCA_INVOICE_STATUS_TYPE, typeOf, tagClassOf, downloadBlob, dateStr } from '@/utils/pc'

export default {
  name: 'BrcaInvoice',
  data () {
    return {
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      invoiceList: [],
      keyword: '',
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      validateSatus: false,
      setStatus: false,
      setStatusCopy: false,
      radioList: [],
      expressItem: {},
      dialogConfirmFormVisible: false,
      invoiceDetail: [],
      dialogEditFormVisible: false,
      dialogExpressFormVisible: false,
      dialogPdfVisible: false,
      invoiceId: 0,
      fileData: [],
      fileList: [],
      fileTotal: 0,
      successFileNum: 0,
      buttonLoad: false,
      buttonDisable: true,
      dialogDownloadVisible: false,
      downloadFileList: [],
      emilPathList: []
    }
  },
  watch: {
    validateSatus (val) { if (!val) this.setStatus = this.setStatusCopy },
    dialogDownloadVisible (val) {
      if (!val && this.$refs.multipleTable) {
        this.$refs.multipleTable.clearSelection()
        this.emilPathList = []
      }
    },
    successFileNum (val) {
      this.buttonDisable = this.fileTotal !== val
    },
    fileList (val) {
      this.buttonDisable = val.length === 0
    }
  },
  computed: {
    areaInfo: {
      get () {
        const e = this.expressItem
        if (!e.jCounty) return []
        try {
          const province = this.TextToCode[e.jProvince].code
          const cityKey = e.jCity === e.jProvince ? '市辖区' : e.jCity
          const city = this.TextToCode[e.jProvince][cityKey].code
          const county = this.TextToCode[e.jProvince][cityKey][e.jCounty].code
          return [province, city, county]
        } catch (err) {
          return []
        }
      },
      set () {}
    }
  },
  filters: { formatDate },
  mounted () {
    this.getInvoiceList()
    this.getStatus()
  },
  methods: {
    tagClassOf,
    invoiceStatusType (statusStr) { return typeOf(BRCA_INVOICE_STATUS_TYPE, statusStr) },
    formatAddress: formatAddress,
    handleSearch () {
      this.pageNum = 1
      this.getInvoiceList()
    },
    handleSelectionChange (val) { this.emilPathList = val },
    handleReserve (row) { return row.path },
    downloadEmail (data) {
      this.dialogDownloadVisible = true
      this.downloadFileList = data.invoiceFiles
    },
    downloadBatchEmail () {
      this.emilPathList.forEach(item => this.downloadApi(item.path, item.fileName))
      this.dialogDownloadVisible = false
    },
    downloadApi (url, name) {
      this.axios.get('oss/upload/show', { params: { objectKey: url } })
        .then(res => fetch(res.data))
        .then(r => r.blob())
        .then(blob => {
          const fileUrl = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = fileUrl
          a.download = name
          a.click()
          window.URL.revokeObjectURL(fileUrl)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('下载失败，请稍后重试')
        })
    },
    handelError () { this.$message.error('文件上传失败，请联系工作人员') },
    handelSuccess (response, file, fileList) {
      this.fileTotal = fileList.length
      if (file.status === 'success') this.successFileNum++
    },
    handelRemove (file, fileArr) {
      this.fileTotal = fileArr.length
      this.fileList = this.fileList.filter(item => item.fileName !== file.name)
    },
    beforeUpload (file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      if (['pdf'].indexOf(fileSuffix) === -1) {
        this.$message.error('上传文件只能是 PDF 格式')
        return false
      }
      if (file.size / 1024 / 1024 >= 10) {
        this.$message.error('上传文件大小不能超过 10 MB')
        return false
      }
    },
    send () {
      this.buttonLoad = true
      this.axios.post('/email/invoice', {
        invoiceId: this.invoiceId.toString(),
        invoiceFiles: this.fileList
      }).then(res => {
        if (res.data.status === 'success') {
          this.$message.success('发送成功')
          this.dialogPdfVisible = false
          this.getInvoiceList()
        } else {
          this.$message.warning('发送失败')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('发送失败，请稍后重试')
      }).then(() => {
        this.buttonLoad = false
      })
    },
    getOss (file) {
      this.axios.get('/oss/upload/policy/invoice').then(res => {
        if (!res || !res.data) return
        const data = res.data
        const obj = new FormData()
        obj.append('OSSAccessKeyId', data.accessid)
        obj.append('policy', data.policy)
        obj.append('signature', data.signature)
        obj.append('key', data.dir + data.uniqueKey + '.pdf')
        obj.append('success_action_status', '200')
        obj.append('uniqueKey', data.uniqueKey)
        obj.append('file', file.file)
        this.axios.post('https://mdhcare.oss-cn-beijing.aliyuncs.com/', obj, {
          onUploadProgress: progress => {
            if (progress.lengthComputable) {
              const num = (progress.loaded / progress.total).toFixed(2) * 100
              file.onProgress({ percent: num })
            }
          }
        }).then(() => {
          this.fileList.push({
            path: data.dir + data.uniqueKey + '.pdf',
            fileName: file.file.name,
            size: file.file.size
          })
          file.onSuccess()
        }).catch(() => file.onError())
      }).catch(() => file.onError())
    },
    toPdf (row) {
      this.dialogPdfVisible = true
      this.invoiceId = row.id
      this.fileData = []
      this.fileList = []
      this.fileTotal = 0
      this.successFileNum = 0
    },
    onExpressSubmit () {
      this.axios.post('sf/invoice?invoiceId=' + this.expressItem.invoiceId, { ...this.expressItem })
        .then(res => {
          if (res.data && res.data.success) {
            this.$message.success('提交成功')
            this.dialogExpressFormVisible = false
            this.getInvoiceList()
          } else {
            this.$message.warning('提交失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
    },
    addressHandleChange (value) {
      this.expressItem.jProvince = this.CodeToText[value[0]]
      this.expressItem.jCity = this.CodeToText[value[1]]
      this.expressItem.jCounty = this.CodeToText[value[2]]
    },
    toDetail (id) {
      this.axios.get('invoice/detail/' + id, { params: { userId: this.userId } })
        .then(res => {
          this.invoiceDetail = res.data
          this.dialogEditFormVisible = true
        })
        .catch(err => {
          console.log(err)
          this.$message.error('加载订单详情失败')
        })
    },
    confirmInvoice () {
      this.axios.put('invoice/confirm/' + this.expressItem.invoiceId + '?note=' + (this.expressItem.note || ''), { ...this.expressItem })
        .then(res => {
          if (res.data === 'success') {
            this.$message.success('提交成功')
            this.dialogConfirmFormVisible = false
            this.getInvoiceList()
          } else {
            this.$message.warning('提交失败')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
    },
    toConfirm (invoice, type) {
      const r = invoice.receiver || {}
      this.expressItem = Object.assign({}, invoice, {
        invoiceId: invoice.id,
        receiverId: invoice.receiverId,
        dContact: r.receiver,
        dTel: r.cellphone,
        dProvince: r.province,
        dCity: r.city,
        dCounty: r.county,
        dAddress: r.address
      })
      if (type) {
        this.dialogConfirmFormVisible = true
      } else {
        this.dialogExpressFormVisible = true
      }
    },
    exportData () {
      this.axios.get('invoice/export/list', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.keyword },
        responseType: 'blob'
      }).then(res => {
        downloadBlob(res.data, '发票记录-' + dateStr() + '.xls')
      }).catch(err => {
        console.log(err)
        this.$message.error('导出失败，请稍后重试')
      })
    },
    cancelStatus () {
      this.setStatus = this.setStatusCopy
      this.validateSatus = false
    },
    confirmStatus () {
      this.axios.put('invoice/setting?val=' + this.setStatus).then(res => {
        if (res.data && res.data.message === '成功') {
          this.setStatusCopy = this.setStatus
          this.$message.success('设置成功')
        } else {
          this.$message.warning('设置失败')
        }
        this.validateSatus = false
      }).catch(err => {
        console.log(err)
        this.$message.error('设置失败，请稍后重试')
      })
    },
    getStatus () {
      this.axios.get('invoice/setting').then(res => {
        const range = res.data && res.data.data && res.data.data.proValRange
        if (!range) return
        this.radioList = range.split('，').map(item => {
          const parts = item.split('-')
          return { id: parts[0], name: parts[1] }
        })
        this.setStatus = res.data.data.valDefault
        this.setStatusCopy = this.setStatus
      }).catch(err => console.log(err))
    },
    getInvoiceList () {
      this.loading = true
      this.axios.get('invoice/list', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.keyword }
      }).then(res => {
        this.invoiceList = res.data.list || []
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('发票列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) { this.pageSize = val; this.getInvoiceList() },
    handleCurrentChange (val) { this.pageNum = val; this.getInvoiceList() }
  }
}
</script>

<style scoped lang="scss">
.user-container {
  margin: 20px 0;
  padding: 20px;
  background: var(--pc-white);
  border-radius: var(--pc-r-4);
  box-shadow: var(--pc-sh-1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: var(--pc-bd-hair);

  .page-meta {
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-500);
    strong {
      color: var(--pc-ink-800);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }
}

.opera-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  .search-input { width: 320px; margin-right: auto; }
}

.empty {
  padding: 40px 0 24px;
  text-align: center;
  .empty-title { margin: 0 0 4px; font-size: var(--pc-fs-14); color: var(--pc-ink-600); }
  .empty-hint { margin: 0; font-size: var(--pc-fs-12); color: var(--pc-ink-400); }
}

.callout {
  background: var(--pc-info-100);
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: var(--pc-r-4);

  h5 {
    margin: 0 0 6px;
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-info-700);
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--pc-info-600);
      margin-right: 6px;
    }
  }
  p { margin: 2px 0; font-size: var(--pc-fs-12); color: var(--pc-ink-700); }
  .addr { color: var(--pc-ink-500); }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
}

.popover-title {
  display: flex;
  align-items: center;
  font-size: var(--pc-fs-13);
  color: var(--pc-ink-600);
  margin-bottom: 12px;
  i { color: var(--pc-warn-600); margin-right: 6px; }
}
.popover-radios { margin-bottom: 16px; }
.popover-actions { text-align: right; }

.upload-email { padding: 8px 0; }
.download-actions { text-align: right; margin-bottom: 12px; }

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-right: 4px; }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
  .muted { color: var(--pc-ink-400); }
  .receiver-addr { margin: 2px 0 0; font-size: var(--pc-fs-12); color: var(--pc-ink-500); }
}
</style>
