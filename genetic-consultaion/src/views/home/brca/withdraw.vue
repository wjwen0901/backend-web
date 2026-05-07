<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
          <el-breadcrumb-item>提现记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 笔提现</div>
      </div>

      <div class="opera-box">
        <el-input
          placeholder="搜索姓名 / 手机号"
          v-model="condition"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载提现记录"
        style="width: 100%">
        <el-table-column prop="fullName" label="姓名" width="100" fixed="left"></el-table-column>
        <el-table-column label="手机号" width="130">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.cellphone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="提现金额" width="120" align="right">
          <template slot-scope="scope">
            <span class="num amount">¥{{ scope.row.amount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template slot-scope="scope">
            <el-tag :type="statusType(scope.row.status)" size="mini" disable-transitions>{{ statusLabel(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="银行卡" min-width="280" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="meta">{{ scope.row.bank }}</span>
            <span class="num"> {{ scope.row.bankCardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核时间" width="140">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.checkTime">{{ scope.row.checkTime | formatDate }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="到账时间" width="140">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.incomeTime">{{ scope.row.incomeTime | formatDate }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="160" v-if="canOperate">
          <template slot-scope="scope">
            <el-button @click="toCheck(scope.row.id)" type="text" size="mini" v-if="scope.row.status === 0">审核</el-button>
            <el-button @click="toIncome(scope.row.id)" type="text" size="mini" v-if="scope.row.status === 1">确认到账</el-button>
            <span v-if="scope.row.status === 2" class="muted">已完成</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有提现记录</p>
            <p class="empty-hint">{{ condition ? '换个关键词试试' : '尚无提现申请 — 用户提现后会在这里显示' }}</p>
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
import { formatDate, BRCA_WITHDRAW_STATUS, statusOf } from '@/utils/pc'

export default {
  name: 'BrcaWithdraw',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    canOperate () { return this.userId !== 2222 }
  },
  filters: { formatDate },
  methods: {
    statusType (s) { return statusOf(BRCA_WITHDRAW_STATUS, s).type },
    statusLabel (s) { return statusOf(BRCA_WITHDRAW_STATUS, s).label },
    _initData () { this.getData() },
    getData () {
      this.loading = true
      this.axios.get('withdraw/all/page', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.condition }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('提现记录加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () { this.pageNum = 1; this.getData() },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() },
    toCheck (id) {
      this.$confirm('审核通过将发送短信、邮件给客户。请确认是否能在 3 天内到账。', '审核提示', {
        confirmButtonText: '审核通过',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.axios.get('withdraw/check/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('审核成功，已通知客户')
            this._initData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('审核失败，请稍后重试')
          })
      }).catch(() => {})
    },
    toIncome (id) {
      this.$confirm('确认将提现状态改为「已到账」？该操作会释放冻结金额。', '确认到账', {
        confirmButtonText: '确认到账',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('withdraw/income/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('已确认到账，冻结金额已释放')
            this._initData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('确认失败，请稍后重试')
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

.opera-box {
  display: flex;
  margin-bottom: 16px;
  .search-input {
    width: 320px;
    margin-left: auto;
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
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-right: 4px; }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
  .muted { color: var(--pc-ink-400); }
}
</style>
