<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
          <el-breadcrumb-item>佣金账户</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 个账户</div>
      </div>

      <el-alert
        title="仅显示分配过订单的账户"
        type="info"
        :closable="false"
        show-icon>
      </el-alert>

      <div class="opera-box">
        <el-button size="small" type="primary" @click="toAdd">新增账户</el-button>
        <el-input
          placeholder="搜索姓名 / 手机号"
          v-model="condition"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载佣金账户"
        style="width: 100%">
        <el-table-column prop="fullName" label="姓名" width="120" fixed="left"></el-table-column>
        <el-table-column prop="cellphone" label="手机号" width="130">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.cellphone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前余额" width="120" align="right">
          <template slot-scope="scope">
            <span class="num amount">¥{{ scope.row.amount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="冻结金额" width="120" align="right">
          <template slot-scope="scope">
            <span class="num amount-frozen" v-if="scope.row.freezingAmount > 0">¥{{ scope.row.freezingAmount }}</span>
            <span class="num muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="变动时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.updateTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="最后一次操作" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="200" v-if="canOperate">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="mini">提现</el-button>
            <el-button @click="toAddBankcard(scope.row)" type="text" size="mini">银行卡</el-button>
            <el-button @click="deleteUser(scope.row.id)" type="text" size="mini" class="text-danger">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有匹配的账户</p>
            <p class="empty-hint">{{ condition ? '试试换个关键词，或清空搜索看全部' : '尚无佣金账户 — 分配订单后会自动生成' }}</p>
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

      <el-dialog title="提现" :visible.sync="dialogEditFormVisible" width="560px">
        <el-form ref="form" :model="withdrawCash" label-width="100px" size="small">
          <el-form-item label="用户">
            <span class="readonly">{{ withdrawCash.fullName }}</span>
          </el-form-item>
          <el-form-item label="当前余额">
            <span class="readonly amount">¥{{ withdrawCash.currentAmount || 0 }}</span>
          </el-form-item>
          <el-form-item label="提现金额">
            <el-input v-model="withdrawCash.amount" placeholder="不超过当前余额"></el-input>
          </el-form-item>
          <el-form-item label="提醒手机号">
            <el-input v-model="withdrawCash.cellphone"></el-input>
          </el-form-item>
          <el-form-item label="提醒邮箱">
            <el-input v-model="withdrawCash.email"></el-input>
          </el-form-item>
          <el-form-item label="提现银行卡">
            <el-select v-model="withdrawCash.bankCardId" filterable placeholder="请选择" class="width-100-p">
              <el-option
                v-for="item in bankcardList"
                :key="item.id"
                :label="'(' + item.bank + ') ' + item.cardNo"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="withdrawCash.remark" :rows="3"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogEditFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onAddSubmit" :disabled="!canSubmit">确定提现</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'BrcaCommission',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      dialogEditFormVisible: false,
      bankcardList: [],
      condition: null,
      withdrawCash: {},
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    canOperate () {
      return this.userId !== 2222
    },
    canSubmit () {
      return this.withdrawCash.amount > 0 && this.withdrawCash.bankCardId
    }
  },
  filters: { formatDate },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('capital/page', {
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
        this.$message.error('账户加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    toAdd () {
      this.withdrawCash = {}
      this.bankcardList = []
      this.dialogEditFormVisible = true
    },
    onAddSubmit () {
      const instance = this.axios.create({
        headers: { 'Authorization': window.localStorage.token, 'Content-Type': 'application/json' }
      })
      instance({
        method: 'post',
        url: 'withdraw',
        data: this.withdrawCash,
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/json' }
      }).then(() => {
        this.$message.success('提现申请已提交')
        this.dialogEditFormVisible = false
        this._initData()
      }).catch(err => {
        console.log(err)
        this.$message.error('提现失败，请稍后重试')
      })
    },
    toDetail (user) {
      this.withdrawCash = Object.assign({}, user, {
        capitalAccountId: user.id,
        currentAmount: user.amount
      })
      this.bankcardList = []
      this.axios.get('bankcard', { params: { userId: user.userId } }).then(res => {
        this.bankcardList = res.data
      }).catch(err => console.log(err))
      this.dialogEditFormVisible = true
    },
    toAddBankcard (user) {
      this.$router.push({ path: '/bankcard/add', query: { userId: user.userId, fullName: user.fullName } })
    },
    deleteUser (id) {
      this.$confirm('确定删除此账户？该操作会移除关联用户。', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('user/' + id).then(() => {
          this.$message.success('删除成功')
          this._initData()
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

.opera-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;

  .search-input {
    width: 320px;
    margin-left: auto;
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

.readonly {
  color: var(--pc-ink-700);
  font-size: var(--pc-fs-13);
}

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
  .amount-frozen { color: var(--pc-warn-700); }
  .muted { color: var(--pc-ink-400); }
  .text-danger { color: var(--pc-pos-600) !important; }
  .text-danger:hover { color: var(--pc-pos-700) !important; background: var(--pc-pos-100); }
}
</style>
