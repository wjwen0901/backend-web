<template>
  <div>
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
      </div>

      <el-table
        :data="informedList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载知情同意"
        style="width: 100%">
        <el-table-column prop="sampleCode" label="条码编号" width="160">
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
        <el-table-column prop="solutionName" label="检测项目" min-width="160" show-overflow-tooltip>
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
            <el-tag size="mini" :class="'el-tag--' + stateInfo(scope.row.state).type">
              {{ stateInfo(scope.row.state).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" type="text" size="mini">查看</el-button>
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
import { formatDate, INFORMED_STATE_MAP, statusOf } from '@/utils/pc'

export default {
  name: 'InformedList',
  data () {
    return {
      informedList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: '',
      loading: false,
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
        this.informedList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('知情同意加载失败，请稍后重试')
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
    stateInfo (state) {
      return statusOf(INFORMED_STATE_MAP, state, { type: '', label: '未知' })
    },
    toDetail (id) {
      this.$router.push({
        name: 'InformedEdit',
        params: { informedId: id }
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

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
