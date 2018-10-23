<template>
  <div>
    <el-button class="add-user" size="mini" type="primary" @click="toAdd">新增用户</el-button>
    <el-table
      :data="list"
      size="mini"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="fullName"
        label="姓名"
        width="100">
      </el-table-column>
      <el-table-column
        fixed
        prop="cellphone"
        label="手机号"
        width="110">
      </el-table-column>
      <el-table-column
        prop="companyName"
        label="所属公司">
      </el-table-column>
      <el-table-column
        label="权限">
        <template slot-scope="scope">
          <el-tag v-for="sec in scope.row.secList" v-bind:key="sec.id" class="is-parent" v-if="sec.parentId === 0">
            {{sec.name}}
            <span v-for="secChild in scope.row.secList" v-bind:key="secChild.id" class="sec-info" v-if="secChild.parentId === sec.id">
              {{secChild.name}}
            </span>
          </el-tag>
          <!--<span v-for="s in scope.row.secList" v-bind:key="s.id">-->
            <!--{{s.name}}-->
          <!--</span>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="160">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="90">
        <template slot-scope="scope">
          <el-button @click="toDetail(scope.row.id)" type="text" size="small">编辑</el-button>
          <el-button @click="deleteUser(scope.row.id)" type="text" size="small">删除</el-button>
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

    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
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
          <el-form-item label="所属医院" v-if="userResource.role === 2">
            <el-select v-model="userResource.hospitalId" filterable placeholder="请选择">
              <el-option
                v-for="item in hospitalList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属企业" v-else>
            <el-select v-model="userResource.companyId" filterable placeholder="请选择">
              <el-option
                v-for="item in companyList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
          <el-form-item label="备注">
            <el-input type="textarea" v-model="userResource.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-if="userResource.id === undefined" type="primary" @click="onAddSubmit()">确定</el-button>
            <el-button v-else type="primary" @click="onEditSubmit(userResource.id)">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
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
      dialogFormVisible: false,
      resourceList: [],
      resourceSelet: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      companyList: []
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.resourceList = []
      // 获取权限列表
      this.axios.get('user/secs', {
        params: {
          role: this.$route.params.role
        }
      }).then(res => {
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
      }).catch(err => {
        console.log(err)
      })
      // 获取公司列表
      this.axios.get('company').then(res => {
        this.companyList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('user/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          role: this.$route.params.role,
          userId: window.localStorage.userId
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
    },
    handleCurrentChange (val) {
      this.pageNum = val
    },
    toAdd () {
      this.dialogFormVisible = true
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
      var instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      this.userResource.roleCode = this.$route.params.role
      let _this = this
      instance({
        method: 'post',
        url: 'user',
        data: this.userResource,
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
        _this.dialogFormVisible = false
      })
    },
    toDetail (id) {
      this.axios.get('user/' + id).then(res => {
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
      this.dialogFormVisible = true
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
        _this.dialogFormVisible = false
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
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.params.role) {
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
<style>
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
    float: right;
  }
</style>
