<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">渠道管理</el-breadcrumb-item>
      <el-breadcrumb-item>生成二维码</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="user-container">
      <el-table
        :data="list"
        size="mini"
        border
        style="width: 100%">
        <el-table-column
          prop="fullName"
          label="姓名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="cellphone"
          label="手机号"
          width="110">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <!--<el-table-column-->
          <!--label="上级用户">-->
          <!--<template slot-scope="scope">-->
            <!--{{scope.parentName}}({{scope.parentMobile}})-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="createTime"
          label="创建日期"
          width="160">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="130">
          <template slot-scope="scope">
            <el-button @click="selectItem(scope.row.id, scope.row.name)" type="text" size="small">生成二维码</el-button>
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

    <el-dialog title="生成二维码" :visible.sync="dialogFormVisible">
      <div>
        <el-form ref="form" label-width="100px">
          <el-form-item label="选择产品">
            <el-select class="width-100-p" v-model="selSolution" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in solutionList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品优惠链接">
            <el-input v-model="uri" placeholder="http://..."></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="price" placeholder="1300"></el-input>
          </el-form-item>
          <el-form-item label="检测周期">
            <el-input v-model="period" placeholder="7个工作日"></el-input>
          </el-form-item>
          <el-form-item label="送检医院">
            <el-select class="width-100-p" v-model="hospitalId" filterable placeholder="请选择">
              <el-option
                v-for="item in hospitals"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检科室">
            <el-select class="width-100-p" v-model="deptId" filterable placeholder="请选择">
              <el-option
                v-for="item in depts"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检医生">
            <el-input v-model="doctor" placeholder="王大夫"></el-input>
          </el-form-item>
          <el-form-item label="识别代码">
            <el-input v-model="code" placeholder="MDHCARE1001"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadCode()">确定</el-button>
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
      dialogFormVisible: false,
      userId: 0,
      name: '',
      solutionList: [],
      price: null,
      period: null,
      code: null,
      selSolution: {},
      hospitals: [],
      depts: [],
      hospitalId: null,
      deptId: null,
      doctor: '',
      uri: null
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      // 获取权限列表
      this.axios.get('channel/user', {
        params: {
          pageSize: this.pageSize,
          pageNum: this.pageNum
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
    downloadCode () {
      this.dialogFormVisible = true
      // 获取权限列表
      this.axios.get('barcode/create/' + this.userId, {
        params: {
          alias: this.selSolution.yzAlias,
          name: this.selSolution.name,
          period: this.period + '个工作日',
          price: this.price,
          code: this.code,
          hospitalId: this.hospitalId,
          deptId: this.deptId,
          doctor: this.doctor,
          uri: this.uri
        }
      }).then(res => {
        window.open(this.axios.defaults.baseURL + '/barcode/down?filename=' + res.data + '&Authorization=' + window.localStorage.token)
      }).catch(err => {
        console.log(err)
      })
    },
    printCode (solutionId) {
      this.dialogFormVisible = true
    },
    selectItem (id, name) {
      this.userId = id
      this.name = name
      this.axios.get('solution').then(res => {
        this.solutionList = res.data
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
      this.dialogFormVisible = true
    }
  },
  watch: {
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
  }
  .user-container .header {
    margin-bottom: 20px;
    font-size: 18px;
  }
  .width-100-p {
    width: 100%;
  }
</style>
