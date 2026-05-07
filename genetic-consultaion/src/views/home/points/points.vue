<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>积分管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位用户</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          class="grow"
          placeholder="搜索手机号"
          size="small"
          v-model="condition"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>

      <el-table
        :data="pointsList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载积分"
        style="width: 100%">
        <el-table-column prop="orderUserName" label="姓名" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.orderUserName">{{ scope.row.orderUserName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ scope.row.cellphone }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="积分余额" width="120">
          <template slot-scope="scope">
            <span class="num amount" :class="{ 'has-points': scope.row.amount > 0 }">{{ scope.row.amount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近使用时间" min-width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.lastTime" class="num">{{ scope.row.lastTime }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="viewDetail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无积分记录</p>
            <p class="empty-hint">客户下单后系统自动累计积分</p>
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
export default {
  name: 'PointsList',
  data () {
    return {
      condition: '',
      pointsList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('manage/token/list', {
        params: {
          condition: this.condition || undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        const data = res.data
        if (data && data.code === 200 && data.data) {
          this.pointsList = data.data.list || []
          this.pageSize = data.data.pageSize
          this.pageNum = data.data.pageNum
          this.totalPage = data.data.total
        } else {
          this.pointsList = []
          this.totalPage = 0
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('积分列表加载失败，请稍后重试')
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
    viewDetail (row) {
      this.$router.push({
        path: '/points/detail',
        query: { userId: row.userId }
      })
    }
  },
  mounted () {
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

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
  .amount {
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-400);
    &.has-points { color: var(--pc-primary-700); font-weight: 600; }
  }
}
</style>
