/* ===========================================================
 * 易得好康 后台设计系统 v0.2 · 工具函数
 * 来自 handoff/prototype-v2/pc.js + Sprint 3 extract 抽出的业务状态 map
 * =========================================================== */

// ---- 通用 11 业务状态 → 6 类语义 token (D3) ----
// 来自原型 v2，用于 Dashboard / Stat 卡 / order/orderNew 等通用统计场景
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
  warn: 'var(--pc-warn-600)',
  info2: 'var(--pc-info-600)',
  prog: 'var(--pc-prog-600)',
  succ: 'var(--pc-succ-600)',
  pos: 'var(--pc-pos-600)',
  neg: 'var(--pc-neg-600)'
}

const STATUS_TEXT_TYPE = {
  '收款码待付款': 'warn',
  '待付款': 'warn',
  '待处理': 'warn',
  '待发货': 'warn',
  '待审核': 'warn',
  '新增': 'warn',
  '已下单': 'info2',
  '待采样': 'info2',
  '已录入': 'info2',
  '待回寄': 'prog',
  '寄样中': 'prog',
  '已签收': 'prog',
  '检测中': 'prog',
  '待复核': 'prog',
  '转账中': 'prog',
  '已发货': 'prog',
  '待寄出': 'prog',
  '已确定': 'prog',
  '未打印': 'prog',
  '已出报告': 'succ',
  '报告已出': 'succ',
  '已审核': 'succ',
  '已寄出': 'succ',
  '已完成': 'succ',
  '已到账': 'succ',
  '已打印': 'succ',
  '启用': 'succ',
  '阳性': 'pos',
  '无法识别': 'pos',
  '人工检验': 'pos',
  '阴性': 'neg',
  '已取消': '',
  '已取消订单': '',
  '未开票': '',
  '已停用': ''
}

function mapStatus (code) {
  return STATUS_MAP[code] || { type: '', label: '未知' }
}

function typeOfStatusText (text) {
  return STATUS_TEXT_TYPE[text] !== undefined ? STATUS_TEXT_TYPE[text] : ''
}

function tagClassOf (typeOrText) {
  const type = STATUS_COLOR[typeOrText] !== undefined ? typeOrText : typeOfStatusText(typeOrText)
  return type ? 'el-tag--' + type : ''
}

function statusCounts (list) {
  const c = {}
  list.forEach(r => {
    const k = r.status
    if (k != null) c[k] = (c[k] || 0) + 1
  })
  return c
}

// ---- BRCA 业务专属 status 映射（与通用 STATUS_MAP 编码不一致，单独维护） ----
// BRCA 后端 0-10 ≠ pc.js 1-11，单独 map 避免误用

// brca/order.vue：订单 status 0/1/2/3/4/5/7/10 → D3 type
const BRCA_ORDER_STATUS_TYPE = {
  0: 'warn',   // 待付款
  1: 'info2',  // 待采样
  2: 'info2',  // 待回寄
  3: 'prog',   // 寄样中
  4: 'prog',   // 检测中
  5: 'succ',   // 报告已出
  7: 'succ',   // 已发起解读
  10: ''       // 已取消
}

// brca/order.vue 状态下拉枚举
const BRCA_ORDER_STATUS_OPTIONS = [
  { value: '0', label: '待付款' },
  { value: '1', label: '待采样' },
  { value: '2', label: '待回寄' },
  { value: '3', label: '寄样中' },
  { value: '4', label: '检测中' },
  { value: '5', label: '报告已出' },
  { value: '7', label: '已发起解读' },
  { value: '10', label: '已取消' }
]

function brcaOrderStatusType (code) {
  return BRCA_ORDER_STATUS_TYPE[code] !== undefined ? BRCA_ORDER_STATUS_TYPE[code] : ''
}

function canUploadBrcaReport (status) {
  return status >= 3 && status !== 10
}

// brca/withdraw.vue：提现 status 0/1/2
const BRCA_WITHDRAW_STATUS = {
  0: { type: 'warn', label: '待审核' },
  1: { type: 'prog', label: '转账中' },
  2: { type: 'succ', label: '已到账' }
}

// brca/paper-report.vue：纸质报告寄送 status 0/1/2/3
const BRCA_PAPER_REPORT_STATUS = {
  0: { type: 'warn', label: '待审核' },
  1: { type: 'succ', label: '已审核' },
  2: { type: 'prog', label: '待寄出' },
  3: { type: 'succ', label: '已寄出' }
}

// brca/invoiceTwo.vue：发票 statusStr 文本 → type
const BRCA_INVOICE_STATUS_TYPE = {
  '已申请': 'warn',
  '未开票': '',
  '已确定': 'prog',
  '已完成': 'succ',
  '已发送邮件': 'succ',
  '已寄出': 'succ',
  '待寄出': 'prog'
}

// brca/exchange.vue：积分兑换 statusStr 文本 → type
const BRCA_EXCHANGE_STATUS_TYPE = {
  '待处理': 'warn',
  '待发货': 'warn',
  '已发货': 'prog',
  '已完成': 'succ',
  '已签收': 'succ',
  '已取消': ''
}

// informed/list.vue + data_collect/informed_list.vue：知情同意 state 0/1/2/3
const INFORMED_STATE_MAP = {
  0: { type: 'warn',  label: '新增' },
  1: { type: 'info2', label: '已录入' },
  2: { type: 'pos',   label: '无法识别' },
  3: { type: 'succ',  label: '报告已出' }
}

// data_collect/report_list.vue：报告 state 0/1/2/3
const REPORT_STATE_MAP = {
  0: { type: 'warn',  label: '新增' },
  1: { type: 'info2', label: '已录入' },
  2: { type: 'pos',   label: '无法识别' },
  3: { type: 'succ',  label: '关联知情' }
}

// trade_order.pay_type → 展示标签。两套历史枚举共存：
//   旧版（TradeOrder 注释）  : 1 微信 / 2 支付宝 / 3 现金 / 4 代金券 / 107 有赞
//   新版（PayRecordPayTypeEnum）: 102 微信 / 103 支付宝 / 104 POS / 105 对公 /
//     106 储值卡 / 113 通联 / 201 现金 / 202 有赞商城 / 203 鹿鹿通
// 历史野值（10/12/16/36/37/72/7 等 2018-2020 老订单）和 0 / NULL 一律不显示标签
const PAY_CHANNEL_MAP = {
  1: '微信',
  102: '微信',
  2: '支付宝',
  103: '支付宝',
  3: '现金',
  201: '现金',
  4: '代金券',
  104: 'POS',
  105: '对公',
  106: '储值卡',
  113: '通联',
  107: '有赞',
  202: '有赞',
  203: '鹿鹿通'
}

function payChannelLabel (payType) {
  if (payType === undefined || payType === null) return ''
  return PAY_CHANNEL_MAP[payType] || ''
}

// 通用：根据 status code/text 取 { type, label }；找不到返回 fallback
function statusOf (map, key, fallback) {
  return map[key] || fallback || { type: '', label: '未知' }
}

// 通用：根据 statusStr 文本 map → 取 type；找不到返回 ''
function typeOf (map, key) {
  return map[key] !== undefined ? map[key] : ''
}

// ---- count-up 数字动画 ----
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

// ---- sparkline polyline ----
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

// ---- 通用地址工具 ----
function formatAddress (r) {
  if (!r) return ''
  return [r.province, r.city, r.county, r.address].filter(Boolean).join(' ')
}

// ---- 脏数据 sanitize ----
// DB 历史脏数据可能写入字符串 'undefined' / 'null' / ''
// 模板里 {{ safe(row.x) || '—' }} 让 fallback 生效
// huashu critique 2026-05-07 命中 user-list 'undefined / undefined' 行
function safe (val) {
  if (val === undefined || val === null) return null
  if (typeof val !== 'string') return val
  const s = val.trim()
  if (s === '' || s === 'undefined' || s === 'null') return null
  return val
}

// ---- API 提交工具 ----
// http.js 的 axios 拦截器已自动注入 Authorization 和 userId param
// 此处只补充 X-Requested-With 头并集中错误处理
// 用法： apiSubmit(this.axios, 'post', 'white', { ...data }, { userId })
//          .then(...)
//          .catch(...)
function apiSubmit (axios, method, url, data, params) {
  return axios({
    method: method,
    url: url,
    data: data,
    params: params,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json'
    }
  })
}

// ---- 文件下载工具 ----
// 把 blob 响应触发浏览器下载
// 用法：downloadBlob(response.data, '订单列表-' + dateStr + '.xls')
function downloadBlob (blobData, filename, mimeType) {
  const type = mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  const blob = new Blob([blobData], { type: type })
  const aEle = document.createElement('a')
  const href = window.URL.createObjectURL(blob)
  aEle.href = href
  aEle.download = filename
  document.body.appendChild(aEle)
  aEle.click()
  document.body.removeChild(aEle)
  window.URL.revokeObjectURL(href)
}

// 取年月日字符串 ('2026-05-06') 用于文件名
function dateStr (date) {
  const d = date || new Date()
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

export default {
  STATUS_MAP,
  STATUS_COLOR,
  STATUS_TEXT_TYPE,
  mapStatus,
  typeOfStatusText,
  tagClassOf,
  statusCounts,
  BRCA_ORDER_STATUS_TYPE,
  BRCA_ORDER_STATUS_OPTIONS,
  BRCA_WITHDRAW_STATUS,
  BRCA_PAPER_REPORT_STATUS,
  BRCA_INVOICE_STATUS_TYPE,
  BRCA_EXCHANGE_STATUS_TYPE,
  INFORMED_STATE_MAP,
  REPORT_STATE_MAP,
  PAY_CHANNEL_MAP,
  brcaOrderStatusType,
  canUploadBrcaReport,
  payChannelLabel,
  statusOf,
  typeOf,
  countUp,
  sparkPoints,
  formatDate,
  formatAddress,
  safe,
  apiSubmit,
  downloadBlob,
  dateStr
}

export {
  STATUS_MAP,
  STATUS_COLOR,
  STATUS_TEXT_TYPE,
  mapStatus,
  typeOfStatusText,
  tagClassOf,
  statusCounts,
  BRCA_ORDER_STATUS_TYPE,
  BRCA_ORDER_STATUS_OPTIONS,
  BRCA_WITHDRAW_STATUS,
  BRCA_PAPER_REPORT_STATUS,
  BRCA_INVOICE_STATUS_TYPE,
  BRCA_EXCHANGE_STATUS_TYPE,
  INFORMED_STATE_MAP,
  REPORT_STATE_MAP,
  PAY_CHANNEL_MAP,
  brcaOrderStatusType,
  canUploadBrcaReport,
  payChannelLabel,
  statusOf,
  typeOf,
  countUp,
  sparkPoints,
  formatDate,
  formatAddress,
  safe,
  apiSubmit,
  downloadBlob,
  dateStr
}
