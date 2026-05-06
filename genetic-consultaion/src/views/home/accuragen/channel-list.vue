<template>
  <div>
    <div class="company-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>安易筛</el-breadcrumb-item>
          <el-breadcrumb-item>渠道管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 个渠道</div>
      </div>

      <div class="opera-bar">
        <el-button size="small" type="primary" @click="toAdd">新增渠道</el-button>
        <el-input
          v-model="condition"
          placeholder="搜索公司名称"
          size="small"
          clearable
          class="search-input"
          @keyup.enter.native="getData"
          @clear="getData">
          <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
        </el-input>
      </div>

      <el-table
        :data="channelList"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载渠道列表"
        style="width: 100%">
        <el-table-column prop="full_name" label="姓名" width="140" fixed="left"></el-table-column>
        <el-table-column label="联系电话" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.cellphone || '—' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责区域" min-width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.province">{{ scope.row.province }} {{ scope.row.city }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110">
          <template slot-scope="scope">
            <el-tag :type="scope.row.state === 3 ? 'success' : 'warning'" size="mini" disable-transitions>
              {{ stateLabel(scope.row.state) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.create_time | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="140">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.update_time">{{ scope.row.update_time | formatDate }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row)">审核分配</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有渠道商</p>
            <p class="empty-hint">渠道商提交申请后会在这里显示</p>
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

    <el-dialog title="审核分配产品" :visible.sync="dialogEditFormVisible" width="780px">
      <div class="callout" v-if="editChannel.full_name">
        <h5>渠道信息</h5>
        <p>{{ editChannel.full_name }} · <span class="num">{{ editChannel.cellphone }}</span></p>
        <p class="addr" v-if="editChannel.province">{{ editChannel.province }} {{ editChannel.city }}</p>
      </div>

      <el-table
        ref="multipleTable"
        :data="proList"
        size="mini"
        border
        v-loading="proLoading"
        element-loading-text="加载授权产品"
        @selection-change="handleProSelectionChange"
        style="width: 100%">
        <el-table-column type="selection" width="44"></el-table-column>
        <el-table-column label="授权产品" width="220" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="终端价格" width="160">
          <template slot-scope="scope">
            <el-input type="number" step="0.01" min="0" size="mini" v-model="scope.row.proxyPrice" placeholder="价格"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="代理区域">
          <template slot-scope="scope">
            <el-input v-model="scope.row.proxyArea" size="mini" placeholder="省 / 市"></el-input>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">暂无可授权产品</p>
          </div>
        </template>
      </el-table>

      <span slot="footer">
        <el-button @click="dialogEditFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onEditSubmit">确定授权</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate, apiSubmit } from '@/utils/pc'

export default {
  name: 'AccuragenChannelList',
  data () {
    return {
      channelList: [],
      proList: [],
      pageNum: parseInt(window.sessionStorage.firmPageNum) || 1,
      pageSize: parseInt(window.sessionStorage.firmPageSize) || 20,
      totalPage: 0,
      loading: false,
      proLoading: false,
      condition: null,
      editChannel: {},
      proSelection: [],
      dialogEditFormVisible: false,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined
    }
  },
  filters: { formatDate },
  methods: {
    stateLabel (state) {
      return state === 3 ? '审核通过' : '待审核'
    },
    _initData () {
      this.getData()
    },
    getData () {
      this.loading = true
      this.axios.get('accuragen/saleman', {
        params: {
          group: '安易筛',
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId,
          condition: this.condition
        }
      }).then(res => {
        this.channelList = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('渠道列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
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
      this.proList = []
      this.proSelection = []
      this.dialogEditFormVisible = true
      this.proLoading = true
      apiSubmit(this.axios, 'post', 'product/group/limit', {
        group: '安易筛',
        hospitalId: 0,
        userId: this.userId
      }, { userId: this.userId }).then(res => {
        const area = (item.province || '') + (item.city || '')
        this.proList = (res.data || []).map(p => Object.assign({}, p, { proxyArea: area }))
      }).catch(err => {
        console.log(err)
        this.$message.error('授权产品加载失败')
      }).then(() => {
        this.proLoading = false
      })
    },
    toAdd () {
      this.$router.push({ name: 'ChannelAdd' })
    },
    onEditSubmit () {
      if (!this.proSelection.length) {
        this.$message.warning('请勾选要授权的产品')
        return
      }
      const productsProxy = this.proSelection
        .filter(p => p.proxyPrice)
        .map(p => ({
          userId: this.editChannel.id,
          productId: p.id,
          solutionId: p.sid,
          productArea: p.productArea,
          proxyPrice: p.proxyPrice,
          operatId: this.userId
        }))
      if (!productsProxy.length) {
        this.$message.warning('请为已勾选产品填写终端价格')
        return
      }
      apiSubmit(this.axios, 'post', 'user/sale/confirm', productsProxy, {
        userId: this.editChannel.id,
        group: '安易筛'
      }).then(() => {
        this.$message.success('授权已保存')
        this.dialogEditFormVisible = false
        this._initData()
      }).catch(err => {
        console.log(err)
        this.$message.error('授权失败，请稍后重试')
      })
    },
    handleProSelectionChange (val) {
      this.proSelection = val
    }
  },
  created () {
    this._initData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.company-container {
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
  .num { font-variant-numeric: tabular-nums; }
  .addr { color: var(--pc-ink-500); }
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
