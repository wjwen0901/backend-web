<template>
  <div class="pc-page pc-dashboard">
    <div class="pc-page-title">
      <h2>运营总览</h2>
      <span class="desc">数据每 5 分钟刷新 · 数据源：order / report / informed / hospital</span>
    </div>

    <!-- KPI 行 -->
    <div class="pc-page-section pc-kpi-grid">
      <div class="pc-kpi" v-for="(k, i) in kpis" :key="k.key">
        <div class="pc-kpi__label">{{ k.label }}</div>
        <div class="pc-kpi__value" :ref="'kpi' + i">0</div>
        <div class="pc-kpi__delta" :class="{ 'is-down': k.delta < 0 }" v-if="k.delta !== null">
          <i :class="k.delta >= 0 ? 'el-icon-top' : 'el-icon-bottom'"></i>
          {{ k.delta >= 0 ? '+' : '' }}{{ k.delta }}% · 较上周
        </div>
        <svg class="pc-kpi__spark" viewBox="0 0 92 36" preserveAspectRatio="none">
          <polyline class="pc-spark-line" :points="sparkPts(k.spark)"></polyline>
        </svg>
      </div>
    </div>

    <!-- 趋势 + 待办 -->
    <div class="pc-page-section pc-section-row">
      <div class="pc-card">
        <div class="card-head">
          <div class="card-title">订单 / 报告 趋势 · 近 30 天</div>
          <div class="card-legend">
            <span><i class="seg seg-primary"></i> 订单</span>
            <span><i class="seg seg-accent"></i> 报告</span>
          </div>
        </div>
        <svg viewBox="0 0 600 200" class="trend-svg">
          <g v-for="y in [40, 80, 120, 160]" :key="y">
            <line :x1="0" :y1="y" :x2="600" :y2="y" stroke="#E5E7EB" stroke-dasharray="2 4" />
          </g>
          <polyline :points="trendPts(trend.order)" fill="none" stroke="#0E7A6E" stroke-width="1.8" />
          <polyline :points="trendPts(trend.report)" fill="none" stroke="#2EBDAE" stroke-width="1.8" stroke-dasharray="3 3" />
          <g v-for="(d, i) in trend.dates" :key="'l' + i">
            <text v-if="i % 5 === 0"
                  :x="i * (600 / (trend.dates.length - 1))"
                  y="195" font-size="9" fill="#6B7280" text-anchor="middle">{{ d }}</text>
          </g>
        </svg>
      </div>

      <div class="pc-card">
        <div class="card-title">
          待办 <span class="card-sub">({{ todos.length }})</span>
        </div>
        <ul class="todo-list">
          <li v-for="t in todos" :key="t.id" class="todo-item">
            <span class="todo-text">
              <el-tag :class="'el-tag--' + t.tag" class="todo-tag">{{ t.tagText }}</el-tag>
              {{ t.text }}
            </span>
            <span class="todo-time">{{ t.time }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 11 状态分布 -->
    <div class="pc-card pc-page-section">
      <div class="card-title">订单状态分布</div>
      <div class="card-sub">全部 11 个业务状态（D3）· 当前样本 {{ orderTotal || 0 }} 单</div>
      <div class="pc-statusbar">
        <span v-for="seg in statusSegs" :key="seg.code"
              :style="{ width: seg.pct + '%', background: seg.color }"
              :title="seg.label + ' · ' + seg.count + ' (' + seg.pct.toFixed(1) + '%)'"></span>
      </div>
      <div class="pc-statusbar-legend">
        <span v-for="seg in statusSegs" :key="'l' + seg.code">
          <i class="dot" :style="{ background: seg.color }"></i>
          {{ seg.label }} · <b>{{ seg.count }}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import PC from '@/utils/pc.js'

export default {
  name: 'dashboard',
  data () {
    return {
      // KPI 4 项 —— value/delta 来自后端 /overview，spark 暂用前端示意
      // TODO(dashboard-trend): 后端接口提供 趋势数组 + 状态分布 + 待办列表 后替换
      kpis: [
        { key: 'inf', label: '知情同意（累计）', value: 0, delta: null, spark: [12, 16, 14, 18, 22, 20, 26, 24, 28, 32, 30, 36] },
        { key: 'rep', label: '已出报告（累计）', value: 0, delta: null, spark: [22, 21, 24, 28, 25, 30, 29, 33, 32, 35, 36, 40] },
        { key: 'hos', label: '合作医院',         value: 0, delta: null, spark: [3, 5, 4, 6, 7, 7, 8, 8, 9, 9, 10, 11] },
        { key: 'pat', label: '活跃客户',         value: 0, delta: null, spark: [42, 40, 44, 42, 41, 38, 40, 39, 41, 40, 38, 36] }
      ],
      trend: {
        dates: Array.from({ length: 30 }, (_, i) => (i + 1) + 'd'),
        order: [],
        report: []
      },
      // TODO(dashboard-todo): 后端接口提供待办时替换
      todos: [
        { id: 1, tag: 'warn', tagText: '待付款',  text: '订单 ED20251248 超过 24h 未支付', time: '12 分钟前' },
        { id: 2, tag: 'prog', tagText: '待复核',  text: 'BRCA 报告 R-2891 等待信息复核',   time: '37 分钟前' },
        { id: 3, tag: 'info2', tagText: '待采样', text: '8 单订单待采样，含 3 单 48h 内',   time: '1 小时前' },
        { id: 4, tag: 'pos',  tagText: '阳性',    text: '报告 R-2856 标记阳性，请优先寄出', time: '2 小时前' },
        { id: 5, tag: 'succ', tagText: '已审核',  text: '12 份报告完成审核，待寄出',         time: '今早 09:14' }
      ],
      // TODO(dashboard-status): 后端 /dashboard/status-distribution 替换
      statusCounts: {},
      orderTotal: 0
    }
  },
  computed: {
    statusSegs () {
      const total = this.orderTotal || 1
      return Array.from({ length: 11 }, (_, k) => k + 1).map(code => {
        const m = PC.mapStatus(code)
        const count = this.statusCounts[code] || 0
        return {
          code: code,
          label: m.label,
          count: count,
          pct: count / total * 100,
          color: PC.STATUS_COLOR[m.type]
        }
      })
    }
  },
  methods: {
    sparkPts (arr) { return PC.sparkPoints(arr, 92, 36) },
    trendPts (arr) {
      if (!arr || !arr.length) return ''
      const w = 600
      const h = 200
      const max = Math.max.apply(null, arr)
      const min = Math.min.apply(null, arr)
      const r = max - min || 1
      return arr.map((v, i) => {
        const x = (i / (arr.length - 1)) * w
        const y = h - ((v - min) / r) * (h - 30) - 15
        return x.toFixed(1) + ',' + y.toFixed(1)
      }).join(' ')
    },
    genTrend () {
      // TODO(dashboard-trend): 后端 /dashboard/trend?days=30 接入后替换为真实数据
      const order = []
      const report = []
      let o = 80
      let r = 60
      for (let i = 0; i < 30; i++) {
        o += Math.round((Math.random() - 0.4) * 15)
        r += Math.round((Math.random() - 0.5) * 10)
        order.push(Math.max(40, o))
        report.push(Math.max(30, r))
      }
      this.trend.order = order
      this.trend.report = report
    },
    genMockStatus () {
      // TODO(dashboard-status): 替换为 /dashboard/status-distribution
      const weights = [1, 8, 14, 20, 16, 12, 9, 7, 6, 4, 3]
      const total = weights.reduce((a, b) => a + b, 0)
      const counts = {}
      weights.forEach((w, i) => { counts[i + 1] = Math.round(w * 8) })
      this.statusCounts = counts
      this.orderTotal = Object.values(counts).reduce((a, b) => a + b, 0) || total
    },
    _initData () {
      this.axios.get('overview', {
        params: {
          id: window.localStorage.userId
        }
      }).then(res => {
        this.kpis[0].value = res.data.informedNum || 0
        this.kpis[1].value = res.data.reportNum || 0
        this.kpis[2].value = res.data.hospitalNum || 0
        this.kpis[3].value = res.data.patientNum || 0
        this.runCountUp()
      }).catch(err => {
        console.log(err)
      })
    },
    runCountUp () {
      this.$nextTick(() => {
        this.kpis.forEach((k, i) => {
          const ref = this.$refs['kpi' + i]
          const el = Array.isArray(ref) ? ref[0] : ref
          if (el) PC.countUp(el, k.value, 1100)
        })
      })
    }
  },
  created () {
    this.genTrend()
    this.genMockStatus()
    this._initData()
  }
}
</script>

<style lang="scss" scoped>
.pc-dashboard {
  .card-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .card-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--pc-ink-900);
    margin-bottom: 6px;
  }
  .card-sub {
    font-size: 11.5px;
    color: var(--pc-ink-500);
    margin-bottom: 8px;
    font-weight: 400;
  }
  .card-legend {
    display: flex;
    gap: 14px;
    font-size: 11.5px;
    color: var(--pc-ink-600);
    .seg {
      display: inline-block;
      width: 10px;
      height: 2px;
      vertical-align: 3px;
      margin-right: 4px;
    }
    .seg-primary { background: var(--pc-primary-600); }
    .seg-accent  { background: var(--pc-accent-500); }
  }
  .trend-svg {
    width: 100%;
    height: 200px;
    display: block;
  }
  .todo-list {
    margin: 0;
    padding: 0;
  }
  .todo-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px dashed var(--pc-ink-200);
    font-size: 12.5px;
    list-style: none;
  }
  .todo-item:last-child { border-bottom: none; }
  .todo-tag { margin-right: 6px; }
  .todo-time {
    color: var(--pc-ink-400);
    font-size: 11px;
  }
}
</style>
