<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>知情管理</el-breadcrumb-item>
          <el-breadcrumb-item>知情列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 份知情同意</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          placeholder="搜索条码编号 / 受检者姓名 / 手机号"
          size="small"
          class="grow"
          v-model="condition"
          @keyup.enter.native="search"
          clearable>
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button
          type="warning"
          size="small"
          :disabled="!multipleSelection.length"
          :loading="exporting"
          @click="toExport">导出选中 ({{ multipleSelection.length }})</el-button>
      </div>

      <div
        v-show="tableScrollTopVisible"
        ref="tableScrollTop"
        class="table-scroll-top"
        @scroll="handleTopScroll">
        <div class="table-scroll-top__inner" :style="{ width: tableScrollWidth + 'px' }"></div>
      </div>

      <el-table
        ref="informedTable"
        @selection-change="handleSelectionChange"
        @header-dragend="handleHeaderDragend"
        :data="informedList"
        size="small"
        border
        v-loading="loading"
        element-loading-text="加载知情同意"
        style="width: 100%">
        <el-table-column fixed type="selection" width="40"></el-table-column>
        <el-table-column prop="sampleCode" label="条码编号" :width="columnWidths.sampleCode">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.sampleCode || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="truename" label="受检者" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.truename">{{ scope.row.truename }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ scope.row.cellphone }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="solutionName" label="检测项目" :width="columnWidths.solutionName" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.solutionName">{{ scope.row.solutionName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="实验室" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{ scope.row.companyName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="group" label="分组" width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.group">{{ scope.row.group }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="fullName" label="上传人" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">{{ scope.row.fullName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" width="150">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="stateInfo(scope.row.state)" size="mini" :class="'el-tag--' + stateInfo(scope.row.state).type">
              {{ stateInfo(scope.row.state).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="mini">编辑</el-button>
            <el-button @click="toAllDetail(scope.row)" type="text" size="mini">病理信息</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无知情同意</p>
            <p class="empty-hint">客户上传知情同意书后会显示在这里</p>
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
    </div>
  </div>
</template>

<script>
import { formatDate, INFORMED_STATE_MAP, downloadBlob, dateStr } from '@/utils/pc'
import { readColumnWidths, saveColumnWidth } from '@/utils/table-column-widths'
import { limitPageRows } from '@/utils/pagination'

const COLUMN_WIDTH_STORAGE_KEY = 'pc:data-collect-informed-list:columns:v1'
const DEFAULT_COLUMN_WIDTHS = {
  sampleCode: 120,
  solutionName: 230
}

export default {
  name: 'DataCollectInformedList',
  data () {
    return {
      informedList: [],
      multipleSelection: [],
      pageNum: window.sessionStorage.informedPageNum === undefined ? 1 : parseInt(window.sessionStorage.informedPageNum),
      pageSize: window.sessionStorage.informedPageSize === undefined ? 20 : parseInt(window.sessionStorage.informedPageSize),
      totalPage: 0,
      condition: '',
      loading: false,
      exporting: false,
      columnWidths: readColumnWidths(window.localStorage, COLUMN_WIDTH_STORAGE_KEY, DEFAULT_COLUMN_WIDTHS),
      tableScrollWidth: 0,
      tableScrollTopVisible: false,
      tableBodyWrapper: null,
      tableResizeHandler: null,
      syncingTableScroll: false,
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
      this.axios.get('informed', {
        params: {
          userId: this.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          searchCondition: this.condition
        }
      }).then(res => {
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        // TODO(待联调通过后撤除): 后端 selectAllAndUser 已去除 1:N join，
        // QA 真机验证通过后改回 this.informedList = res.data.list || []
        this.informedList = limitPageRows(res.data.list, this.pageSize)
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('知情同意加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
        this.scheduleTableScrollSync()
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.informedPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.informedPageNum = val
      this.getData()
    },
    search () {
      this.pageNum = 1
      this.getData()
    },
    stateInfo (state) {
      return INFORMED_STATE_MAP[state]
    },
    toDetail (row) {
      this.$router.push({
        path: '/informed/edit/' + row.id,
        query: {
          informedId: row.id,
          groupId: row.groupId,
          sampleCode: row.sampleCode,
          orderId: row.orderId,
          solutionId: row.solutionId,
          fileId: row.id,
          orderNo: row.orderNo
        }
      })
      if (typeof _hmt !== 'undefined') {
        _hmt.push(['_trackEvent', '知情同意', '编辑', 'informedId', row.id])
      }
    },
    toAllDetail (row) {
      this.$router.push({
        name: 'InformedAll',
        params: { sampleNo: row.sampleCode, orderId: row.orderId }
      })
    },
    toExport () {
      if (!this.multipleSelection.length) return
      this.exporting = true
      const informedIds = this.multipleSelection.map(item => item.id).join(',')
      this.axios.get('informed/export', {
        params: { informedIds, userId: this.userId },
        responseType: 'blob'
      }).then(response => {
        downloadBlob(response.data, '知情同意-' + dateStr() + '.xls')
      }).catch(err => {
        console.log(err)
        this.$message.error('导出失败，请稍后重试')
      }).then(() => {
        this.exporting = false
      })
    },
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
    handleHeaderDragend (newWidth, oldWidth, column) {
      const prop = column && column.property
      this.columnWidths = saveColumnWidth(window.localStorage, COLUMN_WIDTH_STORAGE_KEY, this.columnWidths, prop, newWidth, DEFAULT_COLUMN_WIDTHS)
      this.scheduleTableScrollSync()
    },
    getTableBodyWrapper () {
      const table = this.$refs.informedTable && this.$refs.informedTable.$el
      return table ? table.querySelector('.el-table__body-wrapper') : null
    },
    bindTableBodyScroll () {
      const body = this.getTableBodyWrapper()
      if (this.tableBodyWrapper === body) return
      if (this.tableBodyWrapper) {
        this.tableBodyWrapper.removeEventListener('scroll', this.handleTableBodyScroll)
      }
      this.tableBodyWrapper = body
      if (body) body.addEventListener('scroll', this.handleTableBodyScroll)
    },
    scheduleTableScrollSync () {
      this.$nextTick(() => {
        this.bindTableBodyScroll()
        this.syncTableScrollMetrics()
      })
    },
    syncTableScrollMetrics () {
      const top = this.$refs.tableScrollTop
      const body = this.getTableBodyWrapper()
      if (!top || !body) return
      this.tableScrollWidth = body.scrollWidth
      this.tableScrollTopVisible = body.scrollWidth > body.clientWidth
      top.scrollLeft = body.scrollLeft
    },
    handleTopScroll () {
      const top = this.$refs.tableScrollTop
      const body = this.getTableBodyWrapper()
      if (!top || !body || this.syncingTableScroll || body.scrollLeft === top.scrollLeft) return
      this.syncingTableScroll = true
      body.scrollLeft = top.scrollLeft
      this.syncingTableScroll = false
    },
    handleTableBodyScroll () {
      const top = this.$refs.tableScrollTop
      const body = this.getTableBodyWrapper()
      if (!top || !body || this.syncingTableScroll || top.scrollLeft === body.scrollLeft) return
      this.syncingTableScroll = true
      top.scrollLeft = body.scrollLeft
      this.syncingTableScroll = false
    }
  },
  created () {
    this._initData()
  },
  mounted () {
    this.tableResizeHandler = () => this.scheduleTableScrollSync()
    window.addEventListener('resize', this.tableResizeHandler)
    this.scheduleTableScrollSync()
  },
  beforeDestroy () {
    if (this.tableBodyWrapper) {
      this.tableBodyWrapper.removeEventListener('scroll', this.handleTableBodyScroll)
    }
    if (this.tableResizeHandler) {
      window.removeEventListener('resize', this.tableResizeHandler)
    }
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

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}

.table-scroll-top {
  height: 14px;
  margin-bottom: 4px;
  overflow-x: auto;
  overflow-y: hidden;
}

.table-scroll-top__inner {
  height: 1px;
}
</style>
