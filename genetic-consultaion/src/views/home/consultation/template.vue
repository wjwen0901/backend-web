<template>
  <div class="pc-page">
    <div class="consultation-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>互医管理</el-breadcrumb-item>
          <el-breadcrumb-item>话术模板</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 个模板</div>
      </div>

      <div class="opera-bar">
        <div class="filters">
          <el-select v-model="filterCategory" placeholder="产品类型" size="small" clearable @change="handleSearch">
            <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value"></el-option>
          </el-select>
          <el-select v-model="filterStatus" placeholder="状态" size="small" clearable @change="handleSearch">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="停用" :value="0"></el-option>
          </el-select>
          <span class="tip">匹配优先级：类型+关键词 &gt; 类型通配 &gt; 通用兜底；同级取 priority 最大</span>
        </div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增模板</el-button>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载话术模板"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="60">
          <template slot-scope="scope"><span class="num">{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column prop="name" label="模板名称" min-width="170" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品类型" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" :class="scope.row.productCategory ? '' : 'el-tag--warn'" disable-transitions>
              {{ categoryLabel(scope.row.productCategory) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="适应症关键词" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.indicationKeyword">{{ scope.row.indicationKeyword }}</span>
            <span v-else class="muted">通配</span>
          </template>
        </el-table-column>
        <el-table-column label="首条消息" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope"><span class="muted">{{ scope.row.greetingMsg }}</span></template>
        </el-table-column>
        <el-table-column label="优先级" width="70">
          <template slot-scope="scope"><span class="num">{{ scope.row.priority }}</span></template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            <el-tag size="mini" :class="scope.row.status === 1 ? 'el-tag--succ' : ''" disable-transitions>
              {{ scope.row.status === 1 ? '启用' : '已停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 1" type="text" size="mini" class="danger" @click="toggleStatus(scope.row, 0)">停用</el-button>
            <el-button v-else type="text" size="mini" @click="toggleStatus(scope.row, 1)">启用</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无话术模板</p>
            <p class="empty-hint">问诊对话由模板渲染生成，至少保留一条通用兜底模板（产品类型为空）</p>
          </div>
        </template>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>

    <el-dialog :title="tpl.id ? '编辑模板' : '新增模板'" :visible.sync="dialogVisible" width="860px" top="6vh">
      <div class="tpl-layout">
        <el-form ref="tplForm" :model="tpl" :rules="rules" label-width="100px" size="small" class="tpl-form">
          <el-form-item label="模板名称" prop="name">
            <el-input v-model="tpl.name" maxlength="128" placeholder="如：肿瘤检测问诊话术"></el-input>
          </el-form-item>
          <el-form-item label="产品类型">
            <el-select v-model="tpl.productCategory" placeholder="留空 = 通用兜底（最低优先级）" class="width-100-p" clearable>
              <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="适应症关键词">
            <el-input v-model="tpl.indicationKeyword" maxlength="128" placeholder="模糊匹配会话适应症，留空 = 通配"></el-input>
          </el-form-item>
          <el-form-item label="优先级">
            <el-input-number v-model="tpl.priority" :min="0" :max="999"></el-input-number>
            <span class="form-tip">数值越大越优先</span>
          </el-form-item>
          <el-form-item label="首条消息" prop="greetingMsg">
            <el-input v-model="tpl.greetingMsg" type="textarea" :rows="3" placeholder="医生收到送检信息后的首条回复"></el-input>
          </el-form-item>
          <el-form-item label="审核确认" prop="reviewMsg">
            <el-input v-model="tpl.reviewMsg" type="textarea" :rows="3" placeholder="审核结论与确认送检消息"></el-input>
          </el-form-item>
          <el-form-item label="安全提醒">
            <el-input v-model="tpl.safetyMsg" type="textarea" :rows="3" placeholder="选填，采样/寄送注意事项"></el-input>
          </el-form-item>
        </el-form>

        <!-- 变量预览：输入示例值实时渲染 -->
        <div class="preview-pane">
          <div class="preview-title">变量预览</div>
          <div class="preview-vars">
            <div v-for="v in varDefs" :key="v.key" class="var-row">
              <span class="var-name num">${{ '{' + v.key + '}' }}</span>
              <el-input v-model="sample[v.key]" size="mini"></el-input>
            </div>
          </div>
          <div class="preview-title sub">渲染效果</div>
          <div class="preview-chat">
            <div class="bubble" v-if="tpl.greetingMsg">{{ renderTpl(tpl.greetingMsg) }}</div>
            <div class="bubble" v-if="tpl.reviewMsg">{{ renderTpl(tpl.reviewMsg) }}</div>
            <div class="bubble" v-if="tpl.safetyMsg">{{ renderTpl(tpl.safetyMsg) }}</div>
            <div class="preview-empty" v-if="!tpl.greetingMsg && !tpl.reviewMsg">填写消息模板后在此预览</div>
          </div>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConsultationTemplate',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      filterCategory: '',
      filterStatus: '',
      submitting: false,
      dialogVisible: false,
      tpl: {},
      // general 是"通用类产品"的专属分类，≠ 留空的"通用兜底"（兜底对所有分类生效）
      categoryOptions: [
        { value: 'oncology', label: '肿瘤检测' },
        { value: 'genetic', label: '遗传检测' },
        { value: 'general', label: '通用类产品（general）' }
      ],
      varDefs: [
        { key: 'patientName' },
        { key: 'patientGender' },
        { key: 'patientAge' },
        { key: 'productName' },
        { key: 'indication' },
        { key: 'doctorName' }
      ],
      sample: {
        patientName: '王佳文',
        patientGender: '男',
        patientAge: '31',
        productName: 'Onco1021-MRD-T',
        indication: '肺腺癌',
        doctorName: '张医生'
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        greetingMsg: [{ required: true, message: '请输入首条消息', trigger: 'blur' }],
        reviewMsg: [{ required: true, message: '请输入审核确认消息', trigger: 'blur' }]
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('saas/consultation/template/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          productCategory: this.filterCategory || undefined,
          status: this.filterStatus === '' ? undefined : this.filterStatus
        }
      }).then(res => {
        const body = res.data || {}
        if (body.code !== 200) {
          this.$message.error(body.message || '加载失败')
          return
        }
        const page = body.data || {}
        this.list = page.list || []
        this.totalPage = page.total || 0
      }).catch(() => {
        this.$message.error('模板列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    categoryLabel (value) {
      if (!value) return '通用兜底'
      const hit = this.categoryOptions.find(c => c.value === value)
      return hit ? hit.label : value
    },
    renderTpl (text) {
      let result = text || ''
      this.varDefs.forEach(v => {
        result = result.split('${' + v.key + '}').join(this.sample[v.key] || '')
      })
      return result
    },
    toAdd () {
      this.tpl = { priority: 0, status: 1 }
      this.dialogVisible = true
    },
    toEdit (row) {
      this.tpl = Object.assign({}, row)
      this.dialogVisible = true
    },
    submitForm () {
      this.$refs.tplForm.validate(valid => {
        if (!valid) return
        this.submitting = true
        this.axios.post('saas/consultation/template/save', this.tpl).then(res => {
          const body = res.data || {}
          if (body.code === 200) {
            this.$message.success(this.tpl.id ? '模板已更新' : '模板已新增')
            this.dialogVisible = false
            this.getData()
          } else {
            this.$message.error(body.message || '保存失败')
          }
        }).catch(() => {
          this.$message.error('保存失败，请稍后重试')
        }).then(() => {
          this.submitting = false
        })
      })
    },
    toggleStatus (row, status) {
      this.axios.post('saas/consultation/template/save', { id: row.id, status: status }).then(res => {
        const body = res.data || {}
        if (body.code === 200) {
          this.$message.success(status === 1 ? '模板已启用' : '模板已停用')
          this.getData()
        } else {
          this.$message.error(body.message || '操作失败')
        }
      }).catch(() => {
        this.$message.error('操作失败，请稍后重试')
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.consultation-container {
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

.opera-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .filters {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .tip {
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.tpl-layout {
  display: flex;
  gap: 16px;

  .tpl-form {
    flex: 1;
    min-width: 0;
  }
}

.preview-pane {
  width: 300px;
  flex-shrink: 0;
  border-left: var(--pc-bd-hair);
  padding-left: 16px;

  .preview-title {
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-ink-800);
    margin-bottom: 8px;
    &.sub { margin-top: 14px; }
  }

  .var-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .var-name {
      width: 130px;
      flex-shrink: 0;
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-500);
    }
  }

  .preview-chat {
    .bubble {
      background: #f4f5f6;
      border-radius: var(--pc-r-4);
      padding: 8px 10px;
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-800);
      line-height: 1.6;
      margin-bottom: 8px;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .preview-empty {
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-400);
    }
  }
}

.form-tip {
  margin-left: 8px;
  font-size: var(--pc-fs-12);
  color: var(--pc-ink-400);
}

.width-100-p {
  width: 100%;
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

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
  .danger { color: var(--pc-neg-600); }
}
</style>
