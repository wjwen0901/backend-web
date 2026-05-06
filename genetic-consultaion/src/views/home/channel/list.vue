<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item>渠道公司管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 家渠道公司</div>
      </div>

      <div class="opera-bar">
        <el-button size="small" type="primary" @click="toAdd">新增渠道公司</el-button>
        <el-input
          v-model="condition"
          placeholder="搜索公司名称"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="companyList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载渠道公司列表"
        style="width: 100%">
        <el-table-column prop="name" label="渠道公司名称" min-width="200" fixed="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="机构代码" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.code" class="num">{{ scope.row.code }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="注册地址" min-width="220" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.address">{{ scope.row.address }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="开户银行" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.bankAccount">
              {{ scope.row.bank }} <span class="meta">{{ scope.row.bankAccount }}</span>
            </span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" min-width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">
              {{ scope.row.fullName }} <span class="meta">{{ scope.row.cellphone }}</span>
            </span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.companyId)">编辑</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ condition ? '没有匹配的渠道公司' : '尚无渠道公司数据' }}</p>
            <p class="empty-hint">{{ condition ? '试试调整筛选条件，或清空后重新查询' : '新增渠道公司后会在这里显示' }}</p>
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
  name: 'ChannelCompanyList',
  data () {
    return {
      companyList: [],
      pageNum: parseInt(window.sessionStorage.firmPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.firmPageSize) || 20,
      totalPage: 0,
      loading: false,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      roleCode: window.localStorage.role
    }
  },
  filters: { formatDate },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('company/channel', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          condition: this.condition
        }
      }).then(res => {
        this.companyList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('渠道公司列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      window.sessionStorage.firmPageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.firmPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.firmPageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({ path: '/channel/edit/' + id })
    },
    toAdd () {
      this.$router.push({ name: 'ChannelAdd' })
    }
  },
  watch: {
    '$route' () {
      if (this.$route.params.type) this.getData()
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
