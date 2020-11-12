<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="company-container">
      <div>
        <el-button class="add-company" size="small" type="primary" @click="toAdd">新增</el-button>
        <div class="search-box">
          <el-input placeholder="请输入公司名称" v-model="condition" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
          </el-input>
        </div>
      </div>
      <el-table
        :data="channelList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="full_name"
          label="姓名">
        </el-table-column>
        <el-table-column
          label="联系电话">
          <template slot-scope="scope">
            {{scope.row.cellphone}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="修改时间"
          width="180">
          <template slot-scope="scope">
            {{scope.row.update_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          label="当前状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 3" type="success">{{scope.row.state | stateFilter}}</el-tag>
            <el-tag v-else type="info">{{scope.row.state | stateFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="负责区域">
          <template slot-scope="scope">
            {{scope.row.province}}{{scope.row.city}}
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.row)">审核</el-button>
            <!--<el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>-->
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
    <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
      <div>
        <el-form ref="form" :model="editChannel" label-width="80px">
          <el-table
            ref="multipleTable"
            :data="proList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleProSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="授权产品"
              width="200">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              label="终端价格">
              <template slot-scope="scope">
                <el-input type="number" step="0.01" min="0" v-model="scope.row.proxyPrice" placeholder="请输入价格"></el-input>
              </template>
            </el-table-column>
            <el-table-column
              label="代理区域">
              <template slot-scope="scope">
                <el-input v-model="scope.row.proxyArea" placeholder="请输入省/市"></el-input>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item>
            <el-button type="primary" @click="onEditSubmit(editChannel.id)">确定</el-button>
            <el-button @click="dialogEditFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  components: {},
  name: 'CompanyList',
  data () {
    return {
      roleCode: window.localStorage.role,
      channelList: [],
      proList: [],
      pageNum: window.sessionStorage.firmPageNum === undefined ? 1 : window.sessionStorage.firmPageNum,
      pageSize: window.sessionStorage.firmPageSize === undefined ? 20 : window.sessionStorage.firmPageSize,
      totalPage: 0,
      paramSelect: '',
      condition: null,
      editChannel: [],
      proSelection: [],
      dialogEditFormVisible: false,
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
      this.axios.get('accuragen/saleman', {
        params: {
          group: '安易筛',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: window.localStorage.userId,
          condition: this.condition
        }
      }).then(res => {
        this.channelList = res.data.list
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.firmPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.firmPageNum = val
      this.getData()
    },

    toDetail (item) {
      this.editChannel = item
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      instance({
        method: 'post',
        url: 'product/group/limit',
        data: {
          group: '安易筛',
          hospitalId: 0,
          userId: this.userId,
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(res => {
        this.proList = res.data.map(item => {
          item.proxyArea = this.editChannel.province + this.editChannel.city
          return item
        })
      })
      this.dialogEditFormVisible = true
    },
    toAdd () {
      this.$router.push({
        name: 'ChannelAdd'
      })
    },
    addressHandleChange (value) {
      this.editChannel.province = this.CodeToText[value[0]]
      this.editChannel.city = this.CodeToText[value[1]]
      this.editChannel.county = this.CodeToText[value[2]]
    },
    onEditSubmit () {
      console.log(this.proSelection)
      if (this.proSelection.length == 0) {
        this.$message({
          message: '请勾选授权项目',
          type: 'warn'
        })
      }
      let productsProxy = []
      this.proSelection.forEach(item => {
        if (item.proxyPrice) {
          productsProxy.push({
            userId: this.editChannel.id,
            productId: item.id,
            solutionId: item.sid,
            productArea: item.productArea,
            proxyPrice: item.proxyPrice,
            operatId: this.userId
          })
        }
      })


      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'user/sale/confirm',
        data: productsProxy,
        params: {
          userId: this.editChannel.id,
          group: '安易筛'
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
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleProSelectionChange(val) {
      this.proSelection = val;
    }
  },
  filters: {
  },
  computed: {
    areaInfo: {
      get: function () {
        if (this.editChannel.city === undefined || this.editChannel.city === '' || this.editChannel.city === null) {
          return []
        }
        let province = this.TextToCode[this.editChannel.province].code
        let cityTemp = this.editChannel.city === this.editChannel.province ? '市辖区' : this.editChannel.city
        let city = this.TextToCode[this.editChannel.province][cityTemp].code
        // let county = this.TextToCode[this.editChannel.province][cityTemp][this.editChannel.county].code
        return [province, city]
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
  filters: {
    stateFilter: function (state) {
      if (state === 3) {
        return '审核通过'
      } else {
        return '待审核'
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.params.type) {
        this.roleCode = this.$route.params.type
        this.$route._flush()
      }
    }
  },
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .company-container {
    margin: 20px 0px;
    padding: 20px;
    background: #ffffff;
    .header {
      margin-bottom: 20px;
      font-size: 18px;
    }
    .search-box {
      width: 400px;
      float: right;
      margin-bottom: 10px;
    }
    .add-company {
    }
  }
</style>
