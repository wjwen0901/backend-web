<template>
  <div>
    <!--<el-button class="add-user" size="mini" type="primary" @click="toAdd">新增用户</el-button>-->
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
        fixed
        prop="fullName"
        label="姓名">
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
        width="180">
        <template slot-scope="scope">
          <el-button @click="selectItem(scope.row.id, scope.row.name)" type="text" size="small" v-if="scope.row.role === 1 || scope.row.role === 8">产品二维码</el-button>
          <el-button @click="selectPayItem(scope.row.id, scope.row.name)" type="text" size="small" v-if="scope.row.role === 1 || scope.row.role === 8">收款二维码</el-button>
          <el-button @click="selectOnlineInformed(scope.row.id, scope.row.name)" type="text" size="small" v-if="scope.row.role === 1 || scope.row.role === 8">在线知情码</el-button>
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
          <el-form-item label="角色">
            <el-radio-group v-model="userResource.roleCode" size="small" @change="getSecResource">
              <el-radio label="business-agent">业务员</el-radio>
              <el-radio label="channel">渠道商</el-radio>
              <el-radio label="firm-service" v-if="currentUserRole === 'manager'">实验室客服</el-radio>
              <el-radio label="jk-service" v-if="currentUserRole === 'manager'">“见康”客服</el-radio>
              <el-radio label="doctor" v-if="currentUserRole === 'manager'">医生</el-radio>
              <el-radio label="patient" v-if="currentUserRole === 'manager'">患者</el-radio>
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
    <el-dialog title="生成二维码" :visible.sync="dialogCodeFormVisible">
      <div>
        <el-form ref="form" label-width="150px">
          <el-form-item label="选择产品">
            <el-select v-model="qrCode.selSolution" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in solutionList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品优惠链接">
            <el-input v-model="qrCode.url" placeholder="http://..."></el-input>
          </el-form-item>
          <el-form-item label="单价">
            <el-input v-model="qrCode.price" placeholder="1300"></el-input>
          </el-form-item>
          <el-form-item label="检测周期（工作日）">
            <el-input-number v-model="qrCode.period" :min="1" :max="100" label="请输入"></el-input-number>
            <!--<el-input type="" v-model="period" placeholder="7"></el-input>&lt;!&ndash;&ndash;&gt;-->
          </el-form-item>
          <el-form-item label="送检医院">
            <el-autocomplete
              class="inline-input"
              v-model="qrCode.hospitalName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
            <!--<el-select class="width-100-p" v-model="qrCode.hospitalId" filterable placeholder="请选择">-->
              <!--<el-option-->
                <!--v-for="item in hospitals"-->
                <!--:key="item.id"-->
                <!--:label="item.name"-->
                <!--:value="item.id">-->
              <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="送检科室">
            <el-select class="width-100-p" v-model="qrCode.deptId" filterable placeholder="请选择">
              <el-option
                v-for="item in depts"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检医生">
            <el-input v-model="qrCode.doctor" placeholder="王大夫"></el-input>
          </el-form-item>
          <el-form-item label="识别代码">
            <el-input v-model="qrCode.code" placeholder="MDHCARE1001"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadCode()">确定</el-button>
            <el-button @click="dialogFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="生成收款二维码" :visible.sync="dialogPayCodeFormVisible">
      <div>
        <el-form ref="form" label-width="150px">
          <el-form-item label="选择产品">
            <el-select v-model="qrCode.selSolution" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in solutionList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检医院">
            <el-autocomplete
              class="inline-input"
              v-model="qrCode.hospitalName"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              :trigger-on-focus="false"
              @select="handleSelect"
            ></el-autocomplete>
            <!--<el-select class="width-100-p" v-model="qrCode.hospitalId" filterable placeholder="请选择">-->
            <!--<el-option-->
            <!--v-for="item in hospitals"-->
            <!--:key="item.id"-->
            <!--:label="item.name"-->
            <!--:value="item.id">-->
            <!--</el-option>-->
            <!--</el-select>-->
          </el-form-item>
          <el-form-item label="送检科室">
            <el-select class="width-100-p" v-model="qrCode.deptId" filterable placeholder="请选择">
              <el-option
                v-for="item in depts"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检医生">
            <el-input v-model="qrCode.doctor" placeholder="王大夫"></el-input>
          </el-form-item>
          <el-form-item label="收款价格">
            <el-input v-model="qrCode.price" placeholder="1300"></el-input>
          </el-form-item>
          <el-form-item label="项目描述">
            <el-input v-model="qrCodeDescription" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadPayCode()">确定</el-button>
            <el-button @click="dialogPayCodeFormVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="生成个人下单二维码" :visible.sync="dialogOnlineInformedFormVisible">
      <div>
        <el-form ref="form" label-width="150px">
          <el-form-item label="选择产品">
            <el-select v-model="informedQrCode.selSolution" value-key="id" filterable placeholder="请选择">
              <el-option
                v-for="item in solutionList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="样本类型">
            <el-input v-model="informedQrCode.sampleType" placeholder="口腔拭子"></el-input>
          </el-form-item>
          <el-form-item label="检测费用">
            <el-input v-model="informedQrCode.price" placeholder="688"></el-input>
          </el-form-item>
          <el-form-item label="采样盒编号">
            <el-input v-model="informedQrCode.sampCode" placeholder="180314276"></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="informedQrCode.time" placeholder=""></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="downloadOnlineInformedCode()">确定</el-button>
            <el-button @click="dialogOnlineInformedFormVisible = false">取消</el-button>
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
      dialogEditFormVisible: false,
      dialogCodeFormVisible: false,
      dialogPayCodeFormVisible: false,
      dialogOnlineInformedFormVisible: false,
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
      roleCode: this.$route.params.role,
      currentUserRole: window.localStorage.role,
      condition: null,
      qrCode: {},
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
      }]
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.resourceList = []
      if (this.roleCode !== 'normal') {
        // 获取权限列表
        this.axios.get('user/secs', {
          params: {
            role: this.roleCode
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
      }
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
          role: this.roleCode,
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
      this.dialogEditFormVisible = true
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
      this.dialogEditFormVisible = true
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
        _this.dialogEditFormVisible = false
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
        console.log(this.resourceList)
        console.log(this.resourceSelet)
      }).catch(err => {
        console.log(err)
      })
    },
    selectItem (id, name) {
      this.userId = id
      this.name = name
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
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
      this.dialogCodeFormVisible = true
    },
    selectPayItem (id, name) {
      this.userId = id
      this.name = name
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
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
      this.dialogPayCodeFormVisible = true
    },
    selectOnlineInformed (id, name) {
      this.userId = id
      this.name = name
      this.axios.get('solution', {
        params: {
          userId: window.localStorage.userId
        }
      }).then(res => {
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
      this.dialogOnlineInformedFormVisible = true
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
              'id': item.id
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
      this.qrCode.hospitalId = item.id
    },
    downloadCode () {
      this.dialogCodeFormVisible = false
      // 获取权限列表
      this.axios.get('barcode/create/' + this.userId, {
        params: {
          userId: this.userId,
          solutionId: this.qrCode.selSolution.id,
          period: this.qrCode.period,
          price: this.qrCode.price,
          url: this.qrCode.url,
          // solutionId: 149,
          alias: this.qrCode.selSolution.yzAlias,
          // alias: '3evj0vgmgvie1',
          // name: '结直肠癌化疗套餐—2',
          name: this.qrCode.selSolution.name,
          code: this.qrCode.code,
          hospitalId: this.qrCode.hospitalId,
          hospitalName: this.qrCode.hospitalName,
          deptId: this.qrCode.deptId,
          doctor: this.qrCode.doctor
        }
      }).then(res => {
        window.open(this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
      }).catch(err => {
        console.log(err)
      })
    },
    downloadPayCode () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      this.qrCode.solutionId = this.qrCode.selSolution.id
      instance({
        method: 'post',
        url: 'barcode/payCode/' + this.userId,
        params: {
          alias: this.qrCode.selSolution.yzAlias
        },
        data: {
          userId: this.userId,
          solutionId: this.qrCode.selSolution.id,
          price: this.qrCode.price,
          reportCycle: this.qrCode.period,
          hospitalId: this.qrCode.hospitalId,
          deptId: this.qrCode.deptId,
          doctor: this.qrCode.doctor,
          alias: this.qrCode.selSolution.yzAlias,
          description: this.qrCodeDescription
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        window.open(_this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
        _this.dialogPayCodeFormVisible = false
      })
    },
    downloadOnlineInformedCode () {
      let instance = this.axios.create({
        headers: {
          'Authorization': window.localStorage.token,
          'Content-Type': 'application/json'
        }
      })
      let _this = this
      instance({
        method: 'post',
        url: 'barcode/createPatient',
        params: {
          solutionId: this.informedQrCode.selSolution.id,
          sampleType: this.informedQrCode.sampleType,
          sampCode: this.informedQrCode.sampCode,
          solutionName: this.informedQrCode.selSolution.name,
          validityDate: this.informedQrCode.time,
          unitPrice: this.informedQrCode.price
        },
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        window.open(_this.axios.defaults.baseURL + '/barcode/down?isPatientCode=true&filename=' + res.data + '&Authorization=' + window.localStorage.token)
        _this.dialogPayCodeFormVisible = false
      })
    }
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
    qrCodeDescription: function () {
      return (this.qrCode.hospitalName !== '' && this.qrCode.selSolution !== undefined) ? (this.qrCode.hospitalName + '(' + this.qrCode.selSolution.name + ')收费码-[M' + this.userId + ']') : ''
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
