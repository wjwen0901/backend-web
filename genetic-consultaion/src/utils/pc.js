/* ===========================================================
 * 易得好康 后台设计系统 v0.2 · 工具函数
 * 来自 handoff/prototype-v2/pc.js，仅保留生产用到的部分
 * (剔除 mockOrder / 假数据生成器，避免污染前端)
 * =========================================================== */

// 11 业务状态 → 6 类语义 token (D3)
// 1 待付款 / 2 已下单 / 3 待采样 / 4 待回寄 / 5 已签收 / 6 待复核
// 7 已出报告 / 8 已审核 / 9 已寄出 / 10 阳性 / 11 阴性
const STATUS_MAP = {
  1: { type: 'warn', label: '待付款' },
  2: { type: 'info2', label: '已下单' },
  3: { type: 'info2', label: '待采样' },
  4: { type: 'prog', label: '待回寄' },
  5: { type: 'prog', label: '已签收' },
  6: { type: 'prog', label: '待复核' },
  7: { type: 'succ', label: '已出报告' },
  8: { type: 'succ', label: '已审核' },
  9: { type: 'succ', label: '已寄出' },
  10: { type: 'pos', label: '阳性' },
  11: { type: 'neg', label: '阴性' }
}

const STATUS_COLOR = {
  warn: '#D97706',
  info2: '#2563EB',
  prog: '#7C3AED',
  succ: '#059669',
  pos: '#DC2626',
  neg: '#16A34A'
}

function mapStatus (code) {
  return STATUS_MAP[code] || { type: '', label: '未知' }
}

function statusCounts (list) {
  const c = {}
  list.forEach(r => {
    const k = r.status
    if (k != null) c[k] = (c[k] || 0) + 1
  })
  return c
}

// count-up 数字动画
function countUp (el, to, dur) {
  if (!el) return
  dur = dur || 900
  const start = performance.now()
  const from = +String(el.textContent).replace(/,/g, '') || 0
  function step (t) {
    const p = Math.min(1, (t - start) / dur)
    const eased = 1 - Math.pow(1 - p, 3)
    const v = Math.round(from + (to - from) * eased)
    el.textContent = v.toLocaleString()
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// 生成 sparkline polyline 点
function sparkPoints (data, w, h) {
  if (!data || !data.length) return ''
  const max = Math.max.apply(null, data)
  const min = Math.min.apply(null, data)
  const range = max - min || 1
  return data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / range) * (h - 4) - 2
    return x.toFixed(1) + ',' + y.toFixed(1)
  }).join(' ')
}

function pad (n) { return n < 10 ? '0' + n : '' + n }
function formatDate (ts) {
  if (!ts) return '-'
  const d = (ts instanceof Date) ? ts : new Date(ts)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes())
}

export default {
  STATUS_MAP,
  STATUS_COLOR,
  mapStatus,
  statusCounts,
  countUp,
  sparkPoints,
  formatDate
}

export {
  STATUS_MAP,
  STATUS_COLOR,
  mapStatus,
  statusCounts,
  countUp,
  sparkPoints,
  formatDate
}
