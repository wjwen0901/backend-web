---
name: 易得好康 后台
description: 多品牌基因检测平台后台 SaaS · Clinical-Warm 设计系统 v0.2
colors:
  pc-primary-700: "#08594F"
  pc-primary-600: "#0E7A6E"
  pc-primary-500: "#119084"
  pc-primary-100: "#D0E8E4"
  pc-primary-50:  "#E1EFEC"
  pc-accent-700:  "#0F8B7E"
  pc-accent-600:  "#14A495"
  pc-accent-500:  "#2EBDAE"
  pc-accent-100:  "#C8ECE7"
  pc-accent-50:   "#E6F4F2"
  pc-accent-25:   "#F2F9F8"
  pc-accent-ink:    "#0B3B47"
  pc-accent-ink-2:  "#0F4A56"
  pc-accent-ink-3:  "#143A45"
  pc-warn-700: "#B45309"
  pc-warn-600: "#D97706"
  pc-warn-100: "#FEF3C7"
  pc-info-700: "#1D4ED8"
  pc-info-600: "#2563EB"
  pc-info-100: "#DBEAFE"
  pc-prog-700: "#6D28D9"
  pc-prog-600: "#7C3AED"
  pc-prog-100: "#EDE9FE"
  pc-succ-700: "#047857"
  pc-succ-600: "#059669"
  pc-succ-100: "#D1FAE5"
  pc-pos-700:  "#B91C1C"
  pc-pos-600:  "#DC2626"
  pc-pos-100:  "#FEE2E2"
  pc-neg-700:  "#166534"
  pc-neg-600:  "#16A34A"
  pc-neg-100:  "#DCFCE7"
  pc-ink-900: "#1F2937"
  pc-ink-800: "#2A3340"
  pc-ink-700: "#374151"
  pc-ink-600: "#4B5563"
  pc-ink-500: "#6B7280"
  pc-ink-400: "#9CA3AF"
  pc-ink-300: "#D1D5DB"
  pc-ink-200: "#E5E7EB"
  pc-ink-100: "#F3F4F6"
  pc-ink-50:  "#F9FAFB"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
    fontFeature: "'tnum'"
  headline:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-table:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "{typography.display.fontFamily}"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.3px"
  mono:
    fontFamily: "'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
    fontFeature: "'tnum'"
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
components:
  button-primary:
    backgroundColor: "{colors.pc-primary-600}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "32px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.pc-primary-700}"
    textColor: "#FFFFFF"
  button-text:
    backgroundColor: "transparent"
    textColor: "{colors.pc-primary-600}"
    padding: "4px 6px"
    rounded: "{rounded.sm}"
  button-warning:
    backgroundColor: "{colors.pc-warn-600}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    height: "32px"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "16px 20px"
  input-default:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.pc-ink-700}"
    rounded: "{rounded.sm}"
    height: "32px"
    typography: "{typography.body}"
  input-focus:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.pc-ink-700}"
  tag-warn:
    backgroundColor: "{colors.pc-warn-100}"
    textColor: "{colors.pc-warn-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
    typography: "{typography.label}"
  tag-info2:
    backgroundColor: "{colors.pc-info-100}"
    textColor: "{colors.pc-info-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
  tag-prog:
    backgroundColor: "{colors.pc-prog-100}"
    textColor: "{colors.pc-prog-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
  tag-succ:
    backgroundColor: "{colors.pc-succ-100}"
    textColor: "{colors.pc-succ-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
  tag-pos:
    backgroundColor: "{colors.pc-pos-100}"
    textColor: "{colors.pc-pos-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
  tag-neg:
    backgroundColor: "{colors.pc-neg-100}"
    textColor: "{colors.pc-neg-700}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "22px"
  table-header:
    backgroundColor: "{colors.pc-ink-50}"
    textColor: "{colors.pc-ink-600}"
    typography: "{typography.body-table}"
  table-row-hover:
    backgroundColor: "{colors.pc-primary-50}"
  header-shell:
    backgroundColor: "{colors.pc-accent-ink}"
    textColor: "#FFFFFF"
    height: "56px"
  sidebar-shell:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.pc-ink-700}"
    width: "200px"
  menu-item-active:
    backgroundColor: "{colors.pc-primary-50}"
    textColor: "{colors.pc-primary-700}"
    rounded: "{rounded.lg}"
    height: "38px"
---

# Design System: 易得好康 后台

## 1. Overview

**Creative North Star: "The Operations Reading Room"**

把日常做的事情想成在"运营阅览室"里坐 6 小时的工作：信息密度高（订单 79K、报告 45K、医院 22K、客户 88K 同屏可读），但环境是克制的、有节奏的、可以信赖的。一线运营 / 客服 / 实验室主管在 PC 端长时段工作，一边扫一眼定位、一边逐行精读。这套设计系统的本职是让他们在第 6 小时仍然觉得"这工具懂我"，而不是"这又是一个我必须忍受的内部系统"。

系统服务多品牌（BRCA轻松检 / 维汝健 / 安易筛 / 易见康 / 诠见康 / 吉因加 / 见山会诊），通过菜单 IA 区分入口而不是为每个品牌单独定制 UI —— 一套交互骨架承载所有产品线。视觉血统三参照：Linear（密度 + 克制）、Stripe Dashboard（清晰信息层级）、Apple Health（医疗专业但不冷）。

明确拒绝的方向（PRODUCT.md 已锁三类）：AI slop（暗底霓虹紫蓝渐变 / 玻璃拟态 / 渐变文字 / cyber 风）、花哨彩色（彩虹色调 + 大圆图标 + 厚重阴影 + 6+ 主色平铺）、老式 ERP / 政务（密密麻麻无气孔表格 + 灰底蓝标题 + 硬色边框）。

**Key Characteristics:**
- 双主色 D2：functional primary（teal 深绿）+ identity accent（teal 翠青）拆分使用
- 6 类语义色 D3：所有 11 业务状态码必须命中其中之一，禁止自定义状态色
- Light only：医疗 SaaS 长时段使用，白底 ink-700 文字，比深色更降眼疲劳
- 36px 表格行高、22px Tag、32px 按钮：信息密度服务于业务，不为视觉宽敞牺牲
- 顶栏深墨青 `#0B3B47` 而非品牌绿，放下"厂商首页"包袱
- mono `tnum` 等宽用于订单号、样本编号、接口路径、KPI 大数

## 2. Colors

调色板的角色不是"装饰"，是"分诊"：每一类色都承担一个稳定的业务语义，颜色变了，业务含义就变了。

### Primary
- **Operations Forest** (`#0E7A6E`, `pc-primary-600`): 主按钮、focus、链接、表单提交、主线趋势 —— 一切"可信干净"的功能性元素。这是用户每天点最多的色。
- **Operations Forest Deep** (`#08594F`, `pc-primary-700`): primary hover/active；菜单激活态文字。
- **Operations Forest Bright** (`#119084`, `pc-primary-500`): 步骤条 dot、二级菜单点。
- **Forest Wash** (`#D0E8E4`, `pc-primary-100`): segmented count 徽章、focus ring 轻浅扩散。
- **Forest Whisper** (`#E1EFEC`, `pc-primary-50`): 菜单激活胶囊底色、表格行 hover、batchbar 背景。

### Secondary (Brand Identity)
- **Brand Teal** (`#14A495`, `pc-accent-600`): 品牌强调色 —— Tab 下划线、KPI sparkline、stat tile、品牌 mark。**与 Primary 严格分离**：identity 与 functional 不能混。
- **Brand Teal Bright** (`#2EBDAE`, `pc-accent-500`): 趋势图次线（虚线）、step-current 圆点。
- **Brand Teal Deep** (`#0F8B7E`, `pc-accent-700`): segmented active 文字。
- **Teal Wash / Whisper / Vapor** (`#C8ECE7` / `#E6F4F2` / `#F2F9F8`): 极轻底色，谨慎使用。

### Tertiary (Shell Ink)
- **Deep Ink Teal** (`#0B3B47`, `pc-accent-ink`): 顶栏深墨青底色。**不是绿色** —— 故意避开品牌主色，让顶栏成为稳重的横梁，不与下方 primary 抢戏。
- **Ink Teal 2 / 3** (`#0F4A56` / `#143A45`): 顶栏 hover、底部 1px 分隔。

### Status (D3 6 类语义色)
11 业务状态映射到这 6 类，命中即用，**严禁自定义**：

- **Amber Warn** (`#D97706`/`#FEF3C7`, `warn`): 待付款（status 1）。带有"需要尽快处理"的橘色急迫感。
- **Cobalt Info** (`#2563EB`/`#DBEAFE`, `info2`): 已下单 / 待采样（status 2-3）。蓝色稳态进行中。
- **Violet Progress** (`#7C3AED`/`#EDE9FE`, `prog`): 待回寄 / 已签收 / 待复核（status 4-6）。紫色"流转中"。
- **Emerald Success** (`#059669`/`#D1FAE5`, `succ`): 已出报告 / 已审核 / 已寄出（status 7-9）。已完成。
- **Vermillion Positive** (`#DC2626`/`#FEE2E2`, `pos`): 阳性（status 10）。**医学阳性 = 高警示红**，不是"成功色"。
- **Jade Negative** (`#16A34A`/`#DCFCE7`, `neg`): 阴性（status 11）。医学阴性 = 安全绿。

### Neutral (Tinted Ink, 9 阶)
所有中性色都向 primary teal 微调（chroma 极轻），保持视觉血统一致：

- **Charcoal** (`#1F2937`, `ink-900`): 一级标题。
- **Slate Dark** (`#2A3340`, `ink-800`): 强调文字、breadcrumb 末位。
- **Slate** (`#374151`, `ink-700`): 默认正文。
- **Slate Light** (`#4B5563`, `ink-600`): 表格内文、菜单项默认。
- **Stone** (`#6B7280`, `ink-500`): 辅助文案、KPI label。
- **Mist** (`#9CA3AF`, `ink-400`): 占位符、失效状态、迷你装饰。
- **Hairline Strong** (`#D1D5DB`, `ink-300`): 强边框、input border。
- **Hairline Soft** (`#E5E7EB`, `ink-200`): 弱边框、表格分隔。
- **Surface 2 / 1** (`#F3F4F6` / `#F9FAFB`, `ink-100` / `ink-50`): 主内容区背景、表头、卡片填充。

### Named Rules
**The D2 Separation Rule.** Primary（`#0E7A6E`）和 Accent（`#14A495`）是**两种不同的工作**：Primary 服务功能（按钮、focus、链接），Accent 服务品牌识别（Tab、KPI、品牌图）。**严禁互换**，否则品牌与功能的语义会塌陷。

**The D3 Six-Class Rule.** 业务状态色必须命中 6 类语义之一（warn / info2 / prog / succ / pos / neg）。新增状态先决定它属于哪一类，再决定 Tag 文案 —— **不允许自定义十六进制色作为状态色**。这是 Sprint 1 critique 时打分最低的一条（2/5），新代码必须优先纠偏。

**The Pos-Is-Red Rule.** 医学"阳性"用红色高警示（`#DC2626`），不是"成功色"。这与互联网"绿=成功"惯性反向，必须坚持，因为业务语义是"需要优先寄出 / 通知"。

## 3. Typography

**Display Font:** 系统字体栈 `-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", sans-serif`
**Mono Font:** `"SF Mono", "JetBrains Mono", Menlo, Consolas, monospace`

**Character:** 系统字体栈是一个有意识的选择 —— 内部 PC 工具不需要为字体可控性引入 web font 加载延迟，让运营机器自带的中文字体（PingFang SC / 微软雅黑）在不同设备上自然切换，是"你用什么我就跟你"的人性。Mono 仅出现在数字密集场景：订单号、样本编号、KPI 大数、接口路径，启用 `font-feature-settings: 'tnum'` 让数字等宽对齐。

### Hierarchy
- **Display** (700, 28px, line-height 1.1, `tnum`): KPI 大数 —— 仪表盘的"知情同意 87,669"这种纯数字主体。仅此一处。
- **Headline** (600, 22px, 1.2): 不常用，预留给单品牌大型表头页。
- **Title** (600, 18px, 1.3): `pc-page-title h2`，每页主标题。
- **Body** (400, 13px, 1.5): 全局默认正文、表单文本、菜单项。
- **Body Table** (400, 12.5px, 1.5): 表格内容。比 body 小 0.5px 是为了在表格内**多塞一行**，密度服务于业务。
- **Label** (500, 11.5px, line-height 1, letter-spacing 0.3px): Tag、segmented count、KPI label、菜单 group。
- **Mono** (500, 12.5px, 1.4, `tnum`): 订单号 `ED20251248`、样本编号 `SC10000123`、接口路径 `/report/upload`、KPI 数字 fallback。

### Named Rules
**The Tnum Rule.** 所有"数字密集"位置必须 mono + `tnum`：订单号 / 样本编号 / 金额 / 计数 / 时间戳。这让"对齐扫读"成立 —— 一列订单号上下对齐时，运营能用余光抓住差异。

**The 12.5px Table Rule.** 表格 body 是 12.5px 不是 13px。差 0.5px 看似无关紧要，但 360 行的列表上能多塞 18 行可见，这是后台的尊严。

**The Capslock Embargo.** 长正文严禁全大写。仅 label / Tag / segmented count 这种"短到 ≤ 8 字符"的标签可以用 letter-spacing 0.3px 的中度大写。

## 4. Elevation

层级靠**1px hairline 边框 + 背景层级 + 极轻阴影**而非 Material 风的彩色光晕。基线 `pc-sh-1` 默认无阴影；hover 也只升到轻量 `pc-sh-3`。整体风格偏"扁平 + 精准分层"，不是"漂浮的 Material card"。

### Shadow Vocabulary
- **sh-1** (`box-shadow: 0 1px 2px rgba(15,23,42,.04)`): 卡片、KPI tile 默认。几乎不可见，只为打破"完全平铺"的死板。
- **sh-2** (`box-shadow: 0 2px 6px rgba(15,23,42,.06)`): 顶栏（pc-header）下沿，作为内容区与 shell 的分界。
- **sh-3** (`box-shadow: 0 6px 16px rgba(15,23,42,.08)`): 卡片 hover 上升、KPI 上扬交互态。
- **sh-4** (`box-shadow: 0 12px 32px rgba(15,23,42,.12)`): 弹层 / dropdown / dialog —— 最重的阴影，明确表示"这一层在最上层"。

### Named Rules
**The 1px Hairline Rule.** 边框宽度永远是 1px。`pc-bd-hair: 1px solid var(--pc-ink-200)` 是默认弱边，`pc-bd-strong: 1px solid var(--pc-ink-300)` 用于需要稍强分隔的位置。**禁止 ≥ 2px 的彩色边框**（这是 impeccable 全局禁令 BAN 1：side-stripe borders），用 background tint 或 leading icon 替代。

**The Whisper Hover Rule.** 表格行 hover 不抬阴影，只把背景换成 `pc-primary-50`（极轻 wash）。"想知道我在哪一行"不需要 3D 浮起。

## 5. Components

### Buttons
- **Shape:** 6px 圆角，32px 高度（size small）。
- **Primary:** `bg pc-primary-600 / text white`；hover 切 `pc-primary-700`。**用 `!important` 覆盖** —— 因为遗留 `normal.css` 用 `#14a495 !important` 强行染色，design-system 必须用同优先级压住。
- **Text 按钮:** `color pc-primary-600 / 4px 6px padding`；hover 加 `pc-primary-50` 浅底。表格行操作（"查看 / 编辑 / 更多"）一律用 text 按钮，不用 ghost。
- **Warning:** `bg pc-warn-600`（橘色），用于"导出"等"会产生外部影响"但非破坏的操作。**不用红色 danger** —— 红色保留给删除 + 阳性。
- **Success / Danger:** 完整覆盖在 element-overrides，但日常**少用**：success 默认 primary 已够"积极"，danger 仅删除场景。

### Tags（D3 六色 + 一中性）
- **Shape:** 8px 圆角，22px 高度，11.5px label。
- **Variants:** `el-tag--{warn|info2|prog|succ|pos|neg}`，分别对应 D3 6 类。中性默认（无 modifier）= `ink-100 bg / ink-700 text`。
- **Behavior:** Tag 是只读的视觉标签，不参与点击。如果要可点击就不是 Tag，是 Chip（本系统不区分 Chip）。

### Cards / Containers
- **Corner Style:** 6px（`rounded.md`）。按钮 6px、Tag 8px、卡片 6px、外框 8px —— 后台不要过度圆润。
- **Background:** `#FFFFFF`，1px `pc-ink-200` hairline 边框。
- **Shadow:** `pc-sh-1` 默认；hover 升 `pc-sh-3`。
- **Internal Padding:** `16px 20px`（`spacing.lg / xl`）。统一 `pc-card` 类，**不允许自写卡片样式**。
- **Anti-pattern:** 不要嵌套卡片。`pc-card` 内 `pc-card` = 视觉噪声，扁平掉。

### Inputs / Fields
- **Style:** 32px 高度（与按钮等高），4px 圆角，1px `pc-ink-300` 边框，13px body 字。
- **Focus:** `border pc-primary-600 + box-shadow 0 0 0 3px rgba(14,122,110,.12)` —— 浅扩散 ring 表示"激活"，不是粗框。
- **Error / Disabled:** Element 默认；不重写。

### Navigation
- **Style:** 侧栏 200px 白底，主内容区 ink-50；菜单分组（`pc-menu-group`）11px label letter-spacing 1px；菜单项 38px 高 + 8px 圆角；激活态 `pc-primary-50 bg + pc-primary-700 text + 1px inset shadow`（**不用左侧色条** —— 全宽胶囊）。
- **Mobile:** 不存在。本系统 PC only。

### Signature Components
本系统的"签名"组件（`pc-*` 前缀，源于 `prototype-v2`）：
- **`pc-page-title`**: 每页第一行 `<h2>` + 18px desc。
- **`pc-seg`**: Tab 状态分段。下方 2px `pc-accent-500` underline 跟随 active 滑动（300ms ease-out-quint）。每个 item 末尾带 `count` 徽章。
- **`pc-toolbar`**: 工具条横排（搜索 + grow + 操作按钮组）。
- **`pc-batchbar`**: 选中项时浮现的批量操作条，`pc-primary-50 bg + pc-primary-100 1px border + slideDown 200ms`。
- **`pc-kpi`**: KPI tile，sh-1 静默 / sh-3 hover；右上角 92×36 sparkline accent。
- **`pc-statusbar`**: 11 状态分布堆叠条，12px 高 6px 圆角；下方 legend 列出 11 个 dot + label + count。
- **`pc-dragger`**: 上传容器，2px dashed border + 30px padding + 38px upload icon。
- **`pc-steps`**: 竖向步骤条，左侧 2px 实线轨道，每步圆点 12px；is-current 加 3px primary-100 ring。
- **`pc-tabs`**: history tabs 条，最多 12 个，每个最多 1 行；active 加底色 + 2px 下划线 + bottom-border primary-600。

### Named Rules
**The Capsule Active Rule.** 菜单激活态用全宽圆角胶囊（`pc-primary-50 bg + 8px radius`），**禁止用左侧 3-4px 色条** —— 那是 impeccable BAN 1 + 老式 ERP 第一象征。
**The Single-Source Component Rule.** 任何 `pc-*` 类只在 element-overrides.css 定义。业务页里**不允许**自写 `pc-card`、`pc-page-title` 等局部样式覆盖。

## 6. Do's and Don'ts

### Do:
- **Do** 用 `var(--pc-*)` token 引用所有颜色 / 字号 / 圆角 / 阴影 / spacing。
- **Do** 状态 Tag 必须命中 `el-tag--{warn|info2|prog|succ|pos|neg}` 6 类之一；新增业务状态先去 `src/utils/pc.js` 的 `STATUS_MAP` 加映射。
- **Do** 多品牌业务页（BRCA / 维汝健 / 安易筛）共用同一套表格、segmented、工具条、批量条骨架；通过菜单 IA 区分入口。
- **Do** 数字密集位置（订单号、样本编号、金额、计数、KPI 大数）一律 mono `font-family` + `font-feature-settings: 'tnum'`。
- **Do** 表格 hover 用 `pc-primary-50` 整行浅底；不用阴影抬升。
- **Do** 圆角控制在 6-8px：按钮 6px、Tag 8px、卡片 6px —— 后台保持克制。
- **Do** focus 状态可见：`box-shadow 0 0 0 3px rgba(14,122,110,.12)` 已在 element-overrides 实现，业务页不要 `outline: none` 后不补。
- **Do** 顶栏深墨青 `#0B3B47`，**不是品牌绿** —— 让顶栏退到稳重的横梁角色，不与 primary 抢戏。
- **Do** 空状态文案场景化：不要写"暂无数据"，写"还没有订单 / 还没有客户邀请你 / 这个月还没数据"。

### Don't:
- **Don't** 在业务页里写直接颜色字面量 `#0E7A6E` / `#14a495` / `#01806f` / `#117e73` —— 全部走 token。Sprint 1 critique 命中 9 处，都已部分修复。
- **Don't** 自定义状态 Tag 的十六进制色 —— 走 D3 6 类。`getColor()` 这种返回 `'#368c01'` 的写法已 deprecated（见 `order/orderNew.vue:522` + `brca/invoiceTwo.vue` 的 inline TODO）。
- **Don't** `border-left / border-right > 1px` 作为彩色装饰条（impeccable BAN 1 + 老式 ERP 第一象征）。用 full border / background tint / leading icon 替代。
- **Don't** `background-clip: text` + 渐变 —— 文字一律纯色（impeccable BAN 2）。
- **Don't** 玻璃拟态 / 毛玻璃 / 暗底霓虹紫蓝渐变 —— PRODUCT.md 明确 reject 的 AI slop。
- **Don't** 彩虹色调按钮组 / 大圆图标 + 厚重阴影 / "每个数据卡一个不同色"（PRODUCT.md 明确 reject 的花哨彩色）。
- **Don't** 密密麻麻无气孔表格 + 灰底蓝标题 + 硬色 1px black 边框（PRODUCT.md 明确 reject 的老式 ERP）。
- **Don't** 在新业务页里写局部 `!important` 重新覆盖 design-system —— 历史 `normal.css` 的 `#14a495 !important` 已经是技术债，新代码不应再制造同类。
- **Don't** 嵌套卡片（`pc-card` 内 `pc-card`）。
- **Don't** 把"多个品牌"理解成"多套 UI"。BRCA / 维汝健 / 安易筛 同业务（订单 / 报告 / 财务）必须复用同一套组件骨架。
- **Don't** dark mode。本系统 light only，长时段医疗 SaaS 用户的眼睛比"看起来酷"重要。
- **Don't** 用 `<el-empty description="暂无数据">` 作为通用空状态 —— 抽 `<EmptyState>` 共享组件（Sprint 2 计划）。
- **Don't** 在长正文里用 em dash `—`。用逗号、冒号、分号、句号、括号。也不用 `--`。
- **Don't** 把 mock 视为最终视觉契约。本系统在 prototype-v2 → 真代码的落地中已经做过妥协（自研 i-table 保留 + 增量改造），未来设计变化优先走"加 token / 加共享组件"，不优先走"重写 prototype"。
