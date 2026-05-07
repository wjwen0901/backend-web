<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>BRCA轻松检</el-breadcrumb-item>
          <el-breadcrumb-item>白名单管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 名医生</div>
      </div>

      <div class="opera-box">
        <el-button size="small" type="primary" @click="toAdd">新增医生</el-button>
        <el-input
          placeholder="搜索姓名 / 手机号"
          v-model="condition"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载白名单"
        style="width: 100%">
        <el-table-column prop="name" label="医生姓名" width="100" fixed="left"></el-table-column>
        <el-table-column prop="cellphone" label="手机号" width="120" fixed="left">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.cellphone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hospital" label="医院" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptName" label="科室" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="standardCode" label="医院编码" width="110">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.standardCode">{{ scope.row.standardCode }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="区域" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="meta">{{ scope.row.area }}</span>
            <span> {{ regionLabel(scope.row) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" min-width="240" show-overflow-tooltip></el-table-column>
        <el-table-column prop="serviceTime" label="门诊时间" width="220" show-overflow-tooltip></el-table-column>
        <el-table-column prop="salesman" label="业务代表" width="120"></el-table-column>
        <el-table-column prop="team" label="团队" width="140" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" width="140" v-if="canOperate">
          <template slot-scope="scope">
            <el-button @click="toDetail(scope.row.id)" type="text" size="mini">编辑</el-button>
            <el-button @click="deleteUser(scope.row.id)" type="text" size="mini" class="text-danger">删除</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有匹配的医生</p>
            <p class="empty-hint">{{ condition ? '换个关键词试试' : '尚无白名单医生 — 点上方「新增医生」开始添加' }}</p>
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

      <el-dialog :title="isEdit ? '编辑医生' : '新增医生'" :visible.sync="dialogEditFormVisible" width="640px">
        <el-form ref="form" :model="whitelistDoctor" label-width="80px" size="small">
          <el-form-item label="姓名">
            <el-input v-model="whitelistDoctor.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input type="tel" v-model="whitelistDoctor.cellphone"></el-input>
          </el-form-item>
          <el-form-item label="医院">
            <el-autocomplete
              class="width-100-p"
              v-model="whitelistDoctor.hospital"
              :fetch-suggestions="querySearch"
              placeholder="搜索医院"
              :trigger-on-focus="false"
              @select="handleHospitalSelect"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item label="科室">
            <el-select v-model="whitelistDoctor.deptId" filterable placeholder="请选择" class="width-100-p">
              <el-option v-for="item in depts" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="省市区">
            <el-cascader class="width-100-p" :options="regionData" v-model="areaInfo" @change="addressHandleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="whitelistDoctor.address"></el-input>
          </el-form-item>
          <el-form-item label="门诊时间">
            <el-input v-model="whitelistDoctor.serviceTime" placeholder="如：周一上午、周三下午"></el-input>
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
        </el-form>
        <span slot="footer">
          <el-button @click="dialogEditFormVisible = false">取消</el-button>
          <el-button v-if="!isEdit" type="primary" @click="onAddSubmit">确定新增</el-button>
          <el-button v-else type="primary" @click="onEditSubmit(whitelistDoctor.id)">保存修改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import { apiSubmit } from '@/utils/pc'

export default {
  name: 'BrcaWhitelist',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      whitelistDoctor: {},
      dialogEditFormVisible: false,
      depts: [],
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode
    }
  },
  computed: {
    canOperate () { return this.userId !== 2222 },
    isEdit () { return !!this.whitelistDoctor.id },
    areaInfo: {
      get () {
        const d = this.whitelistDoctor
        if (!d.county) return []
        try {
          const province = this.TextToCode[d.province].code
          const cityKey = d.city === d.province ? '市辖区' : d.city
          const city = this.TextToCode[d.province][cityKey].code
          const county = this.TextToCode[d.province][cityKey][d.county].code
          return [province, city, county]
        } catch (e) {
          return []
        }
      },
      set () {}
    }
  },
  filters: {},
  methods: {
    regionLabel (row) {
      return [row.province, row.city, row.county].filter(Boolean).join(' ')
    },
    _initData () {
      this.getData()
      this.axios.get('hospital-dept', { params: { userId: this.userId } })
        .then(res => { this.depts = res.data })
        .catch(err => console.log(err))
    },
    getData () {
      this.loading = true
      this.axios.get('white/list', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.condition }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('白名单加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () { this.pageNum = 1; this.getData() },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() },
    toAdd () {
      this.whitelistDoctor = {}
      this.dialogEditFormVisible = true
    },
    toDetail (id) {
      this.axios.get('white/' + id, { params: { userId: this.userId } })
        .then(res => {
          this.whitelistDoctor = res.data
          this.dialogEditFormVisible = true
        })
        .catch(err => {
          console.log(err)
          this.$message.error('加载详情失败')
        })
    },
    onAddSubmit () {
      this._submitDoctor('post', 'white')
    },
    onEditSubmit (id) {
      this._submitDoctor('put', 'white/' + id)
    },
    _submitDoctor (method, url) {
      apiSubmit(this.axios, method, url, this.whitelistDoctor, { userId: this.userId })
        .then(() => {
          this.$message.success(method === 'post' ? '新增成功' : '修改成功')
          this.dialogEditFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
    },
    deleteUser (id) {
      this.$confirm('确定删除此医生？', '删除提示', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.delete('white/' + id, { params: { userId: this.userId } })
          .then(() => {
            this.$message.success('删除成功')
            this._initData()
          })
          .catch(err => {
            console.log(err)
            this.$message.error('删除失败，请稍后重试')
          })
      }).catch(() => {})
    },
    querySearch (queryString, cb) {
      this.axios.get('hospital/page', {
        params: { pageNum: 1, pageSize: 8, keywords: queryString, userId: this.userId }
      }).then(res => {
        if (res.data.endRow === 0) {
          cb([])
        } else {
          cb(res.data.list.map(item => ({ value: item.name, id: item.id, hospital: item })))
        }
      }).catch(err => console.log(err))
    },
    handleHospitalSelect (item) {
      this.whitelistDoctor.hospitalId = item.id
      this.whitelistDoctor.standardCode = item.hospital.standardCode
    },
    addressHandleChange (value) {
      this.whitelistDoctor.province = this.CodeToText[value[0]]
      this.whitelistDoctor.city = this.CodeToText[value[1]]
      this.whitelistDoctor.county = this.CodeToText[value[2]]
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

.opera-box {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  .search-input {
    width: 320px;
    margin-left: auto;
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

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-right: 4px; }
  .muted { color: var(--pc-ink-400); }
  .text-danger { color: var(--pc-pos-600) !important; }
  .text-danger:hover { color: var(--pc-pos-700) !important; background: var(--pc-pos-100); }
}
</style>
