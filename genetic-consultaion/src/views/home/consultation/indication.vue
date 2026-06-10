<template>
  <div class="pc-page">
    <div class="consultation-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>互医管理</el-breadcrumb-item>
          <el-breadcrumb-item>适应症配置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 条标签</div>
      </div>

      <div class="opera-bar">
        <div class="filters">
          <el-select
            v-model="filterProductId"
            placeholder="按产品筛选"
            size="small"
            clearable
            filterable
            class="product-select"
            @change="handleSearch">
            <el-option label="默认标签集（product_id = 0）" :value="0"></el-option>
            <el-option v-for="p in products" :key="p.id" :label="p.name + '（#' + p.id + '）'" :value="p.id"></el-option>
          </el-select>
          <span class="tip">产品未配置专属标签时，C 端自动回退默认标签集（D3）</span>
        </div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增标签</el-button>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载适应症配置"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="70">
          <template slot-scope="scope"><span class="num">{{ scope.row.id }}</span></template>
        </el-table-column>
        <el-table-column label="归属产品" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.productId === 0" size="mini" class="el-tag--warn" disable-transitions>默认标签集</el-tag>
            <span v-else>{{ productLabel(scope.row.productId) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="indication" label="适应症 / 疾病标签" min-width="160"></el-table-column>
        <el-table-column label="排序" width="80">
          <template slot-scope="scope"><span class="num">{{ scope.row.sortOrder }}</span></template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope"><span class="num">{{ scope.row.createTime | formatDate }}</span></template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" class="danger" @click="toDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ filterProductId !== '' && filterProductId !== null ? '该产品暂无专属标签' : '尚无适应症配置' }}</p>
            <p class="empty-hint">未配置专属标签的产品，C 端将展示默认标签集</p>
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

    <el-dialog :title="indication.id ? '编辑标签' : '新增标签'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="indicationForm" :model="indication" :rules="rules" label-width="100px" size="small">
        <el-form-item label="归属产品" prop="productId">
          <el-select v-model="indication.productId" placeholder="选择产品或默认集" class="width-100-p" filterable>
            <el-option label="默认标签集（product_id = 0）" :value="0"></el-option>
            <el-option v-for="p in products" :key="p.id" :label="p.name + '（#' + p.id + '）'" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适应症名称" prop="indication">
          <el-input v-model="indication.indication" maxlength="64" placeholder="如：肺腺癌 / 遵医嘱检测"></el-input>
        </el-form-item>
        <el-form-item label="排序权重">
          <el-input-number v-model="indication.sortOrder" :min="0" :max="999"></el-input-number>
          <span class="form-tip">升序展示，数值小的在前</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'ConsultationIndication',
  data () {
    return {
      list: [],
      products: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      filterProductId: '',
      submitting: false,
      dialogVisible: false,
      indication: {},
      rules: {
        productId: [{ required: true, message: '请选择归属产品', trigger: 'change' }],
        indication: [{ required: true, message: '请输入适应症名称', trigger: 'blur' }]
      }
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('saas/consultation/indication/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          productId: this.filterProductId === '' || this.filterProductId === null ? undefined : this.filterProductId
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
        this.$message.error('适应症列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    getProducts () {
      this.axios.get('product/allProduct').then(res => {
        this.products = res.data || []
      }).catch(() => {
        this.products = []
      })
    },
    productLabel (productId) {
      const hit = this.products.find(p => p.id === productId)
      return hit ? hit.name + '（#' + productId + '）' : '产品 #' + productId
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
    toAdd () {
      this.indication = {
        productId: this.filterProductId === '' || this.filterProductId === null ? 0 : this.filterProductId,
        sortOrder: 0
      }
      this.dialogVisible = true
    },
    toEdit (row) {
      this.indication = Object.assign({}, row)
      this.dialogVisible = true
    },
    submitForm () {
      this.$refs.indicationForm.validate(valid => {
        if (!valid) return
        this.submitting = true
        this.axios.post('saas/consultation/indication/save', this.indication).then(res => {
          const body = res.data || {}
          if (body.code === 200) {
            this.$message.success(this.indication.id ? '标签已更新' : '标签已新增')
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
    toDelete (row) {
      this.$confirm('确认删除标签「' + row.indication + '」？', '删除适应症', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('saas/consultation/indication/' + row.id).then(res => {
          const body = res.data || {}
          if (body.code === 200) {
            this.$message.success('标签已删除')
            this.getData()
          } else {
            this.$message.error(body.message || '删除失败')
          }
        }).catch(() => {
          this.$message.error('删除失败，请稍后重试')
        })
      }).catch(() => {})
    }
  },
  created () {
    this.getProducts()
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
  .product-select {
    width: 300px;
  }
  .tip {
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
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
  .danger { color: var(--pc-neg-600); }
}
</style>
