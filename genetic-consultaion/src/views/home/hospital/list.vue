<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item>医院管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 家医院</div>
      </div>

      <div class="opera-bar">
        <el-button
          v-if="canAdd"
          size="small"
          type="primary"
          @click="toAdd">新增医院</el-button>
        <span v-else></span>
        <el-input
          v-model="keywords"
          placeholder="搜索医院名称"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="hospitalList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载医院列表"
        style="width: 100%">
        <el-table-column prop="name" label="医院名称" min-width="240" fixed="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="所在地区" min-width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.province">{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.county }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="详细地址" min-width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.address">{{ scope.row.address }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="机构代码" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.standardCode" class="num">{{ scope.row.standardCode }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag :class="tagClassOf(stateLabel(scope.row.state))" size="mini" disable-transitions>
              {{ stateLabel(scope.row.state) }}
            </el-tag>
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
            <p class="empty-title">{{ hasFilter ? '没有匹配的医院' : '尚无医院数据' }}</p>
            <p class="empty-hint">{{ hasFilter ? '试试调整筛选条件，或清空后重新查询' : '新增医院后会在这里显示' }}</p>
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
import { formatDate, tagClassOf } from '@/utils/pc'

export default {
  name: 'HospitalList',
  data () {
    return {
      hospitalList: [],
      pageNum: parseInt(window.sessionStorage.hospitalPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.hospitalPageSize) || 20,
      totalPage: 0,
      loading: false,
      keywords: null,
      roleCode: window.localStorage.role,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    canAdd () {
      return this.roleCode === 'manager' || this.roleCode === 'jk-service'
    },
    hasFilter () {
      return !!this.keywords
    }
  },
  filters: { formatDate },
  methods: {
    tagClassOf,
    stateLabel (state) {
      return state === 0 ? '启用' : '已停用'
    },
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('hospital/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          keywords: this.keywords
        }
      }).then(res => {
        this.hospitalList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('医院列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      window.sessionStorage.hospitalPageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.hospitalPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.hospitalPageNum = val
      this.getData()
    },
    toDetail (id) {
      this.$router.push({ path: '/hospital/edit/' + id })
    },
    toAdd () {
      this.$router.push({ name: 'HospitalAdd' })
    },
    toDelete (id) {
      this.$confirm('确认删除该医院？删除后不可恢复', '删除医院', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('hospital/' + id, {
          params: { userId: this.userId }
        }).then(() => {
          this.$message.success('医院已删除')
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
