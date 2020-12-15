<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>佣金账户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <el-button class="add-user" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入姓名/手机号" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
        <el-alert
          title="仅显示分配过订单的账户"
          type="info">
        </el-alert>
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
          label="当前余额"
          width="100">
        </el-table-column>
        <el-table-column
          prop="freezingAmount"
          label="冻结金额"
          width="100">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="变动时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="最后一次操作" >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row)" type="text" size="small" v-if="userId != 2222">提现</el-button>
            <el-button @click="toAddBankcard(scope.row)" type="text" size="small" v-if="userId != 2222">添加银行卡</el-button>
            <el-button @click="deleteUser(scope.row.id)" type="text" size="small" v-if="userId != 2222">删除</el-button>
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
        userId: window.localStorage.userId
      }
    },
    methods: {
      _initData () {
        this.getData()
      },
      getData () {
        this.resourceList = []
        this.axios.get('capital/page', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            userId: window.localStorage.userId,
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
      toDetail (user) {
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
      onEditSubmit (id) {
        let secArray = []
        let secIds = []
        for (let sec of this.$refs.tree.getCheckedNodes()) {
          if (sec.parent !== undefined && secIds.indexOf(sec.parent) <= -1) {
            secIds.push(sec.parent)
            secArray.push({id: sec.parent})
          }
          secIds.push(sec.id)
          secArray.push({id: sec.id})
        }
        this.userResource.secList = secArray
        var instance = this.axios.create({
          headers: {
            'Authorization': window.localStorage.token,
            'Content-Type': 'application/json'
          }
        })
        let _this = this
        instance({
          method: 'put',
          url: 'user/' + id,
          data: this.userResource,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          }
        }).then(function (response) {
          _this.$message({
            message: '修改成功',
            type: 'success'
          })
          _this._initData()
          _this.dialogEditFormVisible = false
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
