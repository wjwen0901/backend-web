<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>实验室排名</el-breadcrumb-item>
          <el-breadcrumb-item>评分标准</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ standardList.length }}</strong> 项评分标准</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          class="grow"
          placeholder="搜索评分标准名称"
          size="small"
          v-model="condition"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增评分标准</el-button>
      </div>

      <el-table
        :data="standardList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载评分标准"
        style="width: 100%">
        <el-table-column prop="id" label="编号" width="80">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="评分标准" min-width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.name">{{ scope.row.name }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="toPiece(scope.row.id, scope.row.name)">评分项维护</el-button>
            <el-button type="text" size="mini" class="danger" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无评分标准</p>
            <p class="empty-hint">点击右上角"新增"按钮创建第一项</p>
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
        :total="standardList.length">
      </el-pagination>
    </div>

    <el-dialog :title="standard.id === undefined ? '新增评分标准' : '编辑评分标准'" :visible.sync="dialogAddFormVisible" width="480px">
      <el-form ref="form" :model="standard" label-width="100px" size="small">
        <el-form-item label="标准名称">
          <el-input v-model="standard.name" placeholder="请输入评分标准名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="standard.id === undefined ? onAddSubmit() : onEditSubmit()">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="评分项维护" :visible.sync="dialogPieceFormVisible" width="720px">
      <div class="callout">
        <h5>评分项</h5>
        <p>{{ standard.name || '—' }}</p>
      </div>

      <el-table
        :data="standardPieces"
        size="mini"
        border
        v-loading="pieceLoading"
        style="width: 100%">
        <el-table-column label="评分标准" min-width="280">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.rule" placeholder="评分维度描述"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="分数" width="120">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.score" type="number" placeholder="分数"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="editPieace(scope.row)">保存</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无评分项</p>
            <p class="empty-hint">点击下方"新增评分项"添加</p>
          </div>
        </template>
      </el-table>

      <el-table
        v-if="addPieceStatus && addPieces.length"
        :data="addPieces"
        size="mini"
        border
        style="width: 100%; margin-top: 12px;">
        <el-table-column label="新评分标准" min-width="280">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.rule" placeholder="评分维度描述"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="分数" width="120">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.score" type="number" placeholder="分数"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="danger" @click="deletePieace(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="piece-actions">
        <el-button size="small" icon="el-icon-plus" @click="toAddPieace(standard.id)">新增评分项</el-button>
        <el-button v-if="addPieceStatus && addPieces.length" type="primary" size="small" :loading="pieceSubmitting" @click="addPieace()">提交新增</el-button>
      </div>

      <div slot="footer">
        <el-button @click="dialogPieceFormVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit } from '@/utils/pc'

export default {
  name: 'StandardList',
  data () {
    return {
      standardList: [],
      standardPieces: [],
      addPieces: [],
      standard: {},
      pageNum: 1,
      pageSize: 20,
      condition: '',
      dialogAddFormVisible: false,
      dialogPieceFormVisible: false,
      addPieceStatus: false,
      loading: false,
      submitting: false,
      pieceLoading: false,
      pieceSubmitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  filters: { formatDate },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('term', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition,
          userId: this.userId
        }
      }).then(res => {
        this.standardList = res.data || []
      }).catch(err => {
        console.log(err)
        this.$message.error('评分标准加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    search () {
      this.pageNum = 1
      this.getData()
    },
    toAdd () {
      this.standard = {}
      this.dialogAddFormVisible = true
    },
    toDetail (data) {
      this.standard = Object.assign({}, data)
      this.dialogAddFormVisible = true
    },
    onAddSubmit () {
      if (!this.standard.name) {
        this.$message.warning('请输入名称')
        return
      }
      this.submitting = true
      apiSubmit(this.axios, 'post', 'term', this.standard, { userId: this.userId })
        .then(() => {
          this.$message.success('已新增')
          this.dialogAddFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('新增失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    onEditSubmit () {
      this.submitting = true
      apiSubmit(this.axios, 'put', 'term', this.standard, { userId: this.userId })
        .then(() => {
          this.$message.success('已更新')
          this.dialogAddFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('更新失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    editPieace (piece) {
      apiSubmit(this.axios, 'put', 'term/piece', piece, { userId: this.userId })
        .then(() => {
          this.$message.success('已保存')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
    },
    toPiece (id, name) {
      this.standard = { id, name }
      this.standardPieces = []
      this.addPieces = []
      this.addPieceStatus = false
      this.dialogPieceFormVisible = true
      this.pieceLoading = true
      this.axios.get('term/piece/' + id, { params: { userId: this.userId } })
        .then(res => { this.standardPieces = res.data || [] })
        .catch(err => {
          console.log(err)
          this.$message.error('评分项加载失败')
        })
        .then(() => { this.pieceLoading = false })
    },
    toAddPieace (tid) {
      this.addPieceStatus = true
      this.addPieces.push({ termId: tid })
    },
    deletePieace (row) {
      const idx = this.addPieces.indexOf(row)
      if (idx > -1) this.addPieces.splice(idx, 1)
    },
    addPieace () {
      const valid = this.addPieces.filter(p => p.score !== undefined && p.rule !== undefined && p.score !== '' && p.rule !== '')
      if (!valid.length) {
        this.$message.warning('请填写完整后再提交')
        return
      }
      this.pieceSubmitting = true
      const tasks = valid.map(p => apiSubmit(this.axios, 'post', 'term/piece', p, { userId: this.userId }))
      Promise.all(tasks)
        .then(() => {
          this.$message.success('已新增 ' + valid.length + ' 项')
          this.addPieces = []
          this.addPieceStatus = false
          this.toPiece(this.standard.id, this.standard.name)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
        .then(() => { this.pieceSubmitting = false })
    },
    toDelete (id) {
      this.$confirm('确认删除此评分标准?', '删除评分标准', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('term/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('已删除')
            this.getData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('删除失败，请稍后重试')
          })
      }).catch(() => {})
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
      color: var(--pc-ink-800);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }
}

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

.piece-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.danger { color: var(--pc-neg-600); }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
