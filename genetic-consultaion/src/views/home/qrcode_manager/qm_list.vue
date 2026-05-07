<template>
  <div>
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>二维码管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 个二维码</div>
      </div>

      <div class="pc-toolbar">
        <el-select
          v-model="subscripType"
          filterable
          clearable
          placeholder="所有公众号"
          size="small"
          style="width: 160px"
          @change="search">
          <el-option v-for="item in subscripTypeArr" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
        <el-input
          class="grow"
          placeholder="搜索关键字"
          size="small"
          v-model="keyword"
          clearable
          @keyup.enter.native="search">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="toAdd">新增二维码</el-button>
      </div>

      <el-table
        :data="tableData"
        border
        size="mini"
        v-loading="loading"
        element-loading-text="加载二维码"
        style="width: 100%">
        <el-table-column fixed prop="subscripType" label="公众号" width="120"></el-table-column>
        <el-table-column prop="fullName" label="申请人" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.fullName">{{ scope.row.fullName }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="160">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="访问次数" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetailList(scope.row)">
              <span class="num">{{ scope.row.scanNo || 0 }}</span>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="描述" min-width="240" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{ scope.row.remark }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="getQrcode(scope.row)">下载</el-button>
            <el-button type="text" size="mini" @click="open(scope.row)">查看链接</el-button>
            <el-button type="text" size="mini" @click="toEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">尚无二维码</p>
            <p class="empty-hint">点击右上角"新增二维码"创建公众号带参二维码</p>
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

    <el-dialog title="二维码链接" :visible.sync="dialogVisible" width="560px">
      <div class="link-box">
        <span class="num">{{ codeUrl || '—' }}</span>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" class="tag-read" :data-clipboard-text="codeUrl" @click="copy">复制链接</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { formatDate, apiSubmit } from '@/utils/pc'

export default {
  name: 'QmList',
  data () {
    return {
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      totalPage: 0,
      keyword: '',
      subscripType: null,
      subscripTypeArr: [
        { name: '易得好康', value: 'mdhcare' },
        { name: '易见康', value: 'ru6c' },
        { name: '见山会诊', value: 'gensultation' },
        { name: '安易筛', value: 'accuragen' },
        { name: '迈基诺', value: 'mygeno' },
        { name: '诠见康', value: 'qx' }
      ],
      dialogVisible: false,
      codeUrl: '',
      loading: false
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      this.axios.get('wechat/qrcode/page', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.keyword || undefined,
          subscripType: this.subscripType || undefined
        }
      }).then(res => {
        this.tableData = (res.data && res.data.list) || []
        this.pageSize = res.data.pageSize || this.pageSize
        this.pageNum = res.data.pageNum || this.pageNum
        this.totalPage = res.data.total || 0
      }).catch(err => {
        console.log(err)
        this.$message.error('二维码列表加载失败，请稍后重试')
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
    },
    search () {
      this.pageNum = 1
      this.getData()
    },
    getQrcode (row) {
      const matched = this.subscripTypeArr.find(s => s.name === row.subscripType)
      const subscripType = matched ? matched.value : 'mdhcare'
      apiSubmit(this.axios, 'post', 'barcode/createWechat', null, { qrcodeId: row.id, subscripType })
        .then(res => {
          window.open(this.axios.defaults.baseURL + '/barcode/down?isPatientCode=false&filename=' + res.data + '&Authorization=' + window.localStorage.token)
        })
        .catch(err => {
          console.log(err)
          this.$message.error('二维码生成失败，请稍后重试')
        })
    },
    toAdd () {
      this.$router.push({ name: 'QmAdd' })
    },
    toDetailList (row) {
      this.$router.push({ name: 'DetailList', query: { qrcodeId: row.id, subscripType: row.subscripType } })
    },
    toEdit (row) {
      this.$router.push({ name: 'QmEdit', query: { qrcodeId: row.id } })
    },
    open (row) {
      this.codeUrl = row.codeUrl || ''
      this.dialogVisible = true
    },
    copy () {
      const clipboard = new Clipboard('.tag-read')
      clipboard.on('success', () => {
        this.$message.success('已复制')
        this.dialogVisible = false
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        this.$message.error('复制失败，请手动选择')
        clipboard.destroy()
      })
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

.link-box {
  background: var(--pc-ink-50);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 12px 14px;
  word-break: break-all;
  font-size: var(--pc-fs-13);
  color: var(--pc-ink-800);
  .num { font-family: var(--pc-font-mono); font-size: var(--pc-fs-12); }
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .muted { color: var(--pc-ink-400); }
}
</style>
