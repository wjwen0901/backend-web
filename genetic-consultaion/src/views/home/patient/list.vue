<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div class="search-box">
      </div>
      <el-table
        :data="customerList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="truename"
          label="客户姓名">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="联系电话"
          width="120">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="120">
        </el-table-column>
        <el-table-column
          prop="reportNum"
          label="报告数量">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="160">
          <template slot-scope="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="200">
          <template slot-scope="scope">
            <!--<el-button type="text" size="medium" @click="showRoleDialog(scope.row.id)">编辑</el-button>-->
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

    <!--<el-dialog title="角色分配" :visible.sync="roleDialogFormVisible">-->
      <!--<div>-->
        <!--<el-form ref="form" label-width="80px">-->
          <!--&lt;!&ndash;&lt;!&ndash;<el-form-item label="客户信息">&ndash;&gt;&ndash;&gt;-->
            <!--&lt;!&ndash;&lt;!&ndash;{{userResource.fullName}} ({{userResource.cellphone}})&ndash;&gt;&ndash;&gt;-->
          <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
          <!--<el-form-item>-->
            <!--<el-button type="primary" @click="save">保存</el-button>-->
            <!--<el-button @click="roleDialogFormVisible = false">取消</el-button>-->
          <!--</el-form-item>-->
        <!--</el-form>-->
      <!--</div>-->
    <!--</el-dialog>-->
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
      roleCode: window.localStorage.role
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('patient/page', {
        params: {
          userId: window.localStorage.userId,
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    }
    // showRoleDialog (id) {
    //   this.axios.get('patient/' + id).then(res => {
    //     this.userResource = res.data
    //     this.getSecResource()
    //   }).catch(err => {
    //     console.log(err)
    //   })
    //   this.roleDialogFormVisible = true
    // },
    // save () {
    //   let _this = this
    //   instance({
    //     method: 'put',
    //     url: 'user/' + this.userResource.id,
    //     data: this.userResource,
    //     headers: {
    //       'X-Requested-With': 'XMLHttpRequest',
    //       'Content-Type': 'application/json'
    //     }
    //   }).then(function (response) {
    //     _this.$message({
    //       message: '修改成功',
    //       type: 'success'
    //     })
    //     _this._initData()
    //     _this.roleDialogFormVisible = false
    //   })
    // },
  },
  watch: {},
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
