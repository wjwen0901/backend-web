<template>
  <div class="pc-page">
    <div class="user-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>诠见康 · 维汝健</el-breadcrumb-item>
          <el-breadcrumb-item>发票记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 张发票</div>
      </div>

      <div class="opera-box">
        <el-button size="small" type="primary" @click="toAdd">新增</el-button>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载发票列表"
        style="width: 100%">
        <el-table-column prop="invoiceType" label="类型" width="110" fixed="left"></el-table-column>
        <el-table-column label="状态" width="120" fixed="left">
          <template slot-scope="scope">
            <el-tag :type="invoiceStatusType(scope.row.statusStr)" size="mini" disable-transitions>{{ scope.row.statusStr || '—' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="抬头" min-width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.title">{{ scope.row.title }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="税号" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.dutyNumber">{{ scope.row.dutyNumber }}</span>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="100" align="right">
          <template slot-scope="scope">
            <span class="num amount">¥{{ scope.row.price || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接收信息" min-width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.receiver">
              {{ scope.row.receiver.receiver }}
              <span class="meta">{{ scope.row.receiver.cellphone }}</span>
              <p class="receiver-addr">{{ formatAddress(scope.row.receiver) }}</p>
            </div>
            <span v-else class="muted">—</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="140">
          <template slot-scope="scope">
            <span class="num">{{ scope.row.applyTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮寄时间" width="140">
          <template slot-scope="scope">
            <span class="num" v-if="scope.row.sendTime">{{ scope.row.sendTime | formatDate }}</span>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)">订单</el-button>
            <el-button type="text" size="mini" @click="toConfirm(scope.row)" v-if="scope.row.status === 1">审核提醒</el-button>
            <el-button type="text" size="mini" @click="toExpress(scope.row)" v-if="scope.row.status === 1 || scope.row.status === 2">邮寄</el-button>
            <el-button type="text" size="mini" @click="toExpress(scope.row)" v-if="scope.row.status === 3">重新邮寄</el-button>
          </template>
        </el-table-column>

        <template slot="empty">
          <div class="empty">
            <p class="empty-title">还没有发票记录</p>
            <p class="empty-hint">用户申请发票后会在这里显示</p>
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

      <el-dialog title="订单详情" :visible.sync="dialogEditFormVisible" width="800px">
        <el-table :data="invoiceDetail" size="mini" border style="width: 100%">
          <el-table-column prop="orderNo" label="订单编号" width="200">
            <template slot-scope="scope"><span class="num">{{ scope.row.orderNo }}</span></template>
          </el-table-column>
          <el-table-column prop="productName" label="检测产品" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="hospitalName" label="送检医院" min-width="200" show-overflow-tooltip></el-table-column>
          <el-table-column label="订单金额" width="120" align="right">
            <template slot-scope="scope"><span class="num amount">¥{{ scope.row.orderPrice || 0 }}</span></template>
          </el-table-column>
          <el-table-column label="下单时间" width="140">
            <template slot-scope="scope"><span class="num">{{ scope.row.create_time | formatDate }}</span></template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog title="寄送发票" :visible.sync="dialogExpressFormVisible" width="640px">
        <div class="callout" v-if="expressItem.dContact">
          <h5>收件人信息</h5>
          <p>{{ expressItem.dContact }} · {{ expressItem.dTel }}</p>
          <p class="addr">{{ expressItem.dProvince }} {{ expressItem.dCity }} {{ expressItem.dCounty }} {{ expressItem.dAddress }}</p>
        </div>
        <el-form ref="form" :model="expressItem" label-width="100px" size="small">
          <el-form-item label="寄件人姓名">
            <el-input v-model="expressItem.jContact"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input type="tel" v-model="expressItem.jTel"></el-input>
          </el-form-item>
          <el-form-item label="公司 / 单位">
            <el-input v-model="expressItem.jCompany"></el-input>
          </el-form-item>
          <el-form-item label="省市区">
            <el-cascader class="width-100-p" :options="regionData" v-model="areaInfo" @change="addressHandleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="expressItem.jAddress"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="2" v-model="expressItem.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogExpressFormVisible = false">取消</el-button>
          <el-button type="primary" @click="onExpressSubmit">确定寄送</el-button>
        </span>
      </el-dialog>

      <el-dialog title="审核通过" :visible.sync="dialogConfirmFormVisible" width="640px">
        <div class="callout">
          <h5>开票人信息</h5>
          <p>抬头：{{ expressItem.title || '—' }}</p>
          <p>税号：{{ expressItem.dutyNumber || '—' }}</p>
          <p>金额：<span class="num amount">¥{{ expressItem.price || 0 }}</span></p>
          <p>收件人：{{ expressItem.dContact }} · {{ expressItem.dTel }}</p>
          <p class="addr">{{ expressItem.dProvince }} {{ expressItem.dCity }} {{ expressItem.dCounty }} {{ expressItem.dAddress }}</p>
        </div>
        <el-form ref="form" :model="expressItem" label-width="100px" size="small">
          <el-form-item label="通知内容">
            <el-input
              type="textarea"
              :rows="3"
              v-model="expressItem.note"
              placeholder="您的发票将于 14 个工作日内开出，请关注快递消息">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogConfirmFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmInvoice">确定发送</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import {
  formatDate,
  formatAddress,
  apiSubmit,
  BRCA_INVOICE_STATUS_TYPE,
  typeOf
} from '@/utils/pc'

export default {
  name: 'WrjInvoice',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      invoiceDetail: [],
      dialogEditFormVisible: false,
      dialogExpressFormVisible: false,
      dialogConfirmFormVisible: false,
      expressItem: {},
      condition: null,
      userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
      regionData: regionData,
      CodeToText: CodeToText,
      TextToCode: TextToCode
    }
  },
  computed: {
    areaInfo: {
      get () {
        const e = this.expressItem
        if (!e.jCounty) return []
        try {
          const province = this.TextToCode[e.jProvince].code
          const cityKey = e.jCity === e.jProvince ? '市辖区' : e.jCity
          const city = this.TextToCode[e.jProvince][cityKey].code
          const county = this.TextToCode[e.jProvince][cityKey][e.jCounty].code
          return [province, city, county]
        } catch (err) {
          return []
        }
      },
      set () {}
    }
  },
  filters: { formatDate },
  methods: {
    invoiceStatusType (statusStr) { return typeOf(BRCA_INVOICE_STATUS_TYPE, statusStr) },
    formatAddress: formatAddress,
    _initData () { this.getData() },
    getData () {
      this.loading = true
      this.axios.get('invoice/list', {
        params: { pageNum: this.pageNum, pageSize: this.pageSize, userId: this.userId, condition: this.condition }
      }).then(res => {
        this.list = res.data.list || []
        this.pageSize = res.data.pageSize
        this.pageNum = res.data.pageNum
        this.totalPage = res.data.total
      }).catch(err => {
        console.log(err)
        this.$message.error('发票列表加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange (val) { this.pageSize = val; this.getData() },
    handleCurrentChange (val) { this.pageNum = val; this.getData() },
    toAdd () { this.$message.info('请前往维汝健公众号申请发票') },
    toDetail (id) {
      this.axios.get('invoice/detail/' + id).then(res => {
        this.invoiceDetail = res.data
        this.dialogEditFormVisible = true
      }).catch(err => {
        console.log(err)
        this.$message.error('加载订单详情失败')
      })
    },
    toExpress (invoice) {
      const r = invoice.receiver || {}
      this.expressItem = {
        invoiceId: invoice.id,
        receiverId: invoice.receiverId,
        dContact: r.receiver,
        dTel: r.cellphone,
        dProvince: r.province,
        dCity: r.city,
        dCounty: r.county,
        dAddress: r.address
      }
      this.dialogExpressFormVisible = true
    },
    toConfirm (invoice) {
      const r = invoice.receiver || {}
      this.expressItem = Object.assign({}, invoice, {
        invoiceId: invoice.id,
        receiverId: invoice.receiverId,
        dContact: r.receiver,
        dTel: r.cellphone,
        dProvince: r.province,
        dCity: r.city,
        dCounty: r.county,
        dAddress: r.address
      })
      this.dialogConfirmFormVisible = true
    },
    onExpressSubmit () {
      apiSubmit(this.axios, 'post', 'sf/invoice', this.expressItem, { invoiceId: this.expressItem.invoiceId })
        .then(() => {
          this.$message.success('寄送信息已提交')
          this.dialogExpressFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('提交失败，请稍后重试')
        })
    },
    confirmInvoice () {
      apiSubmit(this.axios, 'put', 'invoice/confirm/' + this.expressItem.invoiceId, this.expressItem, { note: this.expressItem.note })
        .then(() => {
          this.$message.success('已发送审核提醒')
          this.dialogConfirmFormVisible = false
          this._initData()
        })
        .catch(err => {
          console.log(err)
          this.$message.error('发送失败，请稍后重试')
        })
    },
    addressHandleChange (value) {
      this.expressItem.jProvince = this.CodeToText[value[0]]
      this.expressItem.jCity = this.CodeToText[value[1]]
      this.expressItem.jCounty = this.CodeToText[value[2]]
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
  margin-bottom: 16px;
}

.empty {
  padding: 40px 0 24px;
  text-align: center;
  .empty-title { margin: 0 0 4px; font-size: var(--pc-fs-14); color: var(--pc-ink-600); }
  .empty-hint { margin: 0; font-size: var(--pc-fs-12); color: var(--pc-ink-400); }
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
  p { margin: 2px 0; font-size: var(--pc-fs-12); color: var(--pc-ink-700); }
  .addr { color: var(--pc-ink-500); }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
}

.width-100-p { width: 100%; }

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-right: 4px; }
  .amount { color: var(--pc-ink-800); font-weight: 500; }
  .muted { color: var(--pc-ink-400); }
  .receiver-addr { margin: 2px 0 0; font-size: var(--pc-fs-12); color: var(--pc-ink-500); }
}
</style>
