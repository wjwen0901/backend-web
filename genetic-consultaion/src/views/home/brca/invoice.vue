<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
      <el-breadcrumb-item>发票记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <div>
        <el-button class="add-user" size="small" type="primary" @click="toAdd">新增</el-button>
      </div>
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="invoiceType"
          label="发票类型"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="抬头"
          width="180">
        </el-table-column>
        <el-table-column
          prop="dutyNumber"
          label="税号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="金额"
          width="100">
        </el-table-column>
        <el-table-column
          prop="statusStr"
          label="当前状态"
          width="100">
        </el-table-column>
        <el-table-column
          label="申请时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.applyTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="邮寄时间"
          width="140">
          <template slot-scope="scope">
            {{scope.row.sendTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" type="text" size="small">查看详情</el-button>
            <el-button @click="showExpress(scope.row.id)" type="text" size="small" v-if="scope.row.status == 2">查看物流</el-button>
            <el-button @click="toExpress(scope.row)" type="text" size="small" v-if="scope.row.status == 1">邮寄单据</el-button>
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

      <el-dialog title="订单详情" :visible.sync="dialogEditFormVisible">
        <div>
          <el-table
            :data="invoiceDetail"
            size="mini"
            border
            style="width: 100%">
            <el-table-column
              prop="orderNo"
              label="订单编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="productName"
              label="检测产品"
              width="180">
            </el-table-column>
            <el-table-column
              prop="hospitalName"
              label="送检医院"
              width="180">
            </el-table-column>
            <el-table-column
              prop="orderPrice"
              label="订单金额"
              width="100">
            </el-table-column>
            <el-table-column
              label="下单时间"
              width="140">
              <template slot-scope="scope">
                {{scope.row.create_time | formatDate}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>

import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  components: {},
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      invoiceDetail: [],
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
      this.axios.get('invoice/list', {
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
      this.axios.get('invoice/detail/' + id).then(res => {
        this.invoiceDetail = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    toExpress (id) {
      this.axios.get('white/' + id).then(res => {
        this.whitelistDoctor = res.data
      }).catch(err => {
        console.log(err)
      })
      this.dialogEditFormVisible = true
    },
    showExpress (id) {
      this.axios.get('white/' + id).then(res => {
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
        this.axios.delete('white/' + id).then(res => {
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
