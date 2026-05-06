<template>
  <div>
    <div class="opera-box">
      <el-button size="small" type="primary" @click="toExcel">导出 Excel</el-button>
      <span class="page-meta">共 <strong>{{ totalPage }}</strong> 名医生</span>
    </div>

    <el-table
      :data="list"
      size="mini"
      border
      v-loading="loading"
      element-loading-text="加载医生列表"
      style="width: 100%">
      <el-table-column prop="fullName" label="姓名" width="120" fixed="left"></el-table-column>
      <el-table-column label="手机号" width="130">
        <template slot-scope="scope">
          <span class="num">{{ scope.row.cellphone }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hospitalName" label="医院名称" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="医院编码" width="120">
        <template slot-scope="scope">
          <span class="num" v-if="scope.row.standardCode">{{ scope.row.standardCode }}</span>
          <span class="muted" v-else>—</span>
        </template>
      </el-table-column>
      <el-table-column prop="area" label="大区" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="salesmans" label="业务代表" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column prop="serviceUsers" label="服务（收款）账号" min-width="200" show-overflow-tooltip></el-table-column>
      <el-table-column label="注册时间" width="160">
        <template slot-scope="scope">
          <span class="num">{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button @click="addSalesman(scope.row)" type="text" size="mini">分配业务代表</el-button>
          <el-button @click="addServiceman(scope.row)" type="text" size="mini">添加辅助人员</el-button>
          <el-button @click="toDetail(scope.row.id)" type="text" size="mini" v-if="canOperate">编辑</el-button>
        </template>
      </el-table-column>

      <template slot="empty">
        <div class="empty">
          <p class="empty-title">没有匹配的医生</p>
          <p class="empty-hint">尚无医生注册数据</p>
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

    <el-dialog title="分配业务代表" :visible.sync="dialogSalesmanVisible" width="640px">
      <el-form ref="salesmanForm" :model="salesman" label-width="100px" size="small">
        <el-form-item label="服务医生">
          <span class="readonly">{{ salesman.doctorName }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="salesman.fullName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="tel" v-model="salesman.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="salesman.email"></el-input>
        </el-form-item>
        <el-form-item label="收款银行">
          <el-select v-model="salesman.bankCode" filterable placeholder="请选择" class="width-100-p" @change="changeBankSelect">
            <el-option v-for="item in bankList" :key="item.bankCode" :label="item.bankName" :value="item.bankCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="salesman.bankcardNo"></el-input>
        </el-form-item>
        <el-form-item label="佣金比例">
          <el-input v-model="salesman.personalTax" placeholder="如 0.05 表示 5%"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="salesman.remark" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogSalesmanVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSalesman">确定分配</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配辅助人员" :visible.sync="dialogServiceVisible" width="640px">
      <el-form ref="servicemanForm" :model="serviceman" label-width="100px" size="small">
        <el-form-item label="服务医生">
          <span class="readonly">{{ serviceman.doctorName }}</span>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="serviceman.fullName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="tel" v-model="serviceman.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="serviceman.email"></el-input>
        </el-form-item>
        <el-form-item label="收款银行">
          <el-select v-model="serviceman.bankCode" filterable placeholder="请选择" class="width-100-p" @change="changeServiceBankSelect">
            <el-option v-for="item in bankList" :key="item.bankCode" :label="item.bankName" :value="item.bankCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="银行卡号">
          <el-input v-model="serviceman.bankcardNo"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="serviceman.remark" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogServiceVisible = false">取消</el-button>
        <el-button type="primary" @click="submitServiceman">确定分配</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑医生" :visible.sync="dialogEditFormVisible" width="640px">
      <el-form ref="userForm" :model="userResource" label-width="100px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="userResource.fullName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="tel" v-model="userResource.cellphone"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userResource.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userResource.email"></el-input>
        </el-form-item>
        <el-form-item label="所属医院">
          <el-autocomplete
            class="width-100-p"
            v-model="userResource.hospitalName"
            :fetch-suggestions="hospitalQuerySearch"
            placeholder="搜索医院"
            :trigger-on-focus="false"
            @select="hospitalHandleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="userResource.remark" :rows="2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button v-if="!userResource.id" type="primary" @click="onAddSubmit">确定新增</el-button>
        <el-button v-else type="primary" @click="onEditSubmit(userResource.id)">保存修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit, downloadBlob, dateStr } from '@/utils/pc'

export default {
  name: 'BrcaUserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      userResource: {},
      dialogServiceVisible: false,
      dialogSalesmanVisible: false,
      dialogEditFormVisible: false,
      bankList: [],
      roleCode: this.$route.params && this.$route.params.role,
      condition: null,
      salesman: {},
      serviceman: {},
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  computed: {
    canOperate () { return this.userId !== 2222 }
  },
  filters: { formatDate },
  methods: {
    _initData () {
      this.getData()
      this.getBankList()
    },
    getData () {
      this.loading = true
      this.axios.get('/white/doctor/list', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.condition }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('医生列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    getBankList () {
      this.axios.get('/bankcard/bank', { params: { userId: this.userId } })
        .then(res => { this.bankList = res.data })
        .catch(err => console.log(err))
    },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() },
    toExcel () {
      this.axios.get('/white/export', {
        params: { userId: this.userId },
        responseType: 'blob'
      }).then(response => {
        downloadBlob(response.data, '医生注册列表-' + dateStr() + '.xls')
      }).catch(err => {
        console.log(err)
        this.$message.error('导出失败，请稍后重试')
      })
    },
    onAddSubmit () {
      this._submitUser('post', 'user')
    },
    toDetail (id) {
      this.axios.get('user/' + id, { params: { userId: this.userId } })
        .then(res => {
          this.userResource = res.data
          this.dialogEditFormVisible = true
        })
        .catch(err => {
          console.log(err)
          this.$message.error('加载详情失败')
        })
    },
    onEditSubmit (id) {
      this._submitUser('put', 'user/' + id)
    },
    _submitUser (method, url) {
      this.userResource.roleCode = this.roleCode
      apiSubmit(this.axios, method, url, this.userResource, { userId: this.userId })
        .then(() => {
          this.$message.success(method === 'post' ? '新增成功' : '修改成功')
          this.dialogEditFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
    },
    addSalesman (user) {
      this.salesman = {
        doctorId: user.userId,
        doctorName: user.fullName,
        hospitalId: user.hospitalId
      }
      this.dialogSalesmanVisible = true
    },
    addServiceman (user) {
      this.serviceman = {
        doctorId: user.userId,
        doctorName: user.fullName,
        hospitalId: user.hospitalId
      }
      this.dialogServiceVisible = true
    },
    changeBankSelect (val) {
      const bank = this.bankList.find(item => item.bankCode === val)
      if (bank) { this.salesman.bank = bank.bankName; this.salesman.bankCode = bank.bankCode }
    },
    changeServiceBankSelect (val) {
      const bank = this.bankList.find(item => item.bankCode === val)
      if (bank) { this.serviceman.bank = bank.bankName; this.serviceman.bankCode = bank.bankCode }
    },
    submitSalesman () {
      this._submitService('salesman', this.salesman, () => { this.dialogSalesmanVisible = false })
    },
    submitServiceman () {
      this._submitService('service', this.serviceman, () => { this.dialogServiceVisible = false })
    },
    _submitService (type, payload, onSuccess) {
      apiSubmit(
        this.axios,
        'post',
        'user/manager/service?type=' + type + '&hospitalId=' + payload.hospitalId,
        payload,
        { userId: this.userId }
      ).then(() => {
        this.$message.success('分配成功')
        onSuccess()
        this._initData()
      }).catch(err => {
        console.log(err)
        this.$message.error('分配失败，请稍后重试')
      })
    },
    hospitalQuerySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString, userId: this.userId }
      }).then(res => {
        if (res.data.endRow === 0) {
          cb([])
        } else {
          cb(res.data.list.map(item => ({ value: item.name, id: item.id })))
        }
      }).catch(err => console.log(err))
    },
    hospitalHandleSelect (item) {
      this.userResource.hospitalId = item.id
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.opera-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;

  .page-meta {
    margin-left: auto;
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

.readonly { color: var(--pc-ink-700); font-size: var(--pc-fs-13); }
.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
