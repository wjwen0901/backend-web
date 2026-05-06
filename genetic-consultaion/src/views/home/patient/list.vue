<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item>受检人管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位受检人</div>
      </div>

      <el-table
        :data="patientList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载受检人列表"
        style="width: 100%">
        <el-table-column label="受检人姓名" min-width="140" fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.row.truename">{{ scope.row.truename }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="联系电话" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ scope.row.cellphone }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.sex">{{ sexLabel(scope.row.sex) }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="所在地区" min-width="200">
          <template slot-scope="scope">
            <span v-if="scope.row.province">{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.county }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="样本编号" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.sample_code" class="num">{{ scope.row.sample_code }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="报告数量" width="100" align="right">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.reportNum || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.update_time | formatDate }}</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无受检人数据</p>
            <p class="empty-hint">用户下单后受检人会在这里显示</p>
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

const SEX_LABELS = { '1': '男', '2': '女', 'M': '男', 'F': '女', '男': '男', '女': '女' }

export default {
  name: 'PatientList',
  data () {
    return {
      patientList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      roleCode: window.localStorage.role
    }
  },
  filters: { formatDate },
  methods: {
    sexLabel (s) { return SEX_LABELS[s] || s },
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('patient/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId
        }
      }).then(res => {
        this.patientList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('受检人列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() }
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
