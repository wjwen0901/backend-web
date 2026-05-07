<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>{{ roleLabel }}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位{{ roleLabel }}</div>
      </div>

      <div class="pc-toolbar">
        <el-input
          class="grow"
          placeholder="搜索姓名 / 手机号"
          size="small"
          v-model="condition"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增{{ roleLabel }}</el-button>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载用户"
        style="width: 100%">
        <el-table-column fixed prop="fullName" label="姓名" width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">{{ scope.row.fullName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="手机号" width="130">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ maskPhone(scope.row.cellphone) }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column v-if="roleCode === 'doctor'" prop="hospitalName" label="所属医院" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.hospitalName">{{ scope.row.hospitalName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column v-if="roleCode === 'doctor'" prop="hospitalDeptName" label="所属科室" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.hospitalDeptName">{{ scope.row.hospitalDeptName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column v-if="roleCode !== 'doctor'" prop="companyName" label="所属公司" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{ scope.row.companyName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" min-width="160">
          <template slot-scope="scope">
            <el-tooltip v-if="hasSecList(scope.row)" placement="top" effect="light" :open-delay="200">
              <div slot="content" class="sec-tooltip">
                <div v-for="sec in topSecs(scope.row)" :key="sec.id" class="sec-row">
                  <span class="sec-parent">{{ sec.name }}</span>
                  <span
                    v-for="child in childSecs(scope.row, sec.id)"
                    :key="child.id"
                    class="sec-child">{{ child.name }}</span>
                </div>
              </div>
              <span class="sec-summary">{{ secSummary(scope.row) }}</span>
            </el-tooltip>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-dropdown
              v-if="scope.row.role === 1 || scope.row.role === 8"
              size="mini"
              trigger="click"
              @command="handleQrCommand($event, scope.row)">
              <el-button type="text" size="mini">
                二维码<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="product">产品二维码</el-dropdown-item>
                <el-dropdown-item command="pay">收款二维码</el-dropdown-item>
                <el-dropdown-item command="online">渠道下单码</el-dropdown-item>
                <el-dropdown-item command="elec">在线知情码</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-else @click="selectElecInformed(scope.row)" type="text" size="mini">在线知情码</el-button>
            <el-button v-if="userId !== READONLY_USER_ID" @click="toDetail(scope.row.id)" type="text" size="mini">编辑</el-button>
            <el-button v-if="userId !== READONLY_USER_ID" @click="deleteUser(scope.row.id)" type="text" size="mini" class="danger">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无{{ roleLabel }}</p>
            <p class="empty-hint">点击右上角"新增"按钮添加用户</p>
          </div>
        </template>
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

    <el-dialog :title="userResource.id === undefined ? '新增' + roleLabel : '编辑' + roleLabel" :visible.sync="dialogEditFormVisible" width="640px">
      <el-form ref="userForm" :model="userResource" label-width="90px" size="small">
        <el-form-item label="姓名">
          <el-input v-model="userResource.fullName" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input type="tel" v-model="userResource.cellphone" placeholder="11 位手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="userResource.username" placeholder="登录用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userResource.email" placeholder="可选"></el-input>
        </el-form-item>
        <el-form-item label="所属医院" v-if="userResource.role === 2">
          <el-autocomplete
            class="width-100-p"
            v-model="userResource.hospitalName"
            :fetch-suggestions="querySearchHospital"
            placeholder="输入医院名搜索"
            :trigger-on-focus="false"
            @select="handleUserHospitalSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="所属企业" v-else>
          <el-select v-model="userResource.companyId" filterable placeholder="请选择" class="width-100-p">
            <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="userResource.roleCode" size="small" @change="getSecResource">
            <el-radio label="business-agent">业务员</el-radio>
            <el-radio label="channel">渠道商</el-radio>
            <el-radio label="firm-service" v-if="currentUserRole === 'manager'">实验室客服</el-radio>
            <el-radio label="jk-service" v-if="currentUserRole === 'manager'">"见康"客服</el-radio>
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
            :props="defaultProps"></el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="userResource.remark" :rows="2" placeholder="可选"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="userResource.id === undefined ? onAddSubmit() : onEditSubmit(userResource.id)">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成产品二维码" :visible.sync="dialogCodeFormVisible" width="560px">
      <el-form label-width="120px" size="small">
        <el-form-item label="选择产品">
          <el-select v-model="qrCode.selSolution" value-key="id" filterable placeholder="请选择" class="width-100-p">
            <el-option v-for="item in solutionList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品优惠链接">
          <el-input v-model="qrCode.url" placeholder="http://..."></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="qrCode.price" placeholder="例如 1300"></el-input>
        </el-form-item>
        <el-form-item label="检测周期（工作日）">
          <el-input-number v-model="qrCode.period" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="送检医院">
          <el-autocomplete
            class="width-100-p"
            v-model="qrCode.hospitalName"
            :fetch-suggestions="querySearchHospital"
            placeholder="输入医院名搜索"
            :trigger-on-focus="false"
            @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="送检科室">
          <el-select class="width-100-p" v-model="qrCode.deptId" filterable placeholder="请选择">
            <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送检医生">
          <el-input v-model="qrCode.doctor" placeholder="例如 王大夫"></el-input>
        </el-form-item>
        <el-form-item label="识别代码">
          <el-input v-model="qrCode.code" placeholder="例如 MDHCARE1001"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogCodeFormVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadCode">下载</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成收款二维码" :visible.sync="dialogPayCodeFormVisible" width="560px">
      <el-form label-width="120px" size="small">
        <el-form-item label="选择产品">
          <el-select v-model="qrCode.selSolution" value-key="id" filterable placeholder="请选择" class="width-100-p">
            <el-option v-for="item in solutionList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送检医院">
          <el-autocomplete
            class="width-100-p"
            v-model="qrCode.hospitalName"
            :fetch-suggestions="querySearchHospital"
            placeholder="输入医院名搜索"
            :trigger-on-focus="false"
            @select="handleSelect"></el-autocomplete>
        </el-form-item>
        <el-form-item label="送检科室">
          <el-select class="width-100-p" v-model="qrCode.deptId" filterable placeholder="请选择">
            <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送检医生">
          <el-input v-model="qrCode.doctor" placeholder="例如 王大夫"></el-input>
        </el-form-item>
        <el-form-item label="收款价格">
          <el-input v-model="qrCode.price" placeholder="例如 1300"></el-input>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="payDescription" placeholder="自动生成"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogPayCodeFormVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadPayCode">下载</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成渠道下单码" :visible.sync="dialogOnlineInformedFormVisible" width="560px">
      <el-form label-width="120px" size="small">
        <el-form-item label="选择产品">
          <el-select v-model="informedQrCode.selSolution" value-key="id" filterable placeholder="请选择" class="width-100-p">
            <el-option v-for="item in solutionList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="送检医院">
          <el-autocomplete
            class="width-100-p"
            v-model="informedQrCode.hospitalName"
            :fetch-suggestions="querySearchHospital"
            placeholder="输入医院名搜索"
            :trigger-on-focus="false"
            @select="handleChannelSelect"></el-autocomplete>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogOnlineInformedFormVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadOnlineInformedCode">下载</el-button>
      </div>
    </el-dialog>

    <el-dialog title="生成在线知情码" :visible.sync="dialogElecInformedFormVisible" width="480px">
      <el-form label-width="100px" size="small">
        <el-form-item label="选择产品">
          <el-select v-model="eleInformed.selSolution" value-key="id" filterable placeholder="请选择" class="width-100-p">
            <el-option v-for="item in solutionList" :key="item.id" :label="item.name" :value="item"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogElecInformedFormVisible = false">取消</el-button>
        <el-button type="primary" @click="downloadElecInformedCode">下载</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit, safe } from '@/utils/pc'

const ROLE_LABELS = {
  'business-agent': '业务员',
  'channel': '渠道商',
  'firm-service': '实验室客服',
  'jk-service': '见康客服',
  'doctor': '医生',
  'patient': '患者',
  'normal': '普通用户'
}

const READONLY_USER_ID = 2222

export default {
  name: 'UserList',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      userResource: {},
      dialogEditFormVisible: false,
      dialogCodeFormVisible: false,
      dialogPayCodeFormVisible: false,
      dialogOnlineInformedFormVisible: false,
      dialogElecInformedFormVisible: false,
      resourceList: [],
      resourceSelet: [],
      solutionList: [],
      depts: [],
      defaultProps: { children: 'children', label: 'label' },
      companyList: [],
      roleCode: this.$route.params.role || 'business-agent',
      currentUserRole: window.localStorage.role,
      condition: '',
      qrCode: {},
      eleInformed: {},
      informedQrCode: { sampleType: '口腔拭子', price: 688 },
      targetUserId: undefined,
      targetUserName: '',
      loading: false,
      submitting: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      READONLY_USER_ID
    }
  },
  filters: { formatDate },
  computed: {
    roleLabel () {
      return ROLE_LABELS[this.roleCode] || '用户'
    },
    payDescription () {
      const sol = this.qrCode.selSolution
      const hospital = this.qrCode.hospitalName
      if (sol && hospital) {
        return hospital + '(' + sol.name + ')收费码-[M' + this.targetUserId + ']'
      }
      return ''
    }
  },
  methods: {
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      const tasks = []

      if (this.roleCode !== 'normal') {
        tasks.push(
          this.axios.get('user/secs', { params: { role: this.roleCode } })
            .then(res => { this.resourceList = this.buildResourceTree(res.data || []) })
            .catch(err => console.log(err))
        )
      } else {
        this.resourceList = []
      }

      tasks.push(
        this.axios.get('company')
          .then(res => { this.companyList = res.data || [] })
          .catch(err => console.log(err))
      )
      tasks.push(
        this.axios.get('solution', { params: { userId: this.userId } })
          .then(res => { this.solutionList = res.data || [] })
          .catch(err => console.log(err))
      )
      tasks.push(
        this.axios.get('hospital-dept')
          .then(res => { this.depts = res.data || [] })
          .catch(err => console.log(err))
      )

      tasks.push(
        this.axios.get('user/page', {
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            role: this.roleCode,
            userId: this.userId,
            condition: this.condition
          }
        }).then(res => {
          this.list = (res.data.list || []).map(row => Object.assign({}, row, {
            fullName: safe(row.fullName),
            cellphone: safe(row.cellphone),
            companyName: safe(row.companyName),
            hospitalName: safe(row.hospitalName),
            hospitalDeptName: safe(row.hospitalDeptName)
          }))
          this.pageSize = res.data.pageSize
          this.pageNum = res.data.pageNum
          this.totalPage = res.data.total
        }).catch(err => {
          console.log(err)
          this.$message.error('用户列表加载失败，请稍后重试')
        })
      )

      Promise.all(tasks).then(() => { this.loading = false })
    },
    buildResourceTree (rawList) {
      const tree = []
      for (const sec of rawList) {
        if (sec.parentId === 0) {
          const children = rawList
            .filter(c => c.parentId === sec.id)
            .map(c => ({ id: c.id, label: c.name, parent: c.parentId }))
          tree.push({ id: sec.id, label: sec.name, children })
        }
      }
      return tree
    },
    hasSecList (row) {
      return row.secList && row.secList.some(s => s.parentId === 0)
    },
    topSecs (row) {
      return (row.secList || []).filter(s => s.parentId === 0)
    },
    childSecs (row, parentId) {
      return (row.secList || []).filter(s => s.parentId === parentId)
    },
    secSummary (row) {
      const tops = this.topSecs(row)
      if (!tops.length) return ''
      if (tops.length === 1) {
        const children = this.childSecs(row, tops[0].id)
        return tops[0].name + (children.length ? ' · ' + children.length + ' 项' : '')
      }
      return tops[0].name + ' 等 ' + tops.length + ' 类'
    },
    maskPhone (cellphone) {
      if (this.userId === READONLY_USER_ID && cellphone) {
        return cellphone.substring(0, 4) + '*******'
      }
      return cellphone
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    search () {
      this.pageNum = 1
      this.getData()
    },
    toAdd () {
      this.userResource = { roleCode: this.roleCode }
      this.resourceSelet = []
      this.dialogEditFormVisible = true
      this.$nextTick(() => {
        if (this.$refs.tree) this.$refs.tree.setCheckedKeys([])
      })
    },
    collectSecArray () {
      const seen = new Set()
      const secArray = []
      for (const sec of this.$refs.tree.getCheckedNodes()) {
        if (sec.parent !== undefined && !seen.has(sec.parent)) {
          seen.add(sec.parent); secArray.push({ id: sec.parent })
        }
        if (!seen.has(sec.id)) {
          seen.add(sec.id); secArray.push({ id: sec.id })
        }
      }
      return secArray
    },
    onAddSubmit () {
      this.userResource.secList = this.collectSecArray()
      this.userResource.roleCode = this.userResource.roleCode || this.roleCode
      this.submitting = true
      apiSubmit(this.axios, 'post', 'user', this.userResource, { userId: this.userId })
        .then(() => {
          this.$message.success('用户已新增')
          this.dialogEditFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('新增失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    toDetail (id) {
      this.axios.get('user/' + id).then(res => {
        this.userResource = res.data || {}
        this.refreshTreeChecks()
      }).catch(err => {
        console.log(err)
        this.$message.error('用户详情加载失败')
      })
      this.dialogEditFormVisible = true
    },
    refreshTreeChecks () {
      this.resourceSelet = []
      const treeData = (this.$refs.tree && this.$refs.tree.data) || this.resourceList
      for (const sec of (this.userResource.secList || [])) {
        const node = treeData.find(d => d.id === sec.id)
        const hasChildren = node && node.children && node.children.length > 0
        if (sec.parentId === 0 && hasChildren) continue
        this.resourceSelet.push(sec.id)
      }
      this.$nextTick(() => {
        if (this.$refs.tree) this.$refs.tree.setCheckedKeys(this.resourceSelet)
      })
    },
    onEditSubmit (id) {
      this.userResource.secList = this.collectSecArray()
      this.submitting = true
      apiSubmit(this.axios, 'put', 'user/' + id, this.userResource, { userId: this.userId })
        .then(() => {
          this.$message.success('用户已更新')
          this.dialogEditFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('更新失败，请稍后重试')
        })
        .then(() => { this.submitting = false })
    },
    deleteUser (id) {
      this.$confirm('确定删除此用户?', '删除用户', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('user/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('已删除')
            this._initData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('删除失败，请稍后重试')
          })
      }).catch(() => {})
    },
    getSecResource (val) {
      this.axios.get('user/secs', { params: { role: val } })
        .then(res => {
          this.resourceList = this.buildResourceTree(res.data || [])
          this.refreshTreeChecks()
        })
        .catch(err => console.log(err))
    },
    handleQrCommand (cmd, row) {
      if (cmd === 'product') this.selectItem(row)
      else if (cmd === 'pay') this.selectPayItem(row)
      else if (cmd === 'online') this.selectOnlineInformed(row)
      else if (cmd === 'elec') this.selectElecInformed(row)
    },
    selectItem (row) {
      this.targetUserId = row.id
      this.targetUserName = row.fullName || row.name
      this.qrCode = {}
      this.dialogCodeFormVisible = true
    },
    selectPayItem (row) {
      this.targetUserId = row.id
      this.targetUserName = row.fullName || row.name
      this.qrCode = {}
      this.dialogPayCodeFormVisible = true
    },
    selectOnlineInformed (row) {
      this.targetUserId = row.id
      this.targetUserName = row.fullName || row.name
      this.informedQrCode = { sampleType: '口腔拭子', price: 688 }
      this.dialogOnlineInformedFormVisible = true
    },
    selectElecInformed (row) {
      this.targetUserId = row.id
      this.targetUserName = row.fullName || row.name
      this.eleInformed = {}
      this.dialogElecInformedFormVisible = true
    },
    querySearchHospital (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString }
      }).then(res => {
        if (!res.data || res.data.endRow === 0) return cb([])
        cb((res.data.list || []).map(item => ({ value: item.name, id: item.id })))
      }).catch(err => {
        console.log(err)
        cb([])
      })
    },
    handleSelect (item) { this.qrCode.hospitalId = item.id },
    handleChannelSelect (item) { this.informedQrCode.hospitalId = item.id },
    handleUserHospitalSelect (item) { this.userResource.hospitalId = item.id },
    barcodeOpen (filename) {
      window.open(this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + filename + '&Authorization=' + window.localStorage.token)
    },
    downloadCode () {
      if (!this.qrCode.selSolution) {
        this.$message.warning('请选择产品')
        return
      }
      this.dialogCodeFormVisible = false
      this.axios.get('barcode/create/' + this.targetUserId, {
        params: {
          userId: this.targetUserId,
          solutionId: this.qrCode.selSolution.id,
          period: this.qrCode.period,
          price: this.qrCode.price,
          url: this.qrCode.url,
          alias: this.qrCode.selSolution.yzAlias,
          name: this.qrCode.selSolution.name,
          code: this.qrCode.code,
          hospitalId: this.qrCode.hospitalId,
          hospitalName: this.qrCode.hospitalName,
          deptId: this.qrCode.deptId,
          doctor: this.qrCode.doctor
        }
      }).then(res => {
        this.barcodeOpen(res.data)
      }).catch(err => {
        console.log(err)
        this.$message.error('生成失败')
      })
    },
    downloadPayCode () {
      if (!this.qrCode.selSolution) {
        this.$message.warning('请选择产品')
        return
      }
      const sol = this.qrCode.selSolution
      apiSubmit(this.axios, 'post', 'barcode/payCode/' + this.targetUserId, {
        userId: this.targetUserId,
        solutionId: sol.id,
        price: this.qrCode.price,
        reportCycle: this.qrCode.period,
        hospitalId: this.qrCode.hospitalId,
        deptId: this.qrCode.deptId,
        doctor: this.qrCode.doctor,
        alias: sol.yzAlias,
        description: this.payDescription
      }, { userId: this.userId, alias: sol.yzAlias })
        .then(res => {
          this.barcodeOpen(res.data)
          this.dialogPayCodeFormVisible = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('生成失败')
        })
    },
    downloadOnlineInformedCode () {
      if (!this.informedQrCode.selSolution) {
        this.$message.warning('请选择产品')
        return
      }
      apiSubmit(this.axios, 'post', 'barcode/channel', {
        solutionId: this.informedQrCode.selSolution.id,
        userId: this.targetUserId,
        hospitalId: this.informedQrCode.hospitalId
      }, { userId: this.userId })
        .then(res => {
          this.barcodeOpen(res.data)
          this.dialogOnlineInformedFormVisible = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('生成失败')
        })
    },
    downloadElecInformedCode () {
      if (!this.eleInformed.selSolution) {
        this.$message.warning('请选择产品')
        return
      }
      const sol = this.eleInformed.selSolution
      apiSubmit(this.axios, 'post', 'barcode/elecInformed', null, {
        userId: this.userId,
        salesmanId: this.targetUserId,
        solutionId: sol.id,
        solutionName: sol.name,
        fullName: this.targetUserName,
        description: this.payDescription
      })
        .then(res => {
          this.barcodeOpen(res.data)
          this.dialogElecInformedFormVisible = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('生成失败')
        })
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.params.role) {
        this.roleCode = this.$route.params.role
        this.pageNum = 1
        this.getData()
      }
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-container {
  margin: 20px 0;
  padding: 20px;
  background: var(--pc-white);
  border-radius: var(--pc-r-4);
  box-shadow: var(--pc-sh-1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 14px;
  margin-bottom: 16px;
  border-bottom: var(--pc-bd-hair);

  .page-meta {
    font-size: var(--pc-fs-13);
    color: var(--pc-ink-500);
    strong {
      color: var(--pc-ink-800);
      font-weight: 600;
      font-variant-numeric: tabular-nums;
    }
  }
}

.empty {
  padding: 40px 0 24px;
  text-align: center;
  .empty-title {
    margin: 0 0 4px;
    font-size: var(--pc-fs-14);
    color: var(--pc-ink-600);
  }
  .empty-hint {
    margin: 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-400);
  }
}

.sec-summary {
  display: inline-block;
  padding: 1px 8px;
  border-radius: var(--pc-r-2);
  background: var(--pc-primary-50);
  color: var(--pc-primary-700);
  font-size: var(--pc-fs-12);
  font-weight: 500;
  cursor: help;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.danger { color: var(--pc-neg-600); }

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>

<style rel="stylesheet/scss" lang="scss">
.sec-tooltip {
  max-width: 320px;
  font-size: var(--pc-fs-12);

  .sec-row {
    margin-bottom: 4px;
    &:last-child { margin-bottom: 0; }
  }
  .sec-parent {
    display: inline-block;
    margin-right: 6px;
    font-weight: 600;
    color: var(--pc-ink-800);
  }
  .sec-child {
    display: inline-block;
    margin-right: 8px;
    color: var(--pc-ink-500);
  }
}
</style>
