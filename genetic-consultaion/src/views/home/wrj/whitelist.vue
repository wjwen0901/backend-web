<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>白名单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <el-button class="add-user" size="small" type="primary" @click="toAdd">新增</el-button>
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
          prop="area"
          label="大区"
          width="80">
        </el-table-column>
        <el-table-column
          prop="salesman"
          label="业务代表"
          width="100">
        </el-table-column>
        <el-table-column
          prop="team"
          label="团队"
          width="140">
        </el-table-column>
        <el-table-column
          prop="name"
          label="医生姓名">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机号"
          width="110">
        </el-table-column>
        <el-table-column
          prop="standardCode"
          label="医院编码"
          width="100">
        </el-table-column>
        <el-table-column
          prop="hospital"
          label="医院"
          width="200">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="科室"
          width="100">
        </el-table-column>
        <el-table-column
          prop="province"
          label="省"
          width="100">
        </el-table-column>
        <el-table-column
          prop="city"
          label="市"
          width="100">
        </el-table-column>
        <el-table-column
          prop="county"
          label="区"
          width="100">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          width="300">
        </el-table-column>
        <el-table-column
          prop="serviceTime"
          label="门诊时间"
          width="220">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" type="text" size="small" v-if="userId != 2222">编辑</el-button>
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

      <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
        <div>
          <el-form ref="form" :model="whitelistDoctor" label-width="80px">
            <el-form-item label="姓名">
              <el-input v-model="whitelistDoctor.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input type="tel" v-model="whitelistDoctor.cellphone"></el-input>
            </el-form-item>
            <el-form-item label="医院">
              <el-autocomplete
                style="width: 100%"
                class="inline-input"
                v-model="whitelistDoctor.hospital"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="科室">
              <el-select v-model="whitelistDoctor.deptId" filterable placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="省市区">
              <el-cascader class="width-100-p"
                           :options="regionData"
                           v-model="areaInfo"
                           @change="addressHandleChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="详细地址">
              <el-input v-model="whitelistDoctor.address"></el-input>
            </el-form-item>
            <el-form-item label="门诊时间">
              <el-input v-model="whitelistDoctor.serviceTime"></el-input>
            </el-form-item>
            <el-form-item label="业务代表">
              <el-input v-model="whitelistDoctor.salesman"></el-input>
            </el-form-item>
            <el-form-item label="区域">
              <el-input v-model="whitelistDoctor.area"></el-input>
            </el-form-item>
            <el-form-item label="提交团队">
              <el-input v-model="whitelistDoctor.team"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button v-if="whitelistDoctor.id === undefined" type="primary" @click="onAddSubmit()">确定</el-button>
              <el-button v-else type="primary" @click="onEditSubmit(whitelistDoctor.id)">确定</el-button>
              <el-button @click="dialogEditFormVisible = false">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import { provinceAndCityDataPlus, regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      whitelistDoctor: {},
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
      companyList: [],
      roleCode: this.$route.role,
      currentUserRole: window.localStorage.role,
      condition: null,
      qrCode: {},
      eleInformed: {},
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
      userId: window.localStorage.userId,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode,
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.resourceList = []
      this.axios.get('white/list', {
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
      this.axios.get('hospital').then(res => {
        this.hospitals = res.data
      }).catch(err => {
        console.log(err)
      })
      this.axios.get('hospital-dept').then(res => {
        this.depts = res.data
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
      this.whitelistDoctor = {}
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
        url: 'white',
        data: this.whitelistDoctor,
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
      this.axios.get('white/' + id, {
        params: {
          userId: window.localStorage.userId,
        }
      }).then(res => {
        this.whitelistDoctor = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    onEditSubmit (id) {
      var instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'put',
        url: 'white/' + id,
        data: this.whitelistDoctor,
        params: {
          userId: window.localStorage.userId,
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
        this.axios.delete('white/' + id, {
          params: {
            userId: window.localStorage.userId,
          }
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
    getSecResource (val) {
      console.log(val)
      // 获取权限列表
      this.axios.get('user/secs', {
        params: {
          role: val
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
        for (let sec of this.whitelistDoctor.secList) {
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
        console.log(this.resourceList)
        console.log(this.resourceSelet)
      }).catch(err => {
        console.log(err)
      })
    },
    querySearch (queryString, cb) {
      console.log(queryString)
      this.axios.get('hospital/page', {
        params: {
          pageNum: 1, // 页码
          pageSize: 8, // 每页长度
          keywords: queryString
        }
      }).then(res => {
        console.log(res.data)
        let result = []
        if (res.data.endRow === 0) {
          cb(result)
        } else {
          res.data.list.forEach(function (item) {
            result.push({
              'value': item.name,
              'id': item.id,
              'hospital': item
            })
          })
          console.log(result)
          cb(result)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelect (item) {
      console.log(item.hospital)
      this.whitelistDoctor.hospitalId = item.id
      this.whitelistDoctor.standardCode = item.hospital.standardCode
    },
    addressHandleChange (value) {
      this.whitelistDoctor.province = this.CodeToText[value[0]]
      this.whitelistDoctor.city = this.CodeToText[value[1]]
      this.whitelistDoctor.county = this.CodeToText[value[2]]
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
    areaInfo: {
      get: function () {
        if (this.whitelistDoctor.county === undefined || this.whitelistDoctor.county === '' || this.whitelistDoctor.county === null) {
          return []
        }
        let province = this.TextToCode[this.whitelistDoctor.province].code
        let cityTemp = this.whitelistDoctor.city === this.whitelistDoctor.province ? '市辖区' : this.whitelistDoctor.city
        let city = this.TextToCode[this.whitelistDoctor.province][cityTemp].code
        let county = this.TextToCode[this.whitelistDoctor.province][cityTemp][this.whitelistDoctor.county].code
        return [province, city, county]
      },
      set: function () {
      }
    }
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
  .width-100-p {
    width: 100%;
  }
</style>
