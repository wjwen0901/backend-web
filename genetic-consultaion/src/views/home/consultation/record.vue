<template>
  <div class="pc-page">
    <div class="consultation-container">
      <div class="page-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>互医管理</el-breadcrumb-item>
          <el-breadcrumb-item>问诊记录</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="page-meta">共 <strong>{{ totalPage }}</strong> 条记录</div>
      </div>

      <div class="opera-bar">
        <div class="filters">
          <el-input v-model="filterCode" placeholder="问诊编号 MWZ..." size="small" clearable class="code-input" @keyup.enter.native="handleSearch" @clear="handleSearch"></el-input>
          <el-input v-model="filterPatient" placeholder="受检人姓名" size="small" clearable class="name-input" @keyup.enter.native="handleSearch" @clear="handleSearch"></el-input>
          <el-select v-model="filterSource" placeholder="来源" size="small" clearable @change="handleSearch">
            <el-option label="易见康 (ru6c-wx)" value="ru6c-wx"></el-option>
            <el-option label="吉因加 (jiyinjia-wechat)" value="jiyinjia-wechat"></el-option>
          </el-select>
          <el-select v-model="filterStatus" placeholder="状态" size="small" clearable @change="handleSearch">
            <el-option v-for="(s, code) in statusMap" :key="code" :label="s.label" :value="Number(code)"></el-option>
          </el-select>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            class="date-range"
            @change="handleSearch">
          </el-date-picker>
          <el-button size="small" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </div>
      </div>

      <el-table
        :data="list"
        size="mini"
        border
        v-loading="loading"
        element-loading-text="加载问诊记录"
        style="width: 100%">
        <el-table-column label="问诊编号" width="160" fixed="left">
          <template slot-scope="scope"><span class="num">{{ scope.row.sessionCode }}</span></template>
        </el-table-column>
        <el-table-column label="受检人" min-width="130">
          <template slot-scope="scope">
            {{ scope.row.patientName }}
            <span class="meta">{{ genderLabel(scope.row.patientGender) }}<template v-if="scope.row.patientAge != null"> · {{ scope.row.patientAge }}岁</template></span>
          </template>
        </el-table-column>
        <el-table-column prop="indication" label="适应症" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column label="医生" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.doctorName || '—' }}
            <span class="meta">{{ scope.row.doctorTitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来源" width="130">
          <template slot-scope="scope">
            <el-tag size="mini" disable-transitions>{{ scope.row.source }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <el-tag size="mini" :class="statusInfo(scope.row.status).cls" disable-transitions>
              {{ statusInfo(scope.row.status).label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="关联订单" width="190">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.tradeOrderId"
              type="text"
              size="mini"
              class="order-link num"
              @click="toOrder(scope.row.tradeOrderNo, scope.row.tradeOrderId)">
              {{ scope.row.tradeOrderNo || ('#' + scope.row.tradeOrderId) }}
            </el-button>
            <span class="muted" v-else>—</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope"><span class="num">{{ scope.row.createTime | formatDate }}</span></template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="70">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="toDetail(scope.row.id)">详情</el-button>
          </template>
        </el-table-column>
        <template slot="empty">
          <div class="empty">
            <p class="empty-title">没有匹配的问诊记录</p>
            <p class="empty-hint">用户在 H5 完成「提交并问诊」后，记录会出现在这里</p>
          </div>
        </template>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </div>

    <!-- 详情弹窗：会话 + 医生 + 附件 + 完整对话(MongoDB) + 确认单 -->
    <el-dialog title="问诊记录详情" :visible.sync="detailVisible" width="760px" top="5vh">
      <div v-loading="detailLoading" class="detail-body">
        <template v-if="detail.session">
          <div class="detail-section">
            <div class="section-title">会话信息</div>
            <div class="meta-grid">
              <span class="meta-label">问诊编号</span><span class="meta-value num">{{ detail.session.sessionCode }}</span>
              <span class="meta-label">状态</span>
              <span class="meta-value">
                <el-tag size="mini" :class="statusInfo(detail.session.status).cls" disable-transitions>{{ statusInfo(detail.session.status).label }}</el-tag>
              </span>
              <span class="meta-label">受检人</span>
              <span class="meta-value">{{ detail.session.patientName }} {{ genderLabel(detail.session.patientGender) }}<template v-if="detail.session.patientAge != null"> · {{ detail.session.patientAge }}岁</template></span>
              <span class="meta-label">身份证号</span><span class="meta-value num">{{ detail.session.patientIdCard || '—' }}</span>
              <span class="meta-label">适应症</span><span class="meta-value">{{ detail.session.indication || '—' }}</span>
              <span class="meta-label">产品 ID</span><span class="meta-value num">#{{ detail.session.productId }}</span>
              <span class="meta-label">来源</span><span class="meta-value">{{ detail.session.source }}</span>
              <span class="meta-label">关联订单</span>
              <span class="meta-value num">
                <el-button
                  v-if="detail.session.tradeOrderId"
                  type="text"
                  size="mini"
                  class="order-link num"
                  @click="toOrder(detail.tradeOrderNo, detail.session.tradeOrderId)">
                  {{ detail.tradeOrderNo || ('#' + detail.session.tradeOrderId) }} →
                </el-button>
                <template v-else>未下单</template>
              </span>
              <span class="meta-label">创建时间</span><span class="meta-value num">{{ detail.session.createTime | formatDate }}</span>
              <span class="meta-label">医院归档号</span><span class="meta-value num">{{ detail.session.hospitalRefId || '—' }}</span>
            </div>
          </div>

          <div class="detail-section" v-if="detail.doctor">
            <div class="section-title">接诊医生</div>
            <div class="meta-grid">
              <span class="meta-label">姓名</span><span class="meta-value">{{ detail.doctor.name }}（{{ detail.doctor.title }}）</span>
              <span class="meta-label">医院科室</span><span class="meta-value">{{ detail.doctor.hospital }} · {{ detail.doctor.department }}</span>
              <span class="meta-label">执业证编号</span><span class="meta-value num">{{ detail.doctor.licenseNo }}</span>
            </div>
          </div>

          <div class="detail-section" v-if="(detail.attachments || []).length">
            <div class="section-title">病理报告 / 附件（{{ detail.attachments.length }}）</div>
            <div class="attach-list">
              <div class="attach-item" v-for="a in detail.attachments" :key="a.id">
                <el-tag size="mini" disable-transitions>{{ fileTypeLabel(a.fileType) }}</el-tag>
                <span class="attach-name">{{ a.fileName }}</span>
                <a v-if="a.ossUrl" :href="a.ossUrl" target="_blank" rel="noopener" class="attach-link">查看</a>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-title">完整对话（互联网医院归档）</div>
            <div class="chat-list" v-if="(detail.dialogs || []).length">
              <div class="chat-row" v-for="d in detail.dialogs" :key="d.seq" :class="'role-' + d.role">
                <div class="chat-head">
                  <el-tag size="mini" :class="roleInfo(d.role).cls" disable-transitions>{{ roleInfo(d.role).label }}</el-tag>
                  <span class="chat-time num">{{ d.timestamp | formatDate }}</span>
                </div>
                <div class="chat-content">{{ d.content }}</div>
              </div>
            </div>
            <div class="muted" v-else>暂无对话归档</div>
          </div>

          <div class="detail-section" v-if="detail.confirmationCard">
            <div class="section-title">送检确认单</div>
            <div class="confirm-card">
              <div class="meta-grid">
                <span class="meta-label">编号</span><span class="meta-value num">{{ detail.confirmationCard.sessionCode }}</span>
                <span class="meta-label">受检人</span><span class="meta-value">{{ detail.confirmationCard.patientName }} {{ detail.confirmationCard.patientGender }}<template v-if="detail.confirmationCard.patientAge != null"> · {{ detail.confirmationCard.patientAge }}岁</template></span>
                <span class="meta-label">诊断</span><span class="meta-value">{{ detail.confirmationCard.indication }}</span>
                <span class="meta-label">检测项目</span><span class="meta-value">{{ detail.confirmationCard.productName }}</span>
                <span class="meta-label">签发医生</span><span class="meta-value">{{ detail.confirmationCard.doctorName }}（{{ detail.confirmationCard.doctorTitle }}）</span>
                <span class="meta-label">确认时间</span><span class="meta-value num">{{ detail.confirmationCard.confirmedAt | formatDate }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section" v-if="detail.hospitalSubmission">
            <div class="section-title">互联网医院推送（D2 预留）</div>
            <div class="meta-grid">
              <span class="meta-label">推送状态</span><span class="meta-value">{{ detail.hospitalSubmission.status || 'pending' }}</span>
              <span class="meta-label">归档号</span><span class="meta-value num">{{ detail.hospitalSubmission.hospitalRefId || '—' }}</span>
            </div>
          </div>
        </template>
      </div>
      <div slot="footer">
        <el-button @click="detailVisible = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { formatDate } from '@/utils/pc'

export default {
  name: 'ConsultationRecord',
  data () {
    return {
      list: [],
      pageNum: 1,
      pageSize: 20,
      totalPage: 0,
      loading: false,
      filterCode: '',
      filterPatient: '',
      filterSource: '',
      filterStatus: '',
      dateRange: null,
      detailVisible: false,
      detailLoading: false,
      detail: {},
      statusMap: {
        0: { label: '已创建', cls: 'el-tag--warn' },
        1: { label: '信息已提交', cls: 'el-tag--info2' },
        2: { label: '问诊完成', cls: 'el-tag--succ' },
        3: { label: '已取消', cls: '' }
      }
    }
  },
  filters: { formatDate },
  methods: {
    getData () {
      this.loading = true
      const range = this.dateRange || []
      this.axios.get('saas/consultation/session/list', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          sessionCode: this.filterCode || undefined,
          patientName: this.filterPatient || undefined,
          source: this.filterSource || undefined,
          status: this.filterStatus === '' ? undefined : this.filterStatus,
          startDate: range[0] || undefined,
          endDate: range[1] || undefined
        }
      }).then(res => {
        const body = res.data || {}
        if (body.code !== 200) {
          this.$message.error(body.message || '加载失败')
          return
        }
        const page = body.data || {}
        this.list = page.list || []
        this.totalPage = page.total || 0
      }).catch(() => {
        this.$message.error('问诊记录加载失败，请稍后重试')
      }).then(() => {
        this.loading = false
      })
    },
    handleSearch () {
      this.pageNum = 1
      this.getData()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getData()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getData()
    },
    statusInfo (status) {
      return this.statusMap[status] || { label: '未知', cls: '' }
    },
    genderLabel (gender) {
      if (gender === 1) return '男'
      if (gender === 0) return '女'
      return ''
    },
    roleInfo (role) {
      const map = {
        system: { label: '系统', cls: '' },
        patient: { label: '受检人', cls: 'el-tag--info2' },
        doctor: { label: '医生', cls: 'el-tag--succ' }
      }
      return map[role] || { label: role, cls: '' }
    },
    fileTypeLabel (fileType) {
      const map = { pathology: '病理报告', diagnosis: '诊断单', other: '其他' }
      return map[fileType] || fileType
    },
    toOrder (orderNo, orderId) {
      // 跳订单管理页：有订单号按号搜索；待付款收款码订单尚无订单号，用内部 id 精确定位（后端 orderId 参数）
      const query = orderNo ? { condition: orderNo } : { orderId: String(orderId) }
      this.$router.push({ path: '/order', query: query })
    },
    toDetail (id) {
      this.detail = {}
      this.detailVisible = true
      this.detailLoading = true
      this.axios.get('saas/consultation/session/detail/' + id).then(res => {
        const body = res.data || {}
        if (body.code !== 200) {
          this.$message.error(body.message || '详情加载失败')
          return
        }
        this.detail = body.data || {}
      }).catch(() => {
        this.$message.error('详情加载失败，请稍后重试')
      }).then(() => {
        this.detailLoading = false
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.consultation-container {
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
  margin-bottom: 12px;

  .filters {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
  }
  .code-input { width: 180px; }
  .name-input { width: 140px; }
  .date-range { width: 260px; }
}

.detail-body {
  min-height: 200px;
}

.detail-section {
  margin-bottom: 18px;

  .section-title {
    font-size: var(--pc-fs-13);
    font-weight: 600;
    color: var(--pc-ink-800);
    padding-bottom: 6px;
    margin-bottom: 8px;
    border-bottom: var(--pc-bd-hair);
  }
}

.meta-grid {
  display: grid;
  grid-template-columns: 84px 1fr 84px 1fr;
  gap: 6px 8px;
  font-size: var(--pc-fs-13);

  .meta-label { color: var(--pc-ink-400); }
  .meta-value { color: var(--pc-ink-800); word-break: break-all; }
}

.attach-list {
  .attach-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 0;
    font-size: var(--pc-fs-13);

    .attach-name { color: var(--pc-ink-600); }
    .attach-link { color: var(--pc-prog-600); }
  }
}

.chat-list {
  max-height: 320px;
  overflow-y: auto;
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
  padding: 10px 12px;

  .chat-row {
    margin-bottom: 10px;
    &:last-child { margin-bottom: 0; }

    .chat-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 3px;
      .chat-time {
        font-size: var(--pc-fs-12);
        color: var(--pc-ink-400);
      }
    }
    .chat-content {
      font-size: var(--pc-fs-13);
      color: var(--pc-ink-800);
      line-height: 1.6;
      white-space: pre-wrap;
      word-break: break-word;
      background: #f7f8f9;
      border-radius: var(--pc-r-4);
      padding: 6px 10px;
    }
    &.role-doctor .chat-content {
      background: #eef6f3;
    }
  }
}

.confirm-card {
  border: 1px solid var(--pc-ink-800);
  border-radius: var(--pc-r-4);
  padding: 10px 12px;
}

.num { font-variant-numeric: tabular-nums; }
.muted { color: var(--pc-ink-400); }

.order-link {
  padding: 0;
  font-size: var(--pc-fs-13);
}

::v-deep .el-table {
  .num { font-variant-numeric: tabular-nums; }
  .meta { color: var(--pc-ink-400); font-size: var(--pc-fs-12); margin-left: 4px; }
  .muted { color: var(--pc-ink-400); }
}
</style>
