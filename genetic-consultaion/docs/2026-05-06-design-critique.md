# gensultation-web 后台 · Design Critique（2026-05-06）

评审依据：`.impeccable.md` 5 条总纲 + impeccable v2.1.1 全局禁令。
范围：`src/views/home/*` 共 95 .vue 文件。
基线：commit `84f1c2b`（Claude Design v0.2 已落 4 页 + shell + tokens）。

---

## Executive Summary

| 维度 | 命中 | 主要文件 |
|---|---|---|
| 直接颜色字面量（绕过 token） | **9 处**横跨 4 文件 | `brca/invoiceTwo.vue`、`brca/expressNew.vue`、`wrj/expressNew.vue`、`order/orderNew.vue` |
| `border-left/-right` 色条禁令 | **0** ✅ | — |
| `background-clip:text` + 渐变文字禁令 | **0** ✅ | — |
| `!important` 滥用（业务页内） | **7 处** 横跨 5 文件 | `informed/informed_upload.vue`、`points/detail.vue`、`ru6c/upload.vue`、`data_collect/informed_edit.vue`、`data_collect/informed_all.vue` |
| 自研 `<table class="i-table">`（不走 el-table + 设计系统） | **3+ 文件** | `brca/expressNew.vue`、`wrj/expressNew.vue`、`order/orderNew.vue`（已改造保留） |
| 未覆盖设计系统的页面 | **~80 文件** | 见下"未覆盖清单" |

**5 总纲项目整体评分**（每条 0-5 满分）：

| # | 总纲 | 分 | 备注 |
|---|---|---|---|
| 1 | 密度优先于留白 | 3/5 | 新 4 页行高 36px ✅；老页面普遍 40px+ 表格行 + 大留白 |
| 2 | 状态即信息 | **2/5** | 大部分老页 Tag 自定义十六进制色（`#14a495 / #368c01 / #6045a3` 等），未走 D3 6 类 |
| 3 | 多品牌一套骨架 | **2/5** | `brca/expressNew.vue` 与 `wrj/expressNew.vue` 是双胞胎复制；BRCA / 维汝健 / 安易筛 同业务的页面没复用 |
| 4 | 数字优先 | 3/5 | 订单号 / 样本编号未走 mono；金额无 `tnum` |
| 5 | 可信靠克制，温度靠细节 | 4/5 | 基线层（v0.2）好；老页有视觉碎片但不浮夸；空状态/错误文案普遍敷衍（"暂无数据"、"未知错误"） |

**一句话**：基线（设计系统 + 4 页 + shell）扎实，但 80 个老页面是包袱；下一步 ROI 最高的是把 `brca/invoiceTwo + brca/expressNew + wrj/expressNew` 这三件套先套设计系统，能消化最多禁令命中且为剩余批次定模板。

---

## Critical 项（命中禁令，必修）

### C1. `brca/invoiceTwo.vue` — 直接色 + 自定义 getColor map（5 处）
- `:239` — `:header-cell-style="{background:'#14a495',color:'white'}"` inline 直接色
- `:670` — `getColor()` 返回 `'已发送邮件':'#14a495'` 等 5 个十六进制色，未走 D3
- `:748` `:818` — `<style>` 里 `background: #14a495` / `background-color: #14a495`
- **修复**：删 inline style，让 element-overrides 接管表头；getColor → 改用 `tagClassForStatusStr` 模式（参照 `order/orderNew.vue` 的实现，命中 D3 6 类）

### C2. `brca/expressNew.vue` — 自研 `.i-table` + #14a495 表头
- `:242` — `.i-title { background: #14a495; color: white; line-height: 3 }`
- `:43` `:53` — svg `fill="#01806f"` 直接色
- **修复**：先删 i-title 直接色 → `var(--pc-ink-50)` 背景 + `var(--pc-ink-600)` 文字（与新设计系统统一）；svg fill 改 `currentColor`

### C3. `wrj/expressNew.vue` — `brca/expressNew.vue` 双胞胎，同样问题
- 同 C2 全部
- **修复**：与 brca/expressNew 一起改；**或更优 → 抽 1 份 `<express-list-table>` 组件，BRCA / 维汝健 / 安易筛复用**（落"多品牌一套骨架"原则）

---

## Major 项（应修，进 backlog 高优）

### M1. `!important` 蔓延（5 文件，7 处）
| 文件 | 行 | 内容 | 修复方向 |
|---|---|---|---|
| `informed/informed_upload.vue` | 531 | `height: 40px !important` 强行覆盖 .el-header | 改用 `.pc-header` / 删覆盖让 element-overrides 生效 |
| `points/detail.vue` | 276 | `background-color: transparent !important` 行底色 | 用 `:row-class-name` 走 design-system 行样式 |
| `ru6c/upload.vue` | 453 | `height: 40px !important` 同 informed_upload | 同上 |
| `data_collect/informed_edit.vue` | 1334 | `background: hsla(0,0%,100%,.9)!important` | 改 scoped 局部样式，去 !important |
| `data_collect/informed_edit.vue` | 1392 | `width: 100% !important` | 同上 |
| `data_collect/informed_all.vue` | 418 | `background: rgba(255,255,255,.9) !important` | 同上 |
| `data_collect/informed_all.vue` | 446 | `width: 100% !important` | 同上 |

`!important` 是 normal.css 时代的历史包袱。新设计系统已在 element-overrides 里用足够高优先级，业务页**不应再写新 !important** 去覆盖。

### M2. `order/orderNew.vue:522` — `getColor` map 仍为 fallback
- 原 762 行业务保留时留了 `getColor()` 颜色字面量 map 作 fallback；与新 `tagClassForStatusStr()` 并行
- **修复**：新增订单状态时直接走 `tagClassForStatusStr` → D3 6 类；不要再扩 `getColor` map。可加 deprecation 注释（已加 inline）

### M3. 自研 `.i-table` 表格组件
- `brca/expressNew.vue` / `wrj/expressNew.vue` / `order/orderNew.vue` 都是手写 table，不是 el-table
- orderNew 已套 design-system wrapper 是合理妥协；但其它两个**应直接换 el-table** + 复用 design-system 表格样式

---

## Minor 项（设计基线缺失，按 S5 批次推进）

约 **80 文件**未受 v0.2 设计系统覆盖。共性问题：
- 缺 `pc-page-title`（页面标题没标准化）
- 缺 `pc-toolbar` / `pc-batchbar` / `pc-seg`（工具条 / 批量条 / 状态分段）
- Tag 自写颜色而非命中 D3 6 类
- 大量 `<el-card>` 包裹无意义

不在本次详评，列入 S5 阶段一次性套样板（参考 `views/home/order/orderNew.vue` 的"增量改造"模式：保留业务流，只换皮）。

---

## 不在评审范围（不评价）

- `views/home/home.vue` / `views/home/dashboard/dashboard.vue` / `views/home/order/orderNew.vue` / `views/home/report/list.vue` / `views/home/report/report_upload.vue` —— 已是 v0.2 落地基线
- `views/wechat/*` —— H5 公众号，不属本评审
- `views/customize/*` —— PDF 渲染目标
- `views/loading.vue` / `views/register.vue` —— 非业务页（register 已知 pre-existing TypeError，与设计无关）

---

## Backlog（按 ROI 排序）

1. **[critical]** 三件套 `brca/invoiceTwo` + `brca/expressNew` + `wrj/expressNew` 套设计系统 → 消化最多禁令，立模板
2. **[major]** 清 5 文件 7 处 `!important`
3. **[major]** 抽 `<express-list-table>` 共享组件，BRCA / 维汝健 / 安易筛 复用
4. **[minor → S5]** 剩余 ~80 老页面分批套样板
5. **[nit]** orderNew.vue 的 svg 内联 `fill="#01806f"` 改 `currentColor`（不影响视觉，但代码更干净）

---

## 未覆盖清单（80 个文件，按子目录）

```
accuragen/         channel-list, paper-report
brca/              commission, exchange, express, invoice, order, paper-report,
                   user, user-list, whitelist, withdraw
                   (invoiceTwo, expressNew 已在 critical/major)
channel/           count, edit, list
customer/          list
data_collect/      pr-edit (components), informed_list, report_edit, report_list
                   (informed_edit, informed_all 已在 major)
data_review/       data_review, detail
disease/           disease/{edit,list,preview,view}
                   drug/{edit,list,preview,view}
                   gene/{edit,list,preview,view}
                   guide/{add,edit,list}
                   product/{edit,list,preview,view}
                   test/{edit,list}
firm/              edit, list
hospital/          edit, list
informed/          informed_detail, list
                   (informed_upload 已在 major)
order/             detail, order
                   (orderNew 已落基线)
patient/           list
points/            points
                   (detail 已在 major)
printer/           list
product/           editv1, list
qrcode/            (空？需确认)
qrcode_manager/    detail_list, qm_add, qm_edit, qm_list
rank/              company_rank, rank_list, standard_list
report/            report_upload (已落基线)
                   list (已落基线)
ru6c/              list
                   (upload 已在 major)
user/              invite, list, user
wrj/               exchange, invoice, order, paper-report
                   (expressNew 已在 critical)
```

总计：95 .vue - 5 已落基线 - 8 进 critical/major - 2 在 components - = ~80 待 S5 覆盖。
