<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>元鹊管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
      </div>
      <el-table
        :data="customerList"
        size="mini"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          prop="fullName"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="订单量"
          width="120">
        </el-table-column>
        <el-table-column
          prop="companyName"
          label="所属公司">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button type="text" size="medium" @click="showRoleDialog(scope.row.id)">角色分配</el-button>
            <!--<el-button type="text" size="small" >删除</el-button>-->
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
    </div>

    <el-dialog title="角色分配" :visible.sync="roleDialogFormVisible">
      <div>
        <el-form ref="form" label-width="80px">
          <el-form-item label="客户信息">
            {{userResource.fullName}} ({{userResource.cellphone}})
          </el-form-item>
          <el-form-item label="选择公司">
            <el-select class="width-100-p"
                       v-model="userResource.companyId"
                       filterable
                       remote
                       reserve-keyword
                       allow-create
                       default-first-option
                       placeholder="请输入关键词"
                       :remote-method="getCompanyList"
                       :loading="companySelLoading">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-radio-group v-model="userResource.roleCode" size="small" :change="getSecResource">
              <el-radio label="business-agent">业务员</el-radio>
              <el-radio label="channel">渠道商</el-radio>
              <el-radio label="firm-service" v-if="roleCode === 'manager'">实验室客服</el-radio>
              <el-radio label="jk-service" v-if="roleCode === 'manager'">“见康”客服</el-radio>
              <el-radio label="doctor" v-if="roleCode === 'manager'">医生</el-radio>
              <el-radio label="patient" v-if="roleCode === 'manager'">患者</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="权限">
            <el-tree
              ref="tree"
              :data="resourceList"
              show-checkbox
              node-key="id"
              :default-checked-keys="resourceSelet"
              :default-expand-all="true"
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="roleDialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  name: 'customerList',
  data () {
    return {
      customerList: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      roleDialogFormVisible: false,
      userResource: {},
      secList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      resourceList: [],
      resourceSelet: [],
      multipleSelection: [],
      companyId: '',
      companyList: [],
      companySelLoading: false,
      roleCode: window.localStorage.role
    }
  },
  methods: {
    _initData () {
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.axios.get('user/customer', {
        params: {
          id: window.localStorage.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      }).then(res => {
        this.customerList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    getCompanyList () {
      this.axios.get('company/CustCompany', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
        this.companyList = res.data
      }).catch(err => {
        this.$message.error(err.data.message)
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
    getSecResource () {
      // 获取权限列表
      this.axios.get('user/secs', {
        params: {
          role: this.userResource.roleCode === undefined ? 'business-agent' : this.userResource.roleCode
        }
      }).then(res => {
        this.resourceList = []
        for (let sec of res.data) {
          if (sec.parentId === 0) {
            let children = []
            for (let secChild of res.data) {
              if (secChild.parentId === sec.id) {
                children.push({
                  'id': secChild.id,
                  'label': secChild.name,
                  'parent': secChild.parentId
                })
              }
            }
            this.resourceList.push({
              'id': sec.id,
              'label': sec.name,
              'children': children
            })
          }
        }
        this.resourceSelet = []
        for (let sec of this.userResource.secList) {
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
    },
    showRoleDialog (id) {
      this.axios.get('user/' + id).then(res => {
        this.userResource = res.data
        this.getSecResource()
      }).catch(err => {
        console.log(err)
      })
      this.roleDialogFormVisible = true
    },
    save () {
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
      let _this = this
      instance({
        method: 'put',
        url: 'user/' + this.userResource.id,
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
        _this.roleDialogFormVisible = false
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      let that = this
      if (this.multipleSelection.length > 0) {
        that.reportIds = []
        this.multipleSelection.forEach(function (item) {
          that.reportIds.push(item.id)
        })
      }
      console.log(that.reportIds)
    }
  },
  watch: {
    'userResource.roleCode' (to, from) {
      if (to !== from) {
        this.getSecResource()
      }
    }
  },
  filters: {},
  computed: {},
  created () {
    this._initData()
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .user-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .search-box {
    min-height: 30px;
    padding-bottom: 10px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    padding: 10px 20px;
  }
  .fl-right {
    float: right;
  }
</style>
