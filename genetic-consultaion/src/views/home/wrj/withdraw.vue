<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>提现记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <div class="search-box">
          <el-input placeholder="请输入姓名/手机号" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="fullName"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="提现金额"
          width="100">
        </el-table-column>
        <el-table-column
          prop="bank"
          label="银行卡"
          width="300">
          <template slot-scope="scope">
            ({{scope.row.bank}}){{scope.row.bankCardNo}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态" >
          <template slot-scope="scope">
            <el-tag size="mini" :class="tagClassOf(withdrawStatusLabel(scope.row.status))">
              {{ withdrawStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="审核时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.checkTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="到帐时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.incomeTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toCheck(scope.row.id)" type="text" size="small" v-if="userId != 2222">审核</el-button>
            <el-button @click="toIncome(scope.row.id)" type="text" size="small" v-if="userId != 2222">确认到账</el-button>
          </template>
        </el-table-column>
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

      <el-dialog title="提现" :visible.sync="dialogEditFormVisible">
        <div>
          <el-form ref="form" :model="withdrawCash" label-width="100px">
            <el-form-item label="用户">
              {{withdrawCash.fullName}}
            </el-form-item>
            <el-form-item label="当前余额">
              {{withdrawCash.currentAmount}}
            </el-form-item>
            <el-form-item label="提现金额">
              <el-input v-model="withdrawCash.amount"></el-input>
            </el-form-item>
            <el-form-item label="提醒手机号">
              <el-input v-model="withdrawCash.cellphone"></el-input>
            </el-form-item>
            <el-form-item label="提醒邮箱">
              <el-input v-model="withdrawCash.email"></el-input>
            </el-form-item>
            <el-form-item label="提现银行卡">
              <el-select v-model="withdrawCash.bankCardId" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in bankcardList"
                  :key="item.id"
                  :label="'(' + item.bank + ')' + item.cardNo"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="withdrawCash.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onAddSubmit()">确定</el-button>
              <el-button @click="dialogEditFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { tagClassOf, statusOf, BRCA_WITHDRAW_STATUS } from '@/utils/pc'

export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      userResource: {},
      secList: [],
      dialogEditFormVisible: false,
      dialogCodeFormVisible: false,
      dialogPayCodeFormVisible: false,
      dialogOnlineInformedFormVisible: false,
      dialogElecInformedFormVisible: false,
      resourceList: [],
      resourceSelet: [],
      solutionList: [],
      hospitals: [],
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      bankcardList: [],
      roleCode: this.$route.role,
      currentUserRole: window.localStorage.role,
      condition: null,
      qrCode: {},
      eleInformed: {},
      withdrawCash: {},
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    tagClassOf,
    withdrawStatusLabel (status) {
      return statusOf(BRCA_WITHDRAW_STATUS, status).label
    },
    getData () {
      this.resourceList = []
      this.axios.get('withdraw/all/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          condition: this.condition
        }
      }).then(res => {
        this.list = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
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
    toAdd () {
      this.dialogEditFormVisible = true
    },
    onAddSubmit () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'withdraw',
        data: this.withdrawCash,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        _this.$message({
          message: '新增成功',
          type: 'success'
        })
        _this._initData()
        _this.dialogEditFormVisible = false
      })
    },
    toIncome (user) {
      this.withdrawCash = user
      this.withdrawCash.capitalAccountId = user.id
      this.withdrawCash.currentAmount = user.amount

      this.axios.get('bankcard', {
        params: {
          userId: user.userId
        }
      }).then(res => {
        this.bankcardList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    toCheck (id) {
      this.$confirm('审核通过将发送短信、邮件给客户，为了避免带给客户不好的感受，请确定是否一定可3天内到账。', '审核提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.axios.get('withdraw/check/' + id, {
          params: {
            userId: this.userId
          }
        }).then(res => {
          this._initData()
          this.$message({
            type: 'success',
            message: '审核成功，已发送信息给客户!'
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '审核失败'
        })
      })
    },
    toIncome (id) {
      this.$confirm('确认将提现状态改成"已到账"吗？', '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.axios.get('withdraw/income/' + id, {
          params: {
            userId: this.userId
          }
        }).then(res => {
          this._initData()
          this.$message({
            type: 'success',
            message: '确认成功，已释放用户冻结金额!'
          })
        }).catch(err => {
          this.$message({
            type: 'info',
            message: '确认失败'
          })
          console.log(err)
        })
      })
    },
    deleteUser (id) {
      this.$confirm('确定删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('user/' + id).then(res => {
          this._initData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelect (item) {
      this.qrCode.hospitalId = item.id
    },
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.params.role) {
        this.roleCode = this.$route.params.role
        this.getData()
      }
    }
  },
  filters: {
    withdrawStatusFilter (status) {
      if (status == 0) {
        return "待审核"
      } else if (status == 1) {
        return "转账中"
      } else if (status == 2) {
        return "已到账"
      }
    }
  },
  computed: {
  },
  created () {
    let loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    this._initData()
    loading.close()
  },
  mounted () {
  },
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .search-box {
    }
    .opera-box {
      padding-bottom: 20px;
    }
  }
  .is-parent {
    margin-bottom: 5px;
    display: block;
    font-weight: bolder;
  }
  .sec-info {
    display: inline-block;
    padding-left: 10px;
    font-weight: normal;
  }
  .add-user {
    margin-bottom: 10px;
  }
  .search-box {
    width: 400px;
    float: right;
    margin-bottom: 10px;
  }
</style>
