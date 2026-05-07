<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/qrcode-manager/list' }">二维码管理</el-breadcrumb-item>
          <el-breadcrumb-item>访问详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 次访问</div>
      </div>

      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="loading"
        element-loading-text="加载访问记录"
        style="width: 100%">
        <el-table-column prop="subscripType" label="公众号" width="120"></el-table-column>
        <el-table-column label="访问时间" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.wechatUserLog && scope.row.wechatUserLog.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="微信昵称" width="160" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.nickname">{{ scope.row.nickname }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.headimgurl" :src="scope.row.headimgurl" alt="" class="avatar">
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="关注时间" width="160">
          <template slot-scope="scope">
            <span v-if="scope.row.subscribeTime" class="num">{{ scope.row.subscribeTime * 1000 | formatDate }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column prop="sampleNum" label="样本数量" width="100">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.sampleNum || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="OpenID" min-width="280" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="num openid">{{ scope.row.wechatUserLog && scope.row.wechatUserLog.openId || '—' }}</span>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无访问记录</p>
            <p class="empty-hint">用户扫码后访问记录会显示在这里</p>
          </div>
        </template>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 30, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'DetailList',
  data () {
    return {
      tableData: [],
      qrcodeId: this.$route.query.qrcodeId,
      subscripType: this.$route.query.subscripType,
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      loading: false
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('wechat/qrcode/scanlog/page', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, qrcodeId: this.qrcodeId }
      }).then(res => {
        const userLogs = (res.data && res.data.userLogs) || []
        userLogs.forEach(item => { item.subscripType = this.subscripType })
        this.tableData = userLogs
        this.totalPage = res.data.totalNum || 0
      }).catch(err => {
        console.log(err)
        this.$message.error('访问记录加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    }
  },
  created () {
    this.getData()
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

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: var(--pc-bd-hair);
  object-fit: cover;
  display: block;
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
  .openid { font-family: var(--pc-font-mono); font-size: var(--pc-fs-12); color: var(--pc-ink-600); }
}
</style>
