<template>
  <div>
    <div>
      <el-button class="add-user" size="small" type="primary" @click="toExcel">导出Excel</el-button>
    </div>
    <el-table
      :data="list"
      size="mini"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="fullName"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="cellphone"
        label="手机号"
        width="110">
      </el-table-column>
      <el-table-column
        prop="hospitalName"
        label="医院名称">
      </el-table-column>
      <el-table-column
        prop="standardCode"
        label="医院编码">
      </el-table-column>
      <el-table-column
        prop="area"
        label="大区">
      </el-table-column>
      <el-table-column
        prop="salesmans"
        label="业务代表">
      </el-table-column>
      <el-table-column
        prop="serviceUsers"
        label="服务(收款)账号">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="160">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="260">
        <template slot-scope="scope">
          <el-button @click="addSalesman(scope.row)" type="text" size="small">分配业务代表</el-button>
          <el-button @click="addServiceman(scope.row)" type="text" size="small">添加辅助人员</el-button>
          <el-button @click="toDetail(scope.row.id)" type="text" size="small" v-if="userId != 2222">编辑</el-button>
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

    <el-dialog title="分配业务代表" :visible.sync="dialogSalesmanVisible">
      <div>
        <el-form ref="form" :model="salesman" label-width="80px" size="small" style="width: 80%">
          <el-form-item label="服务医生">
            {{salesman.doctorName}}
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
            <el-select v-model="salesman.bankCode" filterable placeholder="请选择" @change="changeBankSelect">
              <el-option
                v-for="item in bankList"
                :key="item['bankCode']"
                :label="item['bankName']"
                :value="item['bankCode']">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input type="number" v-model="salesman.bankcardNo"></el-input>
          </el-form-item>
          <el-form-item label="佣金比例">
            <el-input v-model="salesman.personalTax"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="salesman.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitSalesman">确定</el-button>
            <el-button @click="dialogSalesmanVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>


    <el-dialog title="分配辅助人员" :visible.sync="dialogServiceVisible">
      <div>
        <el-form ref="form" :model="serviceman" label-width="80px" size="small" style="width: 80%">
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
            <el-select v-model="serviceman.bankCode" filterable placeholder="请选择" @change="changeServiceBankSelect">
              <el-option
                v-for="item in bankList"
                :key="item['bankCode']"
                :label="item['bankName']"
                :value="item['bankCode']">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input type="tel" v-model="serviceman.bankcardNo"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="serviceman.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button   type="primary" @click="submitServiceman">确定</el-button>
            <el-button @click="dialogServiceVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
      <div>
        <el-form ref="form" :model="userResource" label-width="80px">
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
                class="inline-input"
                v-model="userResource.hospitalName"
                :fetch-suggestions="hospitalQuerySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="hospitalHandleSelect"
              ></el-autocomplete>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="userResource.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="userResource.id === undefined" type="primary" @click="onAddSubmit()">确定</el-button>
            <el-button v-else type="primary" @click="onEditSubmit(userResource.id)">确定</el-button>
            <el-button @click="dialogEditFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
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
      dialogServiceVisible: false,
      dialogSalesmanVisible: false,
      dialogEditFormVisible: false,
      resourceList: [],
      resourceSelet: [],
      hospitals: [],
      depts: [],
      bankList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyList: [],
      roleCode: this.$route.role,
      currentUserRole: window.localStorage.role,
      condition: null,
      qrCode: {},
      eleInformed: {},
      salesman: {
      },
      serviceman: {},
      informedQrCode: {
        sampleType: '口腔拭子',
        price: 688,
        time: '2020.03'
      },
      options2: [{
        text: 'name1',
        value: 'value1'
      }, {
        text: 'name2',
        value: 'value2'
      }],
      bankInfo: [],
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  methods: {
    _initData () {
      this.getData()
      this.getBankList()
      this.axios.get('hospital',{
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
      }).then(res => {
        this.hospitals = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        }
      }).then(res => {
        this.depts = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getData () {
      this.axios.get('/white/doctor/list', {
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

    getBankList () {
      this.axios.get('/bankcard/bank', {
        params: {
          userId: this.userId
        }
      }).then(res => {
        this.bankList = res.data
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
    toExcel () {
      this.axios.get('/white/export',{
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
        responseType:"blob"
      }).then(response => {
        const blob = new Blob(
          [response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' })
        const aEle = document.createElement('a');     // 创建a标签
        const href = window.URL.createObjectURL(blob);       // 创建下载的链接
        aEle.href = href;
        const today = new Date();
        aEle.download = "医生注册列表-" + today.getFullYear() + '-'+ (today.getMonth()+1)+ '-' + today.getDate() + ".xls";  // 下载后文件名
        document.body.appendChild(aEle);
        aEle.click();     // 点击下载
        document.body.removeChild(aEle); // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
      }).catch(err => {
        console.log(err)
      })
    },

    onAddSubmit () {
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
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      this.userResource.roleCode = this.roleCode
      let _this = this
      instance({
        method: 'post',
        url: 'user',
        data: this.userResource,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
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
    toDetail (id) {
      this.axios.get('user/' + id,{
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        }
      }).then(res => {
        this.userResource = res.data
        this.resourceSelet = []
        for (let sec of res.data.secList) {
          let children = []
          for (let d of this.$refs.tree.data) {
            if (d.id === sec.id) {
              children = d.children
            }
          }
          if (sec.parentId === 0 && children.length !== 0) {
            continue
          }
          this.resourceSelet.push(sec.id)
        }
        this.$refs.tree.setCheckedKeys(this.resourceSelet)
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    onEditSubmit (id) {
      let instance = this.axios.create({
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
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
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
        this.axios.delete('user/' + id, {
          params: {
            userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          },
        }).then(res => {
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
    addSalesman(user) {
      this.salesman.doctorId = user.userId
      this.salesman.doctorName = user.fullName
      this.salesman.hospitalId = user.hospitalId
      this.dialogSalesmanVisible = true
    },
    changeBankSelect (val) {
      this.bankList.forEach(item => {
        if (item.bankCode === val) {
          this.salesman.bank = item.bankName
          this.salesman.bankCode = item.bankCode
        }
      })
    },
    changeServiceBankSelect (val) {
      this.bankList.forEach(item => {

        if (item.bankCode === val) {
          this.serviceman.bank = item['bankName']
          this.serviceman.bankCode = item['bankCode']
        }
      })
    },
    submitSalesman () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'user/manager/service?type=salesman&hospitalId=' + this.salesman.hospitalId,
        data: this.salesman,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
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
        _this.dialogSalesmanVisible = false
      })
    },
    addServiceman(user) {
      this.serviceman = {}
      this.serviceman.doctorId = user.userId
      this.serviceman.doctorName = user.fullName
      this.serviceman.hospitalId = user.hospitalId
      this.dialogServiceVisible = true
    },
    submitServiceman () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'user/manager/service?type=service&hospitalId=' + this.serviceman.hospitalId,
        data: this.serviceman,
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
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
        _this.dialogServiceVisible = false
      })
    },

    hospitalQuerySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString,
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
        },
      }).then(res => {
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id
            })
          })
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    hospitalHandleSelect (item) {
      this.userResource.hospitalId = item.ids
    },
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
