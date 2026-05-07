<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>一体机管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ printerList.length }}</strong> 台一体机</div>
      </div>

      <div class="pc-toolbar">
        <div class="grow"></div>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增一体机</el-button>
      </div>

      <el-table
        :data="printerList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载一体机"
        style="width: 100%">
        <el-table-column prop="number" label="一体机编号" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.number" class="num">{{ scope.row.number }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="printId" label="打印机编号" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.printId" class="num">{{ scope.row.printId }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="投放地址" min-width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.address">{{ scope.row.address }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.create_time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toPrinterCode(scope.row.id)">打印二维码</el-button>
            <el-button type="text" size="mini" @click="toDetail(scope.row)">编辑</el-button>
            <el-button type="text" size="mini" class="danger" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无一体机</p>
            <p class="empty-hint">点击右上角"新增一体机"绑定打印机</p>
          </div>
        </template>
      </el-table>
    </div>

    <el-dialog title="新增一体机" :visible.sync="dialogAddFormVisible" width="480px">
      <el-form :model="addPrinter" label-width="120px" size="small">
        <el-form-item label="打印机编号">
          <el-input v-model="addPrinter.printId" placeholder="请输入打印机编号"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogAddFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onAddSubmit">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑一体机" :visible.sync="dialogEditFormVisible" width="480px">
      <el-form :model="printer" label-width="120px" size="small">
        <el-form-item label="打印机编号">
          <el-input v-model="printer.printId" placeholder="请输入打印机编号"></el-input>
        </el-form-item>
        <el-form-item label="投放地址">
          <el-input v-model="printer.address" placeholder="请输入投放地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="onEditSubmit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit } from '@/utils/pc'

export default {
  name: 'PrinterList',
  data () {
    return {
      printerList: [],
      printer: {},
      addPrinter: {},
      dialogAddFormVisible: false,
      dialogEditFormVisible: false,
      loading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('wechatPrt/printer', { params: { userId: this.userId } })
        .then(res => { this.printerList = res.data || [] })
        .catch(err => {
          console.log(err)
          this.$message.error('一体机列表加载失败，请稍后重试')
        })
        .then(() => { this.loading = false })
    },
    toAdd () {
      this.addPrinter = {}
      this.dialogAddFormVisible = true
    },
    toDetail (printer) {
      this.printer = Object.assign({}, printer)
      this.dialogEditFormVisible = true
    },
    onAddSubmit () {
      if (!this.addPrinter.printId) {
        this.$message.warning('请输入打印机编号')
        return
      }
      this.submitting = true
      apiSubmit(this.axios, 'post', 'wechatPrt/printer', this.addPrinter, { userId: this.userId })
        .then(() => {
          this.$message.success('已新增')
          this.dialogAddFormVisible = false
          this.getData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('新增失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    onEditSubmit () {
      this.submitting = true
      apiSubmit(this.axios, 'put', 'wechatPrt/printer', this.printer, { userId: this.userId })
        .then(() => {
          this.$message.success('已更新')
          this.dialogEditFormVisible = false
          this.getData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('更新失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    toDelete (id) {
      this.$confirm('确定删除此一体机?', '删除一体机', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('wechatPrt/printer/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('已删除')
            this.getData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('删除失败，请稍后重试')
          })
      }).catch(() => {})
    },
    toPrinterCode (id) {
      this.axios.get('wechatPrt/barcode', { params: { printerId: id, userId: this.userId } })
        .then(res => {
          if (!res.data) {
            this.$message.error('二维码生成失败')
            return
          }
          window.open(this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('二维码生成失败，请稍后重试')
        })
    }
  },
  created () {
    this.getData()
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

.danger { color: var(--pc-neg-600); }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
