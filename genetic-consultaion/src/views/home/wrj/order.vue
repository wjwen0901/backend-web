<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>诠见康 · 维汝健</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">
          共 <strong>{{ totalPage }}</strong> 条
          <template v-if="hasSelection">
            <span class="meta-divider">·</span>
            已选 <strong>{{ multipleSelection.length }}</strong> 条
          </template>
        </div>
      </div>

      <div class="search-box">
        <el-form ref="searchForm" :model="searchForm" label-width="80px" size="small">
          <el-row :gutter="0">
            <el-col :span="6">
              <el-form-item label="医院">
                <el-autocomplete
                  class="width-100-p"
                  v-model="searchForm.hospitalName"
                  :fetch-suggestions="hospitalQuerySearch"
                  placeholder="输入医院名称"
                  :trigger-on-focus="false"
                  @select="hospitalHandleSelect"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="科室">
                <el-select class="width-100-p" v-model="searchForm.deptId" filterable clearable placeholder="全部科室" @change="handleSearch">
                  <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="患者">
                <el-input v-model="searchForm.patient" placeholder="样本编号 / 姓名" clearable @change="handleSearch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订单状态">
                <el-select class="width-100-p" v-model="searchForm.status" clearable placeholder="全部状态" @change="handleSearch">
                  <el-option v-for="opt in statusOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="0">
            <el-col :span="12">
              <el-form-item label="下单日期">
                <el-col :span="11">
                  <el-date-picker class="width-100-p" type="date" placeholder="开始日期" v-model="searchForm.startDate" @change="handleSearch"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">—</el-col>
                <el-col :span="11">
                  <el-date-picker class="width-100-p" type="date" placeholder="结束日期" v-model="searchForm.endDate" @change="handleSearch"></el-date-picker>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="opera-box">
        <el-button type="success" size="small" :disabled="!hasSelection" @click="confirmMoney">确认到账</el-button>
        <span class="opera-hint" v-if="!hasSelection">勾选订单后启用批量操作</span>
      </div>

      <el-table
        ref="table"
        :data="orderList"
        @selection-change="handleSelectionChange"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载订单中"
        style="width: 100%">
        <el-table-column type="selection" width="40" fixed="left"></el-table-column>
        <el-table-column label="下单时间" width="136" fixed="left">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="92" fixed="left">
          <template slot-scope="scope">
            <el-tag :type="brcaOrderStatusType(scope.row.status)" size="mini" disable-transitions>{{ scope.row.statusStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="受检者" width="160" fixed="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.patientName">
              {{ scope.row.patientName }}
              <span class="meta">({{ scope.row.patientPhone }})</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="更新时间" width="136">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付价格" width="108">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.payment !== undefined">¥{{ scope.row.payment }}</span>
            <el-tag v-if="scope.row.tid" type="info2" size="mini" disable-transitions class="ml-4">有赞</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sampleCode" label="样本编号" width="100"></el-table-column>
        <el-table-column prop="hospitalName" label="医院" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="科室" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="doctorName" label="医生" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="solutionName" label="检测项目" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="companyName" label="实验室" width="160" show-overflow-tooltip></el-table-column>
        <el-table-column label="服务人员" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.serviceName">
              {{ scope.row.serviceName }}
              <span class="meta">({{ scope.row.servicePhone }})</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="业务代表" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.salesmanName">
              {{ scope.row.salesmanName }}
              <span class="meta">({{ scope.row.salesmanPhone }})</span>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="toInformedDetail(scope.row.orderId, scope.row.expressCode, scope.row.expressId)">查看</el-button>
            <el-button size="mini" type="text" @click="toUploadInformed(scope.row.orderId)">知情</el-button>
            <el-button size="mini" type="text" @click="toUploadReport(scope.row.orderId)" v-if="canUploadBrcaReport(scope.row.status)">报告</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有匹配的订单</p>
            <p class="empty-hint">{{ emptyHint }}</p>
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

    <transition name="bulk-bar">
      <div class="bulk-bar" v-show="hasSelection">
        <span class="bulk-count">已选 <strong>{{ multipleSelection.length }}</strong> 条</span>
        <span class="bulk-divider"></span>
        <el-button type="success" size="small" @click="confirmMoney">确认到账</el-button>
        <el-button size="small" plain @click="clearSelection">取消选中</el-button>
      </div>
    </transition>
  </div>
</template>

<script>
import {
  formatDate,
  brcaOrderStatusType,
  canUploadBrcaReport,
  BRCA_ORDER_STATUS_OPTIONS
} from '@/utils/pc'

export default {
  name: 'WrjOrderList',
  data () {
    return {
      orderList: [],
      searchForm: {},
      pageNum: parseInt(window.sessionStorage.orderPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.orderPageSize) || 20,
      totalPage: 0,
      loading: false,
      multipleSelection: [],
      depts: [],
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      statusOptions: BRCA_ORDER_STATUS_OPTIONS
    }
  },
  computed: {
    hasSelection () { return this.multipleSelection.length > 0 },
    emptyHint () {
      return this.hasFilter ? '试试调整筛选条件，或清空后重新查询' : '暂无维汝健订单数据'
    },
    hasFilter () {
      const f = this.searchForm
      return !!(f.hospitalId || f.deptId || f.patient || f.status || f.startDate || f.endDate)
    }
  },
  filters: { formatDate },
  methods: {
    brcaOrderStatusType: brcaOrderStatusType,
    canUploadBrcaReport: canUploadBrcaReport,
    _initData () {
      this.loading = true
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
      }).catch(err => console.log(err))
      this.getData()
    },
    getData () {
      this.loading = true
      return this.axios.get('order/brca/page', {
        params: {
          userId: this.userId,
          hospitalId: this.searchForm.hospitalId,
          deptId: this.searchForm.deptId,
          patient: this.searchForm.patient,
          status: this.searchForm.status,
          startDate: this.searchForm.startDate,
          endDate: this.searchForm.endDate,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.orderList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('订单加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      window.sessionStorage.orderPageNum = 1
      this.getData()
    },
    handleSelectionChange (value) {
      this.multipleSelection = value
    },
    clearSelection () {
      if (this.$refs.table) this.$refs.table.clearSelection()
    },
    hospitalQuerySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString }
      }).then(res => {
        if (res.data.endRow === 0) {
          cb([])
        } else {
          cb(res.data.list.map(item => ({ value: item.name, id: item.id })))
        }
      }).catch(err => console.log(err))
    },
    hospitalHandleSelect (item) {
      this.searchForm.hospitalId = item.id
      this.handleSearch()
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.orderPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.orderPageNum = val
      this.getData()
    },
    toUploadInformed (id) {
      this.$router.push({ path: '/informed/upload', query: { orderId: id } })
    },
    toUploadReport (id) {
      this.$router.push({ path: '/report/upload', query: { orderId: id } })
    },
    toInformedDetail (id, expressCode, expressId) {
      this.$router.push({ path: '/order/' + id, query: { expressCode: expressCode, expressId: expressId } })
    },
    confirmMoney () {
      if (!this.multipleSelection.length) return
      const calls = this.multipleSelection.map(item =>
        this.axios.get('order/confirm', {
          params: { orderId: item.orderId, userId: this.userId }
        }).then(res => res.data === 'success').catch(() => false)
      )
      Promise.all(calls).then(results => {
        const ok = results.filter(Boolean).length
        const fail = results.length - ok
        if (fail === 0) {
          this.$message.success('已确认到账 ' + ok + ' 条')
        } else if (ok === 0) {
          this.$message.error('确认失败 ' + fail + ' 条，请重试')
        } else {
          this.$message.warning('成功 ' + ok + ' 条 / 失败 ' + fail + ' 条')
        }
        if (ok > 0) this.getData()
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

    strong {
      color: var(--pc-ink-800);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
    .meta-divider {
      margin: 0 8px;
      color: var(--pc-ink-300);
    }
  }
}

.search-box {
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 16px 16px 0 0;
  margin-bottom: 16px;
  background: var(--pc-ink-50);

  .line {
    text-align: center;
    color: var(--pc-ink-400);
  }
  .width-100-p { width: 100%; }
}

.opera-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;

  .opera-hint {
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
    margin-left: 4px;
  }
}

.bulk-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--pc-white);
  border-radius: 999px;
  box-shadow: var(--pc-sh-3);
  border: var(--pc-bd-hair);

  .bulk-count {
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-600);
    padding: 0 8px;
    strong {
      color: var(--pc-accent-600);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }
  .bulk-divider {
    width: 1px;
    height: 16px;
    background: var(--pc-ink-200);
    margin: 0 4px;
  }
}
.bulk-bar-enter-active, .bulk-bar-leave-active {
  transition: opacity var(--pc-dur-2) var(--pc-ease), transform var(--pc-dur-2) var(--pc-ease);
}
.bulk-bar-enter, .bulk-bar-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
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

.width-100-p { width: 100%; }
.ml-4 { margin-left: 4px; }

::v-deep .el-table {
  .meta {
    color: var(--pc-ink-400);
    font-size: var(--pc-fs-12);
    margin-left: 2px;
  }
  .num {
    font-variant-numeric: tabular-nums;
  }
  .cell .el-button--text {
    padding: 0 4px;
  }
}
</style>
