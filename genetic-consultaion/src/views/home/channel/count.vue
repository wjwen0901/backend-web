<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/channel' }">渠道公司管理</el-breadcrumb-item>
          <el-breadcrumb-item>渠道用户统计</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位渠道用户</div>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载渠道用户"
        style="width: 100%">
        <el-table-column label="姓名" width="180" fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">{{ scope.row.fullName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ scope.row.cellphone }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.email">{{ scope.row.email }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="上级用户" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.parentName">
              {{ scope.row.parentName }} <span class="meta">{{ scope.row.parentMobile }}</span>
            </span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="selectItem(scope.row.id, scope.row.fullName)">生成二维码</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无渠道用户</p>
            <p class="empty-hint">渠道商邀请下级用户后会在这里显示</p>
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

    <el-dialog title="选择产品生成二维码" :visible.sync="dialogFormVisible" width="640px">
      <div class="callout" v-if="selectedUser.fullName">
        <h5>渠道用户</h5>
        <p>{{ selectedUser.fullName }}</p>
      </div>
      <el-table
        :data="solutionList"
        size="mini"
        border
        v-loading="solutionLoading"
        element-loading-text="加载产品"
        style="width: 100%">
        <el-table-column label="产品名称" min-width="240" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="right">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="downloadCode(scope.row)">下载二维码</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">暂无可用产品</p>
          </div>
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'ChannelUserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      dialogFormVisible: false,
      solutionList: [],
      solutionLoading: false,
      selectedUser: {},
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
      this.axios.get('channel/user', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('渠道用户加载失败，请稍后重试')
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
    selectItem (id, fullName) {
      this.selectedUser = { id, fullName }
      this.solutionList = []
      this.dialogFormVisible = true
      this.solutionLoading = true
      this.axios.get('solution', { params: { userId: this.userId } })
        .then(res => {
          this.solutionList = res.data || []
        })
        .catch(err => {
          console.log(err)
          this.$message.error('产品列表加载失败')
        })
        .then(() => {
          this.solutionLoading = false
        })
    },
    downloadCode (sol) {
      this.axios.get('barcode/create/' + this.selectedUser.id, {
        params: {
          alias: sol.yzAlias,
          name: sol.name,
          period: sol.period ? (sol.period + '个工作日') : '',
          price: sol.directPrice,
          code: sol.code
        }
      }).then(res => {
        if (!res.data) {
          this.$message.error('二维码生成失败')
          return
        }
        const url = this.axios.defaults.baseURL + '/barcode/down?filename=' + res.data + '&Authorization=' + window.localStorage.token
        window.open(url)
      }).catch(err => {
        console.log(err)
        this.$message.error('二维码生成失败，请稍后重试')
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
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: var(--pc-r-4);

  h5 {
    margin: 0 0 6px;
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-info-700);
  }
  p {
    margin: 2px 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-700);
  }
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-left: 4px; }
  .muted { color: var(--pc-ink-400); }
}
</style>
