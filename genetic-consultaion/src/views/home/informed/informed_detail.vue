<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>知情同意</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/informed/list' }">知情列表</el-breadcrumb-item>
          <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <el-row :gutter="20" v-loading="loading" element-loading-text="加载知情同意">
        <el-col :span="14">
          <div class="panel">
            <div class="panel-header">
              <h4>客户与样本信息</h4>
            </div>
            <div class="meta-grid">
              <span class="meta-label">客户姓名</span><span class="meta-value">{{ informedContent.truename || '—' }}</span>
              <span class="meta-label">性别</span><span class="meta-value">{{ informedContent.sex || '—' }}</span>
              <span class="meta-label">年龄</span><span class="meta-value num">{{ informedContent.age || '—' }}</span>
              <span class="meta-label">联系电话</span><span class="meta-value num">{{ informedContent.cellphone || '—' }}</span>
              <span class="meta-label">邮箱</span><span class="meta-value">{{ informedContent.email || '—' }}</span>
              <span class="meta-label">证件号</span><span class="meta-value num">{{ informedContent.idCode || '—' }}</span>
              <span class="meta-label">订单编号</span><span class="meta-value num">{{ informedContent.orderNo || '—' }}</span>
              <span class="meta-label">样本编号</span><span class="meta-value num">{{ informedContent.sampleCode || '—' }}</span>
              <span class="meta-label">送检医院</span><span class="meta-value">{{ informedContent.hospitalName || '—' }}</span>
              <span class="meta-label">送检医生</span><span class="meta-value">{{ informedContent.doctor || '—' }}</span>
              <span class="meta-label">备注</span><span class="meta-value">{{ informedContent.remark || '—' }}</span>
            </div>

            <div class="panel-divider">可编辑信息</div>

            <el-form ref="informedForm" :model="informedContent" label-width="100px" size="small">
              <el-form-item label="送检科室">
                <el-select v-model="informedContent.deptId" filterable placeholder="请选择" class="width-100-p">
                  <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <div v-if="informedContent.deptName && !informedContent.deptId" class="hint">
                  原值：{{ informedContent.deptName }}（请重新选择）
                </div>
              </el-form-item>
              <el-form-item label="检测项目">
                <el-select v-model="informedContent.solutionId" filterable placeholder="请选择" class="width-100-p">
                  <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所在地区">
                <el-cascader
                  class="width-100-p"
                  :options="regionData"
                  v-model="areaInfo"
                  @change="addressHandleChange"></el-cascader>
                <div v-if="informedContent.province && areaInfo.length === 0" class="hint warn">
                  存储值：{{ informedContent.province }} / {{ informedContent.city }} / {{ informedContent.county }}（未在地区库匹配，请重新选择）
                </div>
              </el-form-item>
              <el-form-item label="详细地址">
                <el-input v-model="informedContent.address" placeholder="街道 / 门牌号"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <el-col :span="10">
          <div class="panel">
            <div class="panel-header">
              <h4>知情同意原件</h4>
            </div>
            <div class="doc-frame" v-if="imagePath">
              <object :data="imagePath" type="application/pdf" v-if="informedContent.mimeType === 'application/pdf'">
                <embed :src="imagePath">
              </object>
              <img :src="imagePath" v-else class="doc-img">
            </div>
            <div class="doc-empty" v-else>
              <p class="empty-title">尚无原件</p>
              <p class="empty-hint">客户未上传或文件正在加载</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="footer-btn">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="unread" :loading="submitting">标记未读</el-button>
        <el-button type="primary" @click="edit" :loading="submitting">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'

export default {
  name: 'InformedDetail',
  data () {
    return {
      informedContent: { smsStatus: 0 },
      projects: [],
      depts: [],
      imagePath: '',
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
      role: window.localStorage.role,
      loading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    areaInfo: {
      get () {
        const c = this.informedContent
        if (!c.county) return []
        try {
          const cityTemp = c.city === c.province ? '市辖区' : c.city
          const provNode = this.TextToCode[c.province]
          if (!provNode) return []
          const cityNode = provNode[cityTemp]
          if (!cityNode) return []
          const countyNode = cityNode[c.county]
          if (!countyNode) return []
          return [provNode.code, cityNode.code, countyNode.code]
        } catch (err) {
          console.warn('[informed_detail] 省市区回显失败', c.province, c.city, c.county, err)
          return []
        }
      },
      set () {}
    }
  },
  methods: {
    _initData () {
      const informedId = this.$route.params.informedId
      this.loading = true

      const informedPromise = this.axios.get('informed/' + informedId)
        .then(res => {
          this.informedContent = res.data || {}
          if (res.data && res.data.tid !== undefined) {
            this.informedContent.orderNo = res.data.tid
          }
          if (this.informedContent.smsStatus === undefined) {
            this.informedContent.smsStatus = 0
          }
          if (this.informedContent.path) {
            return this.axios.get('oss/upload/show', {
              params: { objectKey: this.informedContent.path }
            }).then(r => {
              this.imagePath = this.axios.defaults.baseURL.includes('https://')
                ? (r.data || '').replace('http://', 'https://')
                : r.data
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('知情同意加载失败，请稍后重试')
        })

      const projectsPromise = this.axios.get('solution', { params: { userId: this.userId } })
        .then(res => { this.projects = res.data || [] })
        .catch(err => console.log(err))

      const deptsPromise = this.axios.get('hospital-dept')
        .then(res => { this.depts = res.data || [] })
        .catch(err => console.log(err))

      Promise.all([informedPromise, projectsPromise, deptsPromise])
        .then(() => { this.loading = false })
    },
    edit () {
      this.submitting = true
      const payload = Object.assign({}, this.informedContent)
      delete payload.createTime
      this.axios.put('informed/' + this.$route.params.informedId, payload)
        .then(() => {
          this.$message.success('已保存')
          this.$router.push('/informed/list')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    unread () {
      this.submitting = true
      const payload = Object.assign({}, this.informedContent)
      delete payload.createTime
      this.axios.put('informed/unread/' + this.$route.params.informedId, payload)
        .then(() => {
          this.$message.success('已标记未读')
          this.$router.push('/informed/list')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('操作失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    cancel () {
      this.$router.push('/informed/list')
    },
    addressHandleChange (value) {
      if (!value || !value.length) return
      this.informedContent.province = this.CodeToText[value[0]]
      this.informedContent.city = this.CodeToText[value[1]]
      this.informedContent.county = this.CodeToText[value[2]]
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
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: var(--pc-bd-hair);
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

.panel-divider {
  margin: 12px 0 10px;
  padding-top: 10px;
  border-top: var(--pc-bd-hair);
  font-size: var(--pc-fs-12);
  color: var(--pc-ink-500);
  letter-spacing: 0.3px;
}

.meta-grid {
  display: grid;
  grid-template-columns: 90px 1fr;
  row-gap: 6px;
  column-gap: 8px;
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

.hint {
  font-size: var(--pc-fs-12);
  color: var(--pc-ink-500);
  line-height: 1.4;
  margin-top: 4px;

  &.warn { color: var(--pc-warn-700); }
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
}

.doc-empty {
  padding: 60px 0 40px;
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
