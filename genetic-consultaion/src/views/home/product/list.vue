<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item>产品管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 个产品</div>
      </div>

      <div class="opera-bar">
        <el-button size="small" type="primary" @click="toAdd">新增产品</el-button>
        <el-input
          v-model="condition"
          placeholder="搜索产品名称 / 适用科室"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="solutionList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载产品列表"
        style="width: 100%">
        <el-table-column prop="id" label="编号" width="80">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="产品名称" min-width="220" fixed="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="产品编码" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.solution_code" class="num">{{ scope.row.solution_code }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="适用科室" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.deptName">{{ scope.row.deptName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="检测周期" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.period !== undefined && scope.row.period !== null" class="num">
              {{ scope.row.period }} <span class="meta">工作日</span>
            </span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.create_time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)">编辑</el-button>
            <el-button type="text" size="mini" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ condition ? '没有匹配的产品' : '尚无产品数据' }}</p>
            <p class="empty-hint">{{ condition ? '试试调整筛选条件，或清空后重新查询' : '新增产品后会在这里显示' }}</p>
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
import { formatDate } from '@/utils/pc'

export default {
  name: 'ProductList',
  data () {
    return {
      solutionList: [],
      pageNum: parseInt(window.sessionStorage.productPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.productPageSize) || 20,
      totalPage: 0,
      loading: false,
      condition: null,
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
      this.axios.get('solution/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          condition: this.condition
        }
      }).then(res => {
        this.solutionList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('产品列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      window.sessionStorage.productPageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.productPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.productPageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({ path: '/product/edit/' + id })
    },
    toAdd () {
      this.$router.push({ name: 'ProductAdd' })
    },
    toDelete (id) {
      this.$confirm('确认删除该产品？删除后不可恢复', '删除产品', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('solution/' + id, {
          params: { userId: this.userId }
        }).then(() => {
          this.$message.success('产品已删除')
          this.getData()
        }).catch(err => {
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

.opera-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .search-input {
    width: 320px;
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
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-left: 4px; }
  .muted { color: var(--pc-ink-400); }
}
</style>
