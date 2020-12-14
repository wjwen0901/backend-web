<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>一体机管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="product-container">
      <div>
        <el-button class="add-hospital" size="small" type="primary" @click="toAdd">新增</el-button>
      </div>
      <el-table
        :data="printerList"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="number"
          label="一体机编号">
        </el-table-column>
        <el-table-column
          prop="printId"
          label="打印机编号">
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建日期"
          width="180">
          <template slot-scope="scope">
            {{scope.row.create_time | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="投放地址">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toPrinterCode(scope.row.id)">生成打印二维码</el-button>
            <el-button type="text" size="small" @click="toDetail(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="新增" :visible.sync="dialogAddFormVisible">
      <div>
        <el-form ref="form" :model="addPrinter" label-width="120px">
          <el-form-item label="打印机编号">
            <el-input v-model="addPrinter.printId"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onAddSubmit()">确定</el-button>
            <el-button @click="dialogAddFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="编辑" :visible.sync="dialogEditFormVisible">
      <div>
        <el-form ref="form" :model="printer" label-width="120px">
          <el-form-item label="打印机编号">
            <el-input v-model="printer.printId"></el-input>
          </el-form-item>
          <el-form-item label="投放地址">
            <el-input v-model="printer.address"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onEditSubmit()">确定</el-button>
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
  name: 'HospitalList',
  data () {
    return {
      userId: parseInt(window.localStorage.userId),
      printerList: [],
      printer: {},
      addPrinter: {},
      dialogAddFormVisible: false,
      dialogEditFormVisible: false
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.axios.get('wechatPrt/printer', {
        params: {
          userId: window.localStorage.userId
        },
      }).then(res => {
        this.printerList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    toDetail (printer) {
      this.dialogEditFormVisible = true
      this.printer = printer
    },
    toAdd () {
      this.dialogAddFormVisible = true
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
        url: 'wechatPrt/printer',
        data: _this.addPrinter,
        params: {
          userId: window.localStorage.userId
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
        _this.dialogAddFormVisible = false
      })
    },
    onEditSubmit () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'put',
        url: 'wechatPrt/printer',
        data: _this.printer,
        params: {
          userId: window.localStorage.userId
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (response) {
        _this.$message({
          message: '编辑成功',
          type: 'success'
        })
        _this._initData()
        _this.dialogEditFormVisible = false
      })
    },
    toPrinterCode (id) {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'get',
        url: 'wechatPrt/barcode',
        params: {
          printerId: id,
          userId: _this.userId
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        window.open(_this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
      })
    }
  },
  filters: {
  },
  computed: {},
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
  mounted () {},
  destroyed () {}
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .product-container {
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
    .add-hospital {
    }
  }
</style>
