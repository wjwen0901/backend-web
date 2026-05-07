<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/points' }">积分管理</el-breadcrumb-item>
          <el-breadcrumb-item>积分详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 条积分明细</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          class="grow"
          placeholder="搜索订单号"
          size="small"
          v-model="condition"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-radio-group v-model="radio" size="small" @change="onGroupChange">
          <el-radio-button label="orderNo">按订单号</el-radio-button>
          <el-radio-button label="patientName">按患者姓名</el-radio-button>
        </el-radio-group>
      </div>

      <div v-loading="loading" element-loading-text="加载积分明细">
        <div class="group-stack" v-if="groupedPoints.length">
          <div v-for="item in groupedPoints" :key="item.groupKey" class="group-panel">
            <div class="group-header">
              <div class="group-title">
                <span class="group-tag">{{ radio === 'orderNo' ? '订单号' : '患者' }}</span>
                <span class="group-key num">{{ item.groupKey }}</span>
                <span v-if="radio === 'orderNo' && item.items[0].itemTitle" class="group-extra">{{ item.items[0].itemTitle }}</span>
                <span class="group-count">{{ item.items.length }} 条</span>
              </div>
              <el-button type="text" size="mini" @click="toggleCollapse(item.groupKey)">
                {{ collapsedGroups[item.groupKey] ? '展开' : '折叠' }}
              </el-button>
            </div>
            <el-table
              v-show="!collapsedGroups[item.groupKey]"
              :data="item.items"
              size="mini"
              border
              style="width: 100%">
              <el-table-column prop="itemTitle" label="订单" min-width="280" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.itemTitle">{{ scope.row.itemTitle }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="orderNo" label="订单编号" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.orderNo" class="num">{{ scope.row.orderNo }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="sampleCode" label="样本编码" width="180">
                <template slot-scope="scope">
                  <span v-if="scope.row.sampleCode" class="num">{{ scope.row.sampleCode }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="userName" label="用户" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.userName">{{ scope.row.userName }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="patientName" label="患者" width="100">
                <template slot-scope="scope">
                  <span v-if="scope.row.patientName">{{ scope.row.patientName }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="积分余额" width="100">
                <template slot-scope="scope">
                  <span class="num">{{ scope.row.amount || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="tokenNum" label="分配积分" width="100">
                <template slot-scope="scope">
                  <span class="num token-num" :class="{ 'has-token': scope.row.tokenNum > 0 }">{{ scope.row.tokenNum || 0 }}</span>
                </template>
              </el-table-column>
              <el-table-column label="分配时间" width="160">
                <template slot-scope="scope">
                  <span v-if="scope.row.tokenTime" class="num">{{ formatTokenTime(scope.row.tokenTime) }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column prop="description" label="描述" min-width="160" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.description">{{ scope.row.description }}</span>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="120">
                <template slot-scope="scope">
                  <el-button v-if="scope.row.unable !== 1" type="text" size="mini" @click="openTokenDialog(scope.row)">修改积分</el-button>
                  <span v-else class="muted">—</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div v-else-if="!loading" class="empty">
          <p class="empty-title">尚无积分明细</p>
          <p class="empty-hint">该用户暂无积分变动记录</p>
        </div>
      </div>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100, 150, 2000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>

    <el-dialog title="修改积分" :visible.sync="visiableToken" width="480px">
      <el-form :model="tokenForm" label-width="100px" size="small">
        <el-form-item label="订单编号">
          <span class="num">{{ tokenForm.orderNo || '—' }}</span>
        </el-form-item>
        <el-form-item label="用户">
          <span>{{ tokenForm.userName || '—' }}</span>
        </el-form-item>
        <el-form-item label="原积分">
          <span class="num">{{ tokenForm.oldTokenNum || '—' }}</span>
        </el-form-item>
        <el-form-item label="新积分">
          <el-input-number size="small" v-model="tokenForm.newTokenNum" :min="0" placeholder="请输入积分"></el-input-number>
        </el-form-item>
        <el-form-item label="描述">
          <el-input size="small" v-model="tokenForm.description" placeholder="分配原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="visiableToken = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="allocateToken">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PointsDetail',
  data () {
    return {
      visiableToken: false,
      collapsedGroups: {},
      tokenForm: {
        userId: '',
        newTokenNum: '',
        oldTokenNum: '',
        orderId: '',
        description: '重新分配积分',
        orderNo: '',
        userName: '',
        tokenDetailId: ''
      },
      radio: 'orderNo',
      pointsDetailList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      condition: '',
      loading: false,
      submitting: false,
      query_user_id: this.$route.query.userId ? this.$route.query.userId : null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    groupedPoints () {
      const groupKey = this.radio === 'patientName' ? 'patientName' : 'orderNo'
      const groups = {}
      this.pointsDetailList.forEach(item => {
        const key = item[groupKey] || '未知'
        if (!groups[key]) groups[key] = []
        groups[key].push(item)
      })
      return Object.keys(groups).map(k => ({ groupKey: k, items: groups[k] }))
    }
  },
  methods: {
    formatTokenTime (ts) {
      return ts ? new Date(ts).toLocaleString() : ''
    },
    onGroupChange () {
      this.collapsedGroups = {}
    },
    toggleCollapse (groupKey) {
      this.$set(this.collapsedGroups, groupKey, !this.collapsedGroups[groupKey])
    },
    openTokenDialog (item) {
      this.tokenForm = {
        userId: item.userId || '',
        newTokenNum: '',
        oldTokenNum: item.tokenNum,
        orderId: item.orderId || '',
        description: '重新分配积分',
        orderNo: item.orderNo || '',
        userName: item.userName || '',
        tokenDetailId: item.tokenDetailId || ''
      }
      this.visiableToken = true
    },
    allocateToken () {
      if (this.tokenForm.newTokenNum === '' || this.tokenForm.newTokenNum === null) {
        this.$message.warning('请输入新积分数量')
        return
      }
      this.submitting = true
      this.axios.post('/manage/token/change', {
        userId: this.tokenForm.userId,
        newTokenNum: this.tokenForm.newTokenNum,
        oldTokenNum: this.tokenForm.oldTokenNum,
        orderId: this.tokenForm.orderId,
        description: this.tokenForm.description,
        tokenDetailId: this.tokenForm.tokenDetailId
      }).then(res => {
        if (res.data && res.data.data === 'sucess') {
          this.$message.success('已修改')
          this.visiableToken = false
          this.getData()
        } else {
          this.$message.warning('修改失败')
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败，请稍后重试')
      }).then(() => {
        this.submitting = false
      })
    },
    getData () {
      if (!this.query_user_id) {
        this.$message.error('数据错误，请返回重试')
        return
      }
      this.loading = true
      this.axios.get('manage/token/list/' + this.query_user_id, {
        params: {
          condition: this.condition || undefined,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(result => {
        const res = result.data
        if (res && res.data) {
          this.pointsDetailList = res.data.list || []
          this.pageSize = res.data.pageSize
          this.pageNum = res.data.pageNum
          this.totalPage = res.data.total
        } else {
          this.pointsDetailList = []
          this.totalPage = 0
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('积分明细加载失败，请稍后重试')
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

.group-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.group-panel {
  background: var(--pc-ink-50);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  overflow: hidden;
}

.group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: var(--pc-bd-hair);
  background: var(--pc-white);

  .group-title {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    font-size: var(--pc-fs-13);
  }

  .group-tag {
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-500);
  }

  .group-key {
    font-weight: 600;
    color: var(--pc-primary-700);
    font-size: var(--pc-fs-14);
    font-variant-numeric: tabular-nums;
  }

  .group-extra {
    color: var(--pc-ink-600);
    font-size: var(--pc-fs-12);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
  }

  .group-count {
    padding: 1px 8px;
    background: var(--pc-primary-50);
    color: var(--pc-primary-700);
    border-radius: var(--pc-r-2);
    font-size: var(--pc-fs-12);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
}

.empty {
  padding: 60px 0 40px;
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
  .token-num {
    color: var(--pc-ink-400);
    &.has-token { color: var(--pc-primary-700); font-weight: 600; }
  }
}
</style>
