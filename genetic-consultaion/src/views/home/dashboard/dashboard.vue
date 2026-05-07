<template>
  <div class="pc-page pc-dashboard">
    <div class="pc-page-meta-row" v-if="sourceLabel">{{ sourceLabel }}</div>

    <div class="ops-grid">
      <div class="ops-card"
           v-for="item in operationMetrics"
           :key="item.key"
           @click="goOrderList">
        <div class="ops-card__head">
          <span>{{ item.label }}</span>
          <el-tag size="small" :class="'el-tag--' + item.tone">{{ item.tag }}</el-tag>
        </div>
        <div class="ops-card__value">{{ formatNumber(item.value) }}</div>
        <div class="ops-card__note">{{ item.note }}</div>
      </div>
    </div>

    <div class="ops-main">
      <div class="pc-card trend-card">
        <div class="card-head">
          <div>
            <div class="card-title">近 7 日趋势</div>
            <div class="card-sub">新增订单与待处理流入，只显示需要关注的变化</div>
          </div>
          <el-button size="mini" icon="el-icon-refresh" :loading="loading" @click="loadDashboard">刷新</el-button>
        </div>

        <div class="trend-legend" v-if="hasTrendData">
          <span><i class="legend-dot is-info"></i>新增订单</span>
          <span><i class="legend-dot is-warn"></i>待处理</span>
        </div>
        <div class="trend-bars" v-if="hasTrendData">
          <div class="trend-day" v-for="day in trendDays" :key="day.key">
            <div class="trend-track">
              <span class="trend-fill is-info" :style="{ height: barHeight(day.orders) }"></span>
              <span class="trend-fill is-warn" :style="{ height: barHeight(day.pending) }"></span>
            </div>
            <div class="trend-count">{{ day.orders }}/{{ day.pending }}</div>
            <div class="trend-label">{{ day.label }}</div>
          </div>
        </div>
        <div class="ops-empty trend-empty" v-else>
          <i class="el-icon-date"></i>
          <h3>近 7 日没有新增订单</h3>
          <p>当前没有新的订单流入和待处理流入，重点查看状态压力与处理队列。</p>
        </div>
      </div>

      <div class="pc-card action-card">
        <div class="card-head">
          <div>
            <div class="card-title">处理队列</div>
            <div class="card-sub">按异常、逾期、缺报告、缺资料排序</div>
          </div>
          <el-button size="mini" type="primary" plain @click="goOrderList">进入订单</el-button>
        </div>

        <ul class="action-list" v-if="actionItems.length">
          <li class="action-item" v-for="item in actionItems" :key="item.key">
            <div class="action-main">
              <el-tag size="small" :class="'el-tag--' + item.tone">{{ item.type }}</el-tag>
              <div>
                <div class="action-title">{{ item.title }}</div>
                <div class="action-meta">{{ item.meta }}</div>
              </div>
            </div>
            <el-button type="text" size="small" @click.stop="goOrderDetail(item)">查看</el-button>
          </li>
        </ul>

        <div class="ops-empty" v-else>
          <i class="el-icon-circle-check"></i>
          <h3>{{ loading ? '正在读取订单' : '当前没有待处理项' }}</h3>
          <p>{{ loading ? '订单接口返回后会自动更新处理队列。' : '当前加载订单未发现异常、缺报告或缺资料问题。' }}</p>
        </div>
      </div>
    </div>

    <div class="ops-bottom">
      <div class="pc-card status-card">
        <div class="card-head">
          <div>
            <div class="card-title">状态压力</div>
            <div class="card-sub">来自当前加载订单，优先暴露积压状态</div>
          </div>
        </div>
        <div class="status-list" v-if="statusSummary.length">
          <div class="status-row" v-for="item in statusSummary" :key="item.label">
            <el-tag size="small" :class="'el-tag--' + item.tone">{{ item.label }}</el-tag>
            <span class="status-count">{{ formatNumber(item.count) }}</span>
            <span class="status-bar" :class="'is-' + item.tone"><i :style="{ width: statusWidth(item.count) }"></i></span>
          </div>
        </div>
        <div class="ops-empty is-compact" v-else>
          <i class="el-icon-document"></i>
          <h3>暂无订单状态</h3>
          <p>订单数据返回后会显示状态压力。</p>
        </div>
      </div>

      <div class="pc-card source-card">
        <div class="card-title">数据说明</div>
        <div class="source-row">
          <span>接口</span>
          <b>order/user</b>
        </div>
        <div class="source-row">
          <span>加载</span>
          <b>{{ orderList.length }} / {{ orderTotal || orderList.length }} 单</b>
        </div>
        <div class="source-row">
          <span>更新时间</span>
          <b>{{ loadedAtText }}</b>
        </div>
        <div class="source-error" v-if="loadError">{{ loadError }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      loading: false,
      orderList: [],
      orderTotal: 0,
      loadedAt: null,
      loadError: ''
    }
  },
  computed: {
    sourceLabel () {
      return '订单接口实时聚合 · 当前加载 ' + this.formatNumber(this.orderList.length) + ' / ' + this.formatNumber(this.orderTotal || this.orderList.length) + ' 单'
    },
    loadedAtText () {
      return this.loadedAt ? this.formatDateTime(this.loadedAt) : '-'
    },
    operationMetrics () {
      return [
        {
          key: 'today',
          label: '今日待处理',
          value: this.orderList.filter(order => this.isToday(this.latestTime(order)) && this.requiresAction(order)).length,
          tone: 'warn',
          tag: '今日',
          note: '今天新增且需要运营处理'
        },
        {
          key: 'abnormal',
          label: '异常订单',
          value: this.orderList.filter(order => this.isAbnormalOrder(order) || this.isUnpaidOverdue(order)).length,
          tone: 'pos',
          tag: '风险',
          note: '取消、异常或超 24h 待付款'
        },
        {
          key: 'report',
          label: '待上传报告',
          value: this.orderList.filter(order => this.needsReportUpload(order)).length,
          tone: 'info2',
          tag: '报告',
          note: '订单未关闭且还没有报告'
        },
        {
          key: 'material',
          label: '待补资料',
          value: this.orderList.filter(order => this.needsMaterial(order)).length,
          tone: 'prog',
          tag: '资料',
          note: '缺知情、样本号或客户信息'
        }
      ]
    },
    trendDays () {
      const days = []
      const today = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i)
        const key = this.dateKey(date)
        const dayOrders = this.orderList.filter(order => this.dateKey(this.toDate(order.createTime)) === key)
        const dayPending = this.orderList.filter(order => this.dateKey(this.latestTime(order)) === key && this.requiresAction(order))
        days.push({
          key: key,
          label: this.shortDate(date),
          orders: dayOrders.length,
          pending: dayPending.length
        })
      }
      return days
    },
    trendMax () {
      const values = []
      this.trendDays.forEach(day => {
        values.push(day.orders)
        values.push(day.pending)
      })
      return Math.max.apply(null, values.concat([1]))
    },
    hasTrendData () {
      return this.trendDays.some(day => day.orders > 0 || day.pending > 0)
    },
    actionItems () {
      const items = []
      this.orderList.forEach(order => {
        if (this.isAbnormalOrder(order)) {
          items.push(this.makeActionItem(order, '异常', 'pos', '订单状态异常或已取消', 1))
        }
        if (this.isUnpaidOverdue(order)) {
          items.push(this.makeActionItem(order, '逾期', 'warn', '待付款超过 24 小时', 2))
        }
        if (this.needsReportUpload(order)) {
          items.push(this.makeActionItem(order, '报告', 'info2', '还没有上传报告', 3))
        }
        if (this.needsMaterial(order)) {
          items.push(this.makeActionItem(order, '资料', 'prog', '资料不完整', 4))
        }
      })
      return items.sort((a, b) => {
        if (a.severity !== b.severity) return a.severity - b.severity
        return b.timeValue - a.timeValue
      }).slice(0, 6)
    },
    statusSummary () {
      const counts = {}
      this.orderList.forEach(order => {
        const label = order.statusStr || '未知状态'
        counts[label] = (counts[label] || 0) + 1
      })
      return Object.keys(counts).map(label => ({
        label: label,
        count: counts[label],
        tone: this.statusTone(label)
      })).sort((a, b) => b.count - a.count).slice(0, 6)
    },
    statusMax () {
      if (!this.statusSummary.length) return 1
      return Math.max.apply(null, this.statusSummary.map(item => item.count).concat([1]))
    }
  },
  methods: {
    loadDashboard () {
      this.loading = true
      this.loadError = ''
      this.axios.get('order/user', {
        params: {
          userId: window.localStorage.userId ? parseInt(window.localStorage.userId) : undefined,
          pageNum: 1,
          pageSize: 2000,
          condition: ''
        }
      }).then(res => {
        const data = res.data || {}
        this.orderList = Array.isArray(data.list) ? data.list : []
        this.orderTotal = data.total || this.orderList.length
        this.loadedAt = new Date()
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.orderList = []
        this.orderTotal = 0
        this.loadedAt = new Date()
        this.loadError = '订单数据加载失败，请确认后端服务和登录状态。'
        this.loading = false
      })
    },
    makeActionItem (order, type, tone, reason, severity) {
      const time = this.latestTime(order)
      return {
        key: type + '-' + severity + '-' + (order.id || order.orderNo || order.createTime || order.pName || 'unknown'),
        orderId: order.id,
        expressCode: order.expressCode,
        expressId: order.expressId,
        type: type,
        tone: tone,
        severity: severity,
        timeValue: time ? time.getTime() : 0,
        title: order.orderNo || '未编号订单',
        meta: reason + ' · ' + (order.pName || order.fullName || '未填写客户') + ' · ' + (order.statusStr || '未知状态')
      }
    },
    requiresAction (order) {
      return this.isAbnormalOrder(order) || this.isUnpaidOverdue(order) || this.needsReportUpload(order) || this.needsMaterial(order)
    },
    isClosedOrder (order) {
      const status = order.statusStr || ''
      return status.indexOf('取消') !== -1 || status.indexOf('报告已出') !== -1 || status.indexOf('已出报告') !== -1 || status.indexOf('已寄出') !== -1
    },
    isAbnormalOrder (order) {
      const status = order.statusStr || ''
      return status.indexOf('异常') !== -1 || status.indexOf('取消') !== -1 || Number(order.payment) < 0
    },
    isUnpaidOverdue (order) {
      const status = order.statusStr || ''
      const createdAt = this.toDate(order.createTime)
      if (!createdAt) return false
      const unpaid = status.indexOf('待付款') !== -1 || status.indexOf('收款码待付款') !== -1
      return unpaid && (new Date().getTime() - createdAt.getTime()) / 3600000 >= 24
    },
    needsReportUpload (order) {
      return !this.isClosedOrder(order) && Number(order.reportNum || 0) === 0
    },
    needsMaterial (order) {
      if (this.isClosedOrder(order)) return false
      return Number(order.informedNum || 0) === 0 || !order.sampleCode || !order.pName || !order.pCellphone
    },
    latestTime (order) {
      return this.toDate(order.successTime) || this.toDate(order.payTime) || this.toDate(order.createTime)
    },
    toDate (value) {
      if (!value) return null
      const date = value instanceof Date ? value : new Date(value)
      return isNaN(date.getTime()) ? null : date
    },
    isToday (date) {
      return !!date && this.dateKey(date) === this.dateKey(new Date())
    },
    dateKey (date) {
      if (!date) return ''
      return date.getFullYear() + '-' + this.pad(date.getMonth() + 1) + '-' + this.pad(date.getDate())
    },
    shortDate (date) {
      return this.pad(date.getMonth() + 1) + '/' + this.pad(date.getDate())
    },
    formatDateTime (date) {
      return this.dateKey(date) + ' ' + this.pad(date.getHours()) + ':' + this.pad(date.getMinutes())
    },
    pad (n) {
      return n < 10 ? '0' + n : '' + n
    },
    formatNumber (value) {
      const num = Number(value || 0)
      return isNaN(num) ? '0' : num.toLocaleString()
    },
    barHeight (value) {
      if (!value) return '0%'
      const pct = Math.max(6, value / this.trendMax * 100)
      return pct.toFixed(1) + '%'
    },
    statusWidth (value) {
      if (!value) return '0%'
      return Math.max(6, value / this.statusMax * 100).toFixed(1) + '%'
    },
    statusTone (status) {
      if (status.indexOf('阳性') !== -1 || status.indexOf('异常') !== -1 || status.indexOf('取消') !== -1) return 'pos'
      if (status.indexOf('待付款') !== -1 || status.indexOf('收款码待付款') !== -1) return 'warn'
      if (status.indexOf('已下单') !== -1 || status.indexOf('待采样') !== -1) return 'info2'
      if (status.indexOf('待回寄') !== -1 || status.indexOf('寄样') !== -1 || status.indexOf('签收') !== -1 || status.indexOf('检测') !== -1 || status.indexOf('复核') !== -1) return 'prog'
      if (status.indexOf('报告') !== -1 || status.indexOf('审核') !== -1 || status.indexOf('寄出') !== -1) return 'succ'
      if (status.indexOf('阴性') !== -1) return 'neg'
      return 'info2'
    },
    goOrderList () {
      this.$router.push('/order')
    },
    goOrderDetail (item) {
      if (!item.orderId) {
        this.goOrderList()
        return
      }
      this.$router.push({ path: '/order/' + item.orderId, query: { expressCode: item.expressCode, expressId: item.expressId } })
    }
  },
  created () {
    this.loadDashboard()
  }
}
</script>

<style lang="scss" scoped>
.pc-dashboard {
  .card-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 12px;
  }

  .card-title {
    color: var(--pc-ink-900);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
  }

  .card-sub {
    margin-top: 4px;
    color: var(--pc-ink-500);
    font-size: 11.5px;
  }
}

.pc-page-meta-row {
  font-size: 12px;
  color: var(--pc-ink-500);
  letter-spacing: .2px;
  margin: 0 0 12px;
  line-height: 1.5;
}

.ops-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--pc-space-16);
  margin-bottom: var(--pc-space-16);
}

.ops-card {
  min-height: 116px;
  padding: var(--pc-space-16);
  background: var(--pc-white);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-6);
  box-shadow: var(--pc-sh-1);
  cursor: pointer;
  transition: border-color var(--pc-dur-2) var(--pc-ease), background var(--pc-dur-2) var(--pc-ease);
}

.ops-card:hover {
  border-color: var(--pc-ink-300);
  background: var(--pc-ink-50);
}

.ops-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: var(--pc-ink-600);
  font-size: 12px;
}

.ops-card__value {
  margin-top: 14px;
  color: var(--pc-ink-900);
  font-family: var(--pc-font-mono);
  font-size: 28px;
  font-weight: 700;
  line-height: 1;
  font-feature-settings: "tnum";
}

.ops-card__note {
  margin-top: 10px;
  color: var(--pc-ink-500);
  font-size: 11.5px;
}

.ops-main {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, .95fr);
  gap: var(--pc-space-16);
  margin-bottom: var(--pc-space-16);
}

.ops-bottom {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: var(--pc-space-16);
}

.trend-legend {
  display: flex;
  align-items: center;
  gap: var(--pc-space-16);
  color: var(--pc-ink-500);
  font-size: 11.5px;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 5px;
  border-radius: 50%;
  vertical-align: -1px;
}

.legend-dot.is-info { background: var(--pc-info-600); }
.legend-dot.is-warn { background: var(--pc-warn-600); }

.trend-bars {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 12px;
  height: 248px;
  margin-top: 16px;
  padding-top: 6px;
  border-top: 1px solid var(--pc-ink-100);
}

.trend-day {
  display: grid;
  grid-template-rows: 1fr auto auto;
  gap: 7px;
  min-width: 0;
}

.trend-track {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 5px;
  min-height: 164px;
  padding: 8px 5px;
  background: var(--pc-ink-50);
  border: var(--pc-bd-hair);
  border-radius: var(--pc-r-4);
}

.trend-fill {
  display: block;
  width: 12px;
  min-height: 0;
  border-radius: var(--pc-r-2) var(--pc-r-2) 0 0;
  transition: height var(--pc-dur-3) var(--pc-ease);
}

.trend-fill.is-info { background: var(--pc-info-600); }
.trend-fill.is-warn { background: var(--pc-warn-600); }

.trend-count {
  color: var(--pc-ink-700);
  font-family: var(--pc-font-mono);
  font-size: 11.5px;
  text-align: center;
  font-feature-settings: "tnum";
}

.trend-label {
  color: var(--pc-ink-400);
  font-size: 11px;
  text-align: center;
}

.action-list {
  margin: 0;
  padding: 0;
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--pc-ink-200);
  list-style: none;
}

.action-item:last-child {
  border-bottom: none;
}

.action-main {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.action-title {
  max-width: 260px;
  overflow: hidden;
  color: var(--pc-ink-900);
  font-family: var(--pc-font-mono);
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-meta {
  max-width: 300px;
  margin-top: 3px;
  overflow: hidden;
  color: var(--pc-ink-500);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ops-empty {
  padding: 32px 0 28px;
  text-align: center;
}

.ops-empty.is-compact {
  padding: 20px 0 16px;
}

.ops-empty i {
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: var(--pc-r-6);
  background: var(--pc-info-100);
  color: var(--pc-info-600);
  font-size: 17px;
}

.ops-empty h3 {
  margin: 10px 0 5px;
  color: var(--pc-ink-900);
  font-size: 13px;
}

.ops-empty p {
  margin: 0;
  color: var(--pc-ink-500);
  font-size: 12px;
}

.trend-empty {
  min-height: 236px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--pc-ink-100);
}

.status-list {
  display: grid;
  gap: 9px;
}

.status-row {
  display: grid;
  grid-template-columns: 118px 52px 1fr;
  align-items: center;
  gap: 10px;
}

.status-count {
  color: var(--pc-ink-700);
  font-family: var(--pc-font-mono);
  font-size: 12px;
  text-align: right;
  font-feature-settings: "tnum";
}

.status-bar {
  height: 6px;
  overflow: hidden;
  background: var(--pc-ink-100);
  border-radius: var(--pc-r-4);
}

.status-bar i {
  display: block;
  height: 100%;
  background: var(--pc-info-600);
  border-radius: inherit;
}

.status-bar.is-warn i { background: var(--pc-warn-600); }
.status-bar.is-info2 i { background: var(--pc-info-600); }
.status-bar.is-prog i { background: var(--pc-prog-600); }
.status-bar.is-succ i { background: var(--pc-succ-600); }
.status-bar.is-pos i { background: var(--pc-pos-600); }
.status-bar.is-neg i { background: var(--pc-neg-600); }

.source-card {
  min-height: 170px;
}

.source-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed var(--pc-ink-200);
  color: var(--pc-ink-500);
  font-size: 12px;
}

.source-row b {
  color: var(--pc-ink-900);
  font-family: var(--pc-font-mono);
  font-size: 12px;
  font-weight: 600;
  text-align: right;
}

.source-error {
  margin-top: var(--pc-space-12);
  padding: var(--pc-space-8) var(--pc-space-12);
  border-radius: var(--pc-r-6);
  background: var(--pc-pos-100);
  color: var(--pc-pos-700);
  font-size: 12px;
}

@media (max-width: 1360px) {
  .ops-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ops-main,
  .ops-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
