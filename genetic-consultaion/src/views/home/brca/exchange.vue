<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
          <el-breadcrumb-item>积分兑换</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 条兑换</div>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载兑换记录"
        style="width: 100%">
        <el-table-column label="兑换商品" width="240" prop="rewardName" fixed="left" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" width="100" fixed="left">
          <template slot-scope="scope">
            <el-tag :class="tagClassOf(statusType(scope.row.statusStr))" size="mini" disable-transitions>{{ scope.row.statusStr || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="快递" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.mailNo">
              <span class="meta">{{ scope.row.mailName }}</span>
              <span class="num">{{ scope.row.mailNo }}</span>
            </span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="收件人">
          <template slot-scope="scope">
            <div v-if="scope.row.receiver" class="receiver">
              <p class="receiver-line">
                {{ scope.row.receiver.receiver }}
                <span class="meta">{{ scope.row.receiver.cellphone }}</span>
              </p>
              <p class="receiver-addr">{{ formatAddress(scope.row.receiver) }}</p>
            </div>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="toExpress(scope.row)" type="text" size="mini" v-if="!scope.row.mailNo">绑定物流</el-button>
            <span v-else class="muted">已发货</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有兑换记录</p>
            <p class="empty-hint">用户使用积分兑换商品后会在这里显示</p>
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

      <el-dialog title="绑定物流信息" :visible.sync="dialogExpressFormVisible" width="560px">
        <div class="callout" v-if="expressItem.receiver">
          <h5>收件人信息</h5>
          <p>{{ expressItem.receiver.receiver }} · {{ expressItem.receiver.cellphone }}</p>
          <p class="addr">{{ formatAddress(expressItem.receiver) }}</p>
        </div>

        <div v-if="!isDiscountReward">
          <el-form ref="form" :model="expressItem" label-width="80px" size="small">
            <el-form-item label="快递方式">
              <el-input v-model="expressItem.mailName" placeholder="如：顺丰、京东"></el-input>
            </el-form-item>
            <el-form-item label="快递单号">
              <el-input v-model="expressItem.mailNo" placeholder="输入快递单号"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-form ref="form" :model="expressItem" label-width="80px" size="small">
            <el-form-item label="生成折扣">
              <el-input type="number" v-model="expressItem.discount" placeholder="折扣值，如 0.5"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <span slot="footer">
          <el-button @click="dialogExpressFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onExpressSubmit">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatDate, formatAddress, apiSubmit, BRCA_EXCHANGE_STATUS_TYPE, typeOf, tagClassOf } from '@/utils/pc'

export default {
  name: 'BrcaExchange',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      dialogExpressFormVisible: false,
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      expressItem: {}
    }
  },
  computed: {
    isDiscountReward () {
      return this.expressItem.riceRewardId == 9
    }
  },
  filters: { formatDate },
  methods: {
    tagClassOf,
    statusType (statusStr) { return typeOf(BRCA_EXCHANGE_STATUS_TYPE, statusStr) },
    formatAddress: formatAddress,
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('rice/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          condition: this.condition
        }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('兑换记录加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() },
    toExpress (express) {
      this.expressItem = Object.assign({}, express, { discount: 0.0001 })
      this.dialogExpressFormVisible = true
    },
    onExpressSubmit () {
      this.expressItem.operatorId = this.userId

      if (!this.isDiscountReward) {
        apiSubmit(this.axios, 'post', 'rice/confirm', this.expressItem)
          .then(() => {
            this.$message.success('物流信息已绑定')
            this.dialogExpressFormVisible = false
            this._initData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('绑定失败，请稍后重试')
          })
        return
      }

      apiSubmit(
        this.axios,
        'post',
        'cashout/discount',
        { userId: this.expressItem.userId, discount: this.expressItem.discount, productId: 1901 },
        { count: 1 }
      ).then(res => {
        if (res.data && res.data.length === 10) {
          this.expressItem.mailName = '安易筛0.0001折扣码'
          this.expressItem.mailNo = res.data
          return apiSubmit(this.axios, 'post', 'rice/confirm', this.expressItem)
        }
        this.$message.warning('券面校验失败：请检查折扣额度配置')
        return Promise.reject(new Error('discount validation failed'))
      }).then(() => {
        this.$message.success('折扣券已生成并绑定')
        this.dialogExpressFormVisible = false
        this._initData()
      }).catch(err => {
        if (err && err.message === 'discount validation failed') return
        console.log(err)
        this.$message.error('生成折扣券失败，请稍后重试')
      })
    }
  },
  watch: {
    '$route' () { this.getData() }
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
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--pc-info-600);
      margin-right: 6px;
    }
  }
  p {
    margin: 2px 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-700);
  }
  .addr { color: var(--pc-ink-500); }
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta {
    color: var(--pc-ink-400);
    font-size: var(--pc-fs-12);
    margin-right: 4px;
  }
  .muted { color: var(--pc-ink-400); }

  .receiver {
    .receiver-line {
      margin: 0 0 2px;
      color: var(--pc-ink-700);
    }
    .receiver-addr {
      margin: 0;
      font-size: var(--pc-fs-12);
      color: var(--pc-ink-500);
    }
  }
}
</style>
