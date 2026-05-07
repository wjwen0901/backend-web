<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/rank/list' }">实验室排名</el-breadcrumb-item>
          <el-breadcrumb-item>{{ menuInfo }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="companyName">{{ companyName }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta" v-if="totalScore">
          <span>合计 <strong>{{ totalScore }}</strong> 分</span>
        </div>
      </div>

      <el-form ref="form" :model="formModel" label-width="100px" size="small" v-if="menuInfo === '新增'" class="company-pick">
        <el-form-item label="选择实验室">
          <el-select v-model="companyId" filterable placeholder="请选择" class="full-w" @change="onCompanyChange">
            <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <el-table
        :data="terms"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载评分项"
        style="width: 100%">
        <el-table-column prop="name" label="评分项" min-width="280" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.name">{{ scope.row.name }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="得分" width="120">
          <template slot-scope="scope">
            <span class="num score" :class="{ 'has-score': scope.row.score > 0 }">{{ scope.row.score || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.id, scope.row.name)">编辑评分</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ menuInfo === '新增' ? '请先选择实验室' : '尚无评分项' }}</p>
            <p class="empty-hint">{{ menuInfo === '新增' ? '选择后将显示评分标准列表' : '请到"评分标准"页面创建' }}</p>
          </div>
        </template>
      </el-table>
    </div>

    <el-dialog title="选择评分标准" :visible.sync="dialogPieceFormVisible" width="640px">
      <div class="callout">
        <h5>评分项</h5>
        <p>{{ standard.name || '—' }}</p>
      </div>

      <el-table
        ref="multipleTable"
        :data="standardPieces"
        size="mini"
        border
        v-loading="pieceLoading"
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="rule" label="评分标准" min-width="280" show-overflow-tooltip></el-table-column>
        <el-table-column prop="score" label="分数" width="100">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.score }}</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无评分标准</p>
            <p class="empty-hint">先到"评分标准"页面维护</p>
          </div>
        </template>
      </el-table>

      <div slot="footer">
        <el-button @click="dialogPieceFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="pieceSubmit(standard.id)">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { apiSubmit } from '@/utils/pc'

export default {
  name: 'CompanyRank',
  data () {
    return {
      menuInfo: this.$route.params.id === undefined ? '新增' : '编辑',
      companyName: this.$route.query.name || '',
      formModel: {},
      terms: [],
      standard: {},
      standardPieces: [],
      pieceIds: [],
      multipleSelection: [],
      companyList: [],
      companyId: null,
      dialogPieceFormVisible: false,
      loading: false,
      pieceLoading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    totalScore () {
      return this.terms.reduce((acc, t) => acc + (parseInt(t.score) || 0), 0)
    }
  },
  methods: {
    _initData () {
      const editId = this.$route.params.id
      if (editId !== undefined || this.companyId) {
        this.companyId = editId !== undefined ? editId : this.companyId
        this.loadTermsWithScore()
      } else {
        this.loadTermsAndCompanies()
      }
    },
    loadTermsWithScore () {
      this.loading = true
      const termsPromise = this.axios.get('term', { params: { userId: this.userId } })
        .then(res => res.data || [])
        .catch(err => {
          console.log(err)
          this.$message.error('评分项加载失败')
          return []
        })

      const assessPromise = this.axios.get('assess/company/' + this.companyId, { params: { userId: this.userId } })
        .then(res => res.data || [])
        .catch(err => {
          console.log(err)
          return []
        })

      Promise.all([termsPromise, assessPromise]).then(([rawTerms, scoreList]) => {
        this.terms = rawTerms.map(term => {
          const matched = scoreList.find(s => s.termId === term.id)
          return Object.assign({}, term, { score: matched ? matched.score : 0 })
        })
        this.loading = false
      })
    },
    loadTermsAndCompanies () {
      this.loading = true
      const termsPromise = this.axios.get('term', { params: { userId: this.userId } })
        .then(res => { this.terms = res.data || [] })
        .catch(err => console.log(err))

      const companyPromise = this.axios.get('company', { params: { userId: this.userId } })
        .then(res => { this.companyList = res.data || [] })
        .catch(err => console.log(err))

      Promise.all([termsPromise, companyPromise]).then(() => { this.loading = false })
    },
    onCompanyChange (id) {
      this.companyId = id
      const matched = this.companyList.find(c => c.id === id)
      this.companyName = matched ? matched.name : ''
      this.loadTermsWithScore()
    },
    toDetail (termId, name) {
      if (!this.companyId) {
        this.$message.warning('请先选择实验室')
        return
      }
      this.standard = { id: termId, name }
      this.standardPieces = []
      this.pieceIds = []
      this.multipleSelection = []
      this.dialogPieceFormVisible = true
      this.pieceLoading = true

      const piecesPromise = this.axios.get('term/piece/' + termId)
        .then(res => res.data || [])
        .catch(err => {
          console.log(err)
          return []
        })

      const assessPiecePromise = this.axios.get('assess/piece', {
        params: { termId, companyId: this.companyId, userId: this.userId }
      })
        .then(res => (res.data || []).map(p => p.id))
        .catch(err => {
          console.log(err)
          return []
        })

      Promise.all([piecesPromise, assessPiecePromise]).then(([pieces, ids]) => {
        this.standardPieces = pieces
        this.pieceIds = ids
        this.pieceLoading = false
        this.$nextTick(() => {
          if (!this.$refs.multipleTable) return
          this.standardPieces.forEach(row => {
            if (ids.includes(row.id)) {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            }
          })
        })
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    pieceSubmit (termId) {
      const editPieceIds = this.multipleSelection.map(p => p.id)
      const isEdit = this.$route.params.id !== undefined
      const payload = isEdit
        ? { companyId: parseInt(this.$route.params.id), editPieceIds: [{ termId, pieceIds: editPieceIds }] }
        : { companyId: this.companyId, uploadPieceIds: editPieceIds }
      const method = isEdit ? 'put' : 'post'

      this.submitting = true
      apiSubmit(this.axios, method, 'assess/company', payload, { userId: this.userId })
        .then(() => {
          this.$message.success('已保存')
          this.dialogPieceFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
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
    strong {
      color: var(--pc-primary-700);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      font-size: var(--pc-fs-16);
    }
  }
}

.company-pick {
  background: var(--pc-ink-50);
  padding: 14px 16px 0;
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  margin-bottom: 16px;
}

.full-w { width: 100%; }

.empty {
  padding: 40px 0 24px;
  text-align: center;
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

.callout {
  background: var(--pc-info-100);
  padding: 10px 14px;
  margin-bottom: 12px;
  border-radius: var(--pc-r-4);

  h5 {
    margin: 0 0 4px;
    font-size: var(--pc-fs-12);
    font-weight: 500;
    color: var(--pc-info-700);
  }
  p {
    margin: 0;
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-800);
    word-break: break-all;
  }
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
  .score {
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-400);
    &.has-score { color: var(--pc-primary-700); font-weight: 600; }
  }
}
</style>
