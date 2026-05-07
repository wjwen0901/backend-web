<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>主数据</el-breadcrumb-item>
          <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 位客户</div>
      </div>

      <div class="opera-bar">
        <span></span>
        <el-input
          v-model="condition"
          placeholder="搜索姓名 / 手机号 / 邮箱"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="handleSearch"
          @clear="handleSearch">
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
      </div>

      <el-table
        :data="customerList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载客户列表"
        style="width: 100%">
        <el-table-column prop="fullName" label="姓名" min-width="140" fixed="left">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">{{ scope.row.fullName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.cellphone" class="num">{{ scope.row.cellphone }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="订单量" width="100" align="right">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.orderNum || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属公司" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.companyName">{{ scope.row.companyName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="showRoleDialog(scope.row.id)">角色分配</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">{{ condition ? '没有匹配的客户' : '尚无客户数据' }}</p>
            <p class="empty-hint">{{ condition ? '试试调整筛选条件，或清空后重新查询' : '客户注册后会在这里显示' }}</p>
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

    <el-dialog title="角色分配" :visible.sync="roleDialogFormVisible" width="640px">
      <div class="callout" v-if="userResource.fullName">
        <h5>客户信息</h5>
        <p>{{ userResource.fullName }} <span class="meta">{{ userResource.cellphone }}</span></p>
      </div>

      <el-form ref="form" label-width="80px" size="small">
        <el-form-item label="选择公司">
          <el-select
            class="width-100-p"
            v-model="userResource.companyId"
            filterable
            remote
            reserve-keyword
            allow-create
            default-first-option
            placeholder="搜索公司名称"
            :remote-method="getCompanyList"
            :loading="companySelLoading">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-radio-group v-model="userResource.roleCode">
            <el-radio label="business-agent">业务员</el-radio>
            <el-radio label="channel">渠道商</el-radio>
            <el-radio label="firm-service" v-if="roleCode === 'manager'">实验室客服</el-radio>
            <el-radio label="jk-service" v-if="roleCode === 'manager'">见康客服</el-radio>
            <el-radio label="doctor" v-if="roleCode === 'manager'">医生</el-radio>
            <el-radio label="patient" v-if="roleCode === 'manager'">患者</el-radio>
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
      </el-form>

      <span slot="footer">
        <el-button @click="roleDialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit } from '@/utils/pc'

export default {
  name: 'CustomerList',
  data () {
    return {
      customerList: [],
      pageNum: parseInt(window.sessionStorage.customerPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.customerPageSize) || 20,
      totalPage: 0,
      loading: false,
      condition: null,
      roleDialogFormVisible: false,
      userResource: {},
      defaultProps: { children: 'children', label: 'label' },
      resourceList: [],
      resourceSelet: [],
      companyList: [],
      companySelLoading: false,
      roleCode: window.localStorage.role,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  filters: { formatDate },
  methods: {
    _initData () {
      this.getData()
      this.getCompanyList()
    },
    getData () {
      this.loading = true
      this.axios.get('user/customer', {
        params: {
          id: this.userId,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          condition: this.condition
        }
      }).then(res => {
        this.customerList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('客户列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    getCompanyList () {
      this.companySelLoading = true
      this.axios.get('company/CustCompany', {
        params: { userId: this.userId }
      }).then(res => {
        this.companyList = res.data || []
      }).catch(err => {
        console.log(err)
        this.$message.error('公司列表加载失败')
      }).then(() => {
        this.companySelLoading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      window.sessionStorage.customerPageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      window.sessionStorage.customerPageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      window.sessionStorage.customerPageNum = val
      this.getData()
    },
    getSecResource () {
      this.axios.get('user/secs', {
        params: { role: this.userResource.roleCode || 'business-agent' }
      }).then(res => {
        const list = res.data || []
        this.resourceList = list
          .filter(s => s.parentId === 0)
          .map(parent => ({
            id: parent.id,
            label: parent.name,
            children: list
              .filter(c => c.parentId === parent.id)
              .map(c => ({ id: c.id, label: c.name, parent: c.parentId }))
          }))
        this.resourceSelet = []
        const userSecs = this.userResource.secList || []
        for (const sec of userSecs) {
          const parentNode = this.resourceList.find(d => d.id === sec.id)
          const hasChildren = parentNode && parentNode.children.length > 0
          if (sec.parentId === 0 && hasChildren) continue
          this.resourceSelet.push(sec.id)
        }
        if (this.$refs.tree) this.$refs.tree.setCheckedKeys(this.resourceSelet)
      }).catch(err => {
        console.log(err)
      })
    },
    showRoleDialog (id) {
      this.axios.get('user/' + id).then(res => {
        this.userResource = res.data || {}
        this.roleDialogFormVisible = true
        this.$nextTick(() => this.getSecResource())
      }).catch(err => {
        console.log(err)
        this.$message.error('客户信息加载失败')
      })
    },
    save () {
      const checked = (this.$refs.tree && this.$refs.tree.getCheckedNodes()) || []
      const seen = new Set()
      const secArray = []
      for (const sec of checked) {
        if (sec.parent !== undefined && !seen.has(sec.parent)) {
          seen.add(sec.parent)
          secArray.push({ id: sec.parent })
        }
        if (!seen.has(sec.id)) {
          seen.add(sec.id)
          secArray.push({ id: sec.id })
        }
      }
      this.userResource.secList = secArray
      apiSubmit(this.axios, 'put', 'user/' + this.userResource.id, this.userResource)
        .then(() => {
          this.$message.success('角色分配已更新')
          this.roleDialogFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('保存失败，请稍后重试')
        })
    }
  },
  watch: {
    'userResource.roleCode' (to, from) {
      if (to !== from && this.roleDialogFormVisible) this.getSecResource()
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

.opera-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .search-input {
    width: 320px;
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

.callout {
  background: var(--pc-info-100);
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: var(--pc-r-4);

  h5 {
    margin: 0 0 6px;
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-info-700);
    display: flex;
    align-items: center;
    &::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--pc-info-600);
      margin-right: 6px;
    }
  }
  p {
    margin: 2px 0;
    font-size: var(--pc-fs-12);
    color: var(--pc-ink-700);
  }
  .meta { color: var(--pc-ink-400); margin-left: 6px; }
}

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
