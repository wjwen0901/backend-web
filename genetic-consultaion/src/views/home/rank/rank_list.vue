<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>实验室排名</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ rankList.length }}</strong> 个实验室</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          class="grow"
          placeholder="搜索实验室名称"
          size="small"
          v-model="condition"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增评分</el-button>
      </div>

      <el-table
        :data="rankList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载实验室排名"
        style="width: 100%">
        <el-table-column prop="companyId" label="编号" width="100">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.companyId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="companyName" label="实验室名称" min-width="280" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{ scope.row.companyName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="总评分" width="120">
          <template slot-scope="scope">
            <span class="num score" :class="{ 'has-score': scope.row.totalScore > 0 }">{{ scope.row.totalScore || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.companyId, scope.row.companyName)">编辑评分</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无实验室评分</p>
            <p class="empty-hint">点击右上角"新增评分"添加实验室</p>
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
        :total="rankList.length">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'RankList',
  data () {
    return {
      rankList: [],
      pageNum: 1,
      pageSize: 20,
      condition: '',
      loading: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('assess/total', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId }
      }).then(res => {
        this.rankList = res.data || []
      }).catch(err => {
        console.log(err)
        this.$message.error('实验室排名加载失败，请稍后重试')
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
    toDetail (id, name) {
      this.$router.push({ path: '/rank/edit/' + id, query: { name } })
    },
    toAdd () {
      this.$router.push({ path: '/rank/add' })
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
