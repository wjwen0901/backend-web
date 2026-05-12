<template>
  <div class="pc-page">
    <div class="review-container">
      <div class="page-header" v-if="informedList.length">
        <div class="page-meta">
          匹配 <strong>{{ informedList.length }}</strong> 份知情同意
        </div>
      </div>

      <el-row :gutter="20" v-loading="loading" element-loading-text="加载复核信息">
        <el-col :span="14">
          <div class="panel">
            <div class="panel-header">
              <h4>报告信息</h4>
              <div class="header-actions">
                <el-button v-if="imagePath" type="text" size="mini" icon="el-icon-view" @click="openExternal(imagePath)">在新窗口打开</el-button>
                <el-button type="text" size="mini" @click="toEditReport(report.id)">修改信息</el-button>
              </div>
            </div>
            <div class="meta-grid">
              <span class="meta-label">客户姓名</span><span class="meta-value">{{ report.truename || '—' }}</span>
              <span class="meta-label">手机号码</span><span class="meta-value num">{{ report.cellphone || '—' }}</span>
              <span class="meta-label">样本编号</span><span class="meta-value num">{{ report.sampleCode || '—' }}</span>
            </div>
            <div class="doc-frame" v-if="imagePath">
              <object :data="imagePath" type="application/pdf" v-if="report.mimeType === 'application/pdf'">
                <embed :src="imagePath">
                <div class="pdf-fallback">
                  <p class="empty-title">PDF 无法在浏览器内预览</p>
                  <p class="empty-hint">点击右上角"在新窗口打开"查看完整报告</p>
                </div>
              </object>
              <img :src="imagePath" v-else class="doc-img">
            </div>
            <div class="doc-empty" v-else>
              <p class="empty-title">尚无报告文件</p>
            </div>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="panel">
            <div class="panel-header">
              <h4>知情同意</h4>
            </div>

            <div v-if="informedList.length" class="informed-stack">
              <div class="informed-card" v-for="item in informedList" :key="item.id">
                <div class="meta-grid">
                  <span class="meta-label">客户姓名</span><span class="meta-value">{{ item.truename || '—' }}</span>
                  <span class="meta-label">手机号码</span><span class="meta-value num">{{ item.cellphone || '—' }}</span>
                  <span class="meta-label">样本编号</span><span class="meta-value num">{{ item.sampleCode || '—' }}</span>
                </div>

                <div class="card-actions">
                  <el-button v-if="item.imagePath" type="text" size="mini" icon="el-icon-view" @click="openExternal(item.imagePath)">在新窗口打开</el-button>
                  <el-button type="text" size="mini" @click="toEditInformed(item.id)">修改信息</el-button>
                  <el-button type="text" size="mini" class="danger" @click="toDelInformedRelat(item.id)">删除此关系</el-button>
                </div>

                <div class="doc-frame doc-frame--small" v-if="item.imagePath">
                  <object :data="item.imagePath" type="application/pdf" v-if="item.mimeType === 'application/pdf'">
                    <embed :src="item.imagePath">
                    <div class="pdf-fallback">
                      <p class="empty-title">PDF 无法在浏览器内预览</p>
                      <p class="empty-hint">点击右上角"在新窗口打开"查看完整文件</p>
                    </div>
                  </object>
                  <img :src="item.imagePath" v-else class="doc-img">
                </div>
              </div>
            </div>

            <div v-else class="doc-empty">
              <p class="empty-title">尚无关联的知情同意</p>
              <p class="empty-hint">通过"信息复核"匹配后会显示在这里</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="footer-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" :loading="submitting" :disabled="!informedList.length" @click="reviewPass">确定匹配</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { apiSubmit } from '@/utils/pc'
import { closeCurrentTab } from '@/utils/tabs'

export default {
  name: 'ReviewDetail',
  data () {
    return {
      report: {},
      informedList: [],
      imagePath: '',
      loading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  methods: {
    _initData () { this.getData() },
    openExternal (url) {
      if (url) window.open(url, '_blank')
    },
    toAbsoluteUrl (url) {
      if (!url) return url
      return this.axios.defaults.baseURL.includes('https://')
        ? url.replace('http://', 'https://')
        : url
    },
    getData () {
      const reportId = this.$route.params.reportId
      this.loading = true
      const reportPromise = this.axios.get('report/' + reportId)
        .then(res => {
          this.report = res.data || {}
          if (this.report.path) {
            return this.axios.get('oss/upload/show', {
              params: { objectKey: this.report.path, bucket: this.report.type }
            }).then(r => { this.imagePath = this.toAbsoluteUrl(r.data) })
          }
        })

      const informedPromise = this.axios.get('report/recheck/' + reportId)
        .then(res => {
          const informed = (res.data && res.data.informed) || []
          const tasks = informed.map(item => {
            if (!item.path) return Promise.resolve(item)
            return this.axios.get('oss/upload/show', {
              params: { objectKey: item.path, bucket: item.type }
            }).then(r => Object.assign({}, item, { imagePath: this.toAbsoluteUrl(r.data) }))
          })
          return Promise.all(tasks).then(list => { this.informedList = list })
        })

      Promise.all([reportPromise, informedPromise])
        .catch(err => {
          console.log(err)
          this.$message.error('复核信息加载失败，请稍后重试')
        })
        .then(() => { this.loading = false })
    },
    toEditReport (id) {
      this.$router.push('/report/edit/' + id)
    },
    toEditInformed (id) {
      this.$router.push('/informed/edit/' + id)
    },
    toDelInformedRelat (id) {
      this.$confirm('删除后将无法恢复，确认要解除该匹配？', '解除关联', {
        confirmButtonText: '解除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        apiSubmit(this.axios, 'post', 'report/relieve', null, {
          reportId: this.report.id,
          informedId: id
        }).then(() => {
          this.$message.success('关系已解除')
          this.getData()
        }).catch(err => {
          console.log(err)
          this.$message.error('解除失败，请稍后重试')
        })
      }).catch(() => {})
    },
    reviewPass () {
      if (!this.informedList.length) return
      this.submitting = true
      const reportId = this.report.id
      const tasks = this.informedList.map(item =>
        this.axios.put('report/pass', { reportId, informedId: item.id })
      )
      Promise.all(tasks)
        .then(() => {
          this.$message.success('已审核通过')
          closeCurrentTab(this, '/review')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('审核失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    cancel () {
      this.$router.push('/review')
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.review-container {
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

.panel {
  background: var(--pc-ink-50);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: var(--pc-bd-hair);

  h4 {
    margin: 0;
    font-size: var(--pc-fs-14);
    font-weight: 600;
    color: var(--pc-ink-800);
  }
}

.header-actions {
  display: flex;
  gap: 4px;
}

.pdf-fallback {
  padding: 60px 24px;
  text-align: center;
  color: var(--pc-ink-500);

  .empty-title {
    margin: 0 0 4px;
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-600);
  }
  .empty-hint {
    margin: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.meta-grid {
  display: grid;
  grid-template-columns: 80px 1fr;
  row-gap: 6px;
  column-gap: 8px;
  margin-bottom: 12px;
  font-size: var(--pc-fs-13);

  .meta-label {
    color: var(--pc-ink-500);
  }
  .meta-value {
    color: var(--pc-ink-800);
    word-break: break-all;
    &.num { font-variant-numeric: tabular-nums; }
  }
}

.doc-frame {
  width: 100%;
  height: 560px;
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  overflow: hidden;

  object {
    width: 100%;
    height: 100%;
  }
  .doc-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--pc-ink-100);
  }

  &--small {
    height: 320px;
  }
}

.doc-empty {
  padding: 40px 0 24px;
  text-align: center;
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);

  .empty-title {
    margin: 0 0 4px;
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-600);
  }
  .empty-hint {
    margin: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.informed-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.informed-card {
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 12px 14px;
}

.card-actions {
  margin-bottom: 10px;

  .danger { color: var(--pc-neg-600); }
}

.footer-btn {
  margin-top: 20px;
  padding-top: 16px;
  border-top: var(--pc-bd-hair);
  text-align: center;
}
</style>
