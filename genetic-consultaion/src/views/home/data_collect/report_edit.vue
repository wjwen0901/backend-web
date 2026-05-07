<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>报告管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/report/list' }" v-if="role === 'firm-service' || role === 'manager' || role === 'jk-service'">报告</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/report/info/list' }" v-if="role === 'channel'">报告</el-breadcrumb-item>
          <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta" v-if="report.truename || report.sampleCode">
          <span v-if="report.truename">{{ report.truename }}</span>
          <span v-if="report.sampleCode" class="num">· {{ report.sampleCode }}</span>
        </div>
      </div>

      <el-row :gutter="20" v-loading="loading" element-loading-text="加载报告">
        <el-col :span="10" v-if="role === 'manager' || role === 'jk-service'">
          <div class="panel">
            <div class="section-header">
              <h4>报告基础信息</h4>
            </div>
            <el-form ref="reportForm" :model="report" label-width="100px" size="small">
              <el-form-item label="样本编号">
                <el-input v-model="report.sampleCode" placeholder="实验室条码"></el-input>
              </el-form-item>
              <el-form-item label="送检项目">
                <el-select class="width-100-p" v-model="report.solutionId" filterable placeholder="请选择">
                  <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="送检医院">
                <el-autocomplete
                  class="width-100-p"
                  v-model="report.hospitalName"
                  :fetch-suggestions="hospitalQuerySearch"
                  placeholder="输入医院名搜索"
                  :trigger-on-focus="false"
                  @select="hospitalHandleSelect"></el-autocomplete>
              </el-form-item>
              <el-form-item label="送检科室">
                <el-select class="width-100-p" v-model="report.deptId" filterable placeholder="请选择">
                  <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="送检医生">
                <el-input v-model="report.doctor" placeholder="例如 王大夫"></el-input>
              </el-form-item>
              <el-form-item label="受检者姓名">
                <el-input v-model="report.truename"></el-input>
              </el-form-item>
              <el-form-item label="受检者电话">
                <el-input v-model="report.cellphone" type="tel"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <el-col :span="14">
          <div class="panel">
            <div class="section-header">
              <h4>报告原件</h4>
              <el-button v-if="imagePath" type="text" size="mini" icon="el-icon-view" @click="openExternal">在新窗口打开</el-button>
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
              <p class="empty-hint">实验室未上传或文件正在加载</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="footer-btn" v-if="role === 'manager' || role === 'jk-service'">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="unread" :loading="submitting">文件不可读</el-button>
        <el-button type="primary" :loading="submitting" @click="edit">保存信息</el-button>
        <el-button type="primary" plain @click="toCustomizeReport">下载定制报告</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportEdit',
  data () {
    return {
      role: window.localStorage.role,
      report: {},
      projects: [],
      imagePath: '',
      depts: [],
      loading: false,
      submitting: false
    }
  },
  methods: {
    _initData () {
      this.loading = true
      const reportPromise = this.axios.get('report/' + this.$route.params.reportId).then(res => {
        this.report = res.data || {}
        if (this.report.path) {
          return this.axios.get('oss/upload/show', {
            params: { objectKey: this.report.path, bucket: this.report.type }
          }).then(r => {
            this.imagePath = this.axios.defaults.baseURL.includes('https://')
              ? (r.data || '').replace('http://', 'https://')
              : r.data
          })
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('报告加载失败，请稍后重试')
      })

      const projectsPromise = this.axios.get('solution', { params: { userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined } })
        .then(res => { this.projects = res.data || [] })
        .catch(err => console.log(err))

      const deptsPromise = this.axios.get('hospital-dept')
        .then(res => { this.depts = res.data || [] })
        .catch(err => console.log(err))

      Promise.all([reportPromise, projectsPromise, deptsPromise])
        .then(() => { this.loading = false })
    },
    edit () {
      this.submitting = true
      const payload = Object.assign({}, this.report)
      delete payload.createTime
      this.axios.put('report/' + this.$route.params.reportId, payload)
        .then(() => {
          this.$message.success('已保存')
          if (this.role === 'firm-service' || this.role === 'manager' || this.role === 'jk-service') {
            this.$router.push('/report/list')
          } else {
            this.$router.push('/report/info/list')
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    cancel () {
      this.$router.push('/report/list')
    },
    unread () {
      this.submitting = true
      const payload = Object.assign({}, this.report)
      delete payload.createTime
      this.axios.put('report/unread/' + this.$route.params.reportId, payload)
        .then(() => {
          this.$message.success('已标记文件不可读')
          this.$router.push('/report/list')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    hospitalQuerySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString }
      }).then(res => {
        if (!res.data || res.data.endRow === 0) return cb([])
        cb((res.data.list || []).map(item => ({ value: item.name, id: item.id })))
      }).catch(err => {
        console.log(err)
        cb([])
      })
    },
    hospitalHandleSelect (item) {
      this.report.hospitalId = item.id
    },
    openExternal () {
      if (this.imagePath) window.open(this.imagePath, '_blank')
    },
    toCustomizeReport () {
      this.axios.get('report/combine/' + this.$route.params.reportId, {
        params: { hospitalId: this.report.hospitalId, solutionId: this.report.solutionId }
      }).then(res => {
        const url = this.axios.defaults.baseURL.includes('https://')
          ? (res.data || '').replace('http://', 'https://')
          : res.data
        if (url) window.open(url)
      }).catch(err => {
        console.log(err)
        this.$message.error('定制报告生成失败')
      })
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
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
    .num { font-variant-numeric: tabular-nums; margin-left: 4px; }
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

.section-header {
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

.doc-frame {
  width: 100%;
  height: 700px;
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
}

.doc-empty {
  padding: 80px 0 60px;
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

.footer-btn {
  margin-top: 20px;
  padding-top: 16px;
  border-top: var(--pc-bd-hair);
  text-align: center;
}

.width-100-p { width: 100%; }
</style>
