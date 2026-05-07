# 易得好康 后台 · Impeccable 设计上下文

> 本文件是 `/impeccable` 系列指令在本项目里的**唯一上下文源**。
> 任何 `craft / shape / layout / harden / extract / polish` 调用都先读这份文件，再做设计决策。
> 与 `src/assets/css/design-system/` 的 v0.2 落地实现保持一致；冲突时**以 design-system token 为准**。

---

## 项目概览

| 维度 | 值 |
|---|---|
| 项目 | `gensultation-web/genetic-consultaion` —— 易得好康（MDHCare）多品牌后台 SaaS |
| 部署 | `https://z.mdhcare.cn/` 生产 + `https://qa.mdhcare.cn/` QA |
| 技术 | Vue 2.5 + Element UI 2.15 + webpack 3 + scss；Remix Icon CDN |
| 设计基线 | Claude Design v0.2，已落到 `src/assets/css/design-system/{tokens,element-overrides}.css` |
| 入口路由 | `/dashboard` 默认；其它 60+ 子路由按业务域划分 |

---

## Design Context

### Users

**一线运营 / 客服 / 实验室主管**（角色：`manager` / `jk-service` / `operator` / `viewer`）。

- **使用场景**：工作日 PC 端长时段在席（4-8h），处理高密度业务数据（订单 79K、报告 45K、医院 22K、客户 88K）
- **核心任务**：
  1. **订单跟踪**：检索、筛选 11 业务状态、改价、分配积分、批量上传知情/报告
  2. **报告管理**：上传 PDF（plupload + OSS）、阴/阳标记、打印、复核
  3. **客户/患者管理**：多品牌客户档案、邀请链权限
  4. **财务**：佣金、提现、发票、积分兑换、快递查询
- **多品牌切换**：BRCA轻松检 / 维汝健 / 安易筛 / 易见康 / 诠见康 / 吉因加 / 见山会诊 —— 同一套交互骨架承载不同产品线
- **痛点**：信息密度高 + 状态流转复杂；之前 UI 是 2018 风格累积，长时间盯屏疲劳；需要"既能扫一眼定位，又能一行行精确读"

### Brand Personality

**Clinical-Warm**（Clinical 专业可靠 ⊕ Warm 人性温度）。三词浓缩：

1. **Refined** —— 精炼、不啰嗦；信息层级清晰，不靠装饰找存在感
2. **Trustworthy** —— 可信；颜色克制、不用"会变色的图表"、不夸张动画；状态语义稳定（D3 6 类色 + 11 业务状态码就是稳定承诺）
3. **Humane** —— 人性；不是冷冰冰的医疗仪器面板；按钮 hover 有反馈、空状态有引导、加载有节奏感、错误有解释

**情绪目标**：让运营在第 6 小时仍然觉得"这工具懂我"，而不是"这又是一个我必须忍受的内部系统"。

### Aesthetic Direction

#### 基线（已落地，**不要改**）
- **双主色 D2**：
  - `--pc-primary-600 #0E7A6E` —— 按钮 / focus / 链接 / 表单提交 / 主线趋势（"可信干净"功能性）
  - `--pc-accent-500 #14A495` / `-600 #14A495` —— Tab 下划线 / Tag / 勾选行 / Stat tile / 进度 / 品牌 icon（"品牌识别"强调）
  - `--pc-accent-ink #0B3B47` —— 顶栏深墨青底色（NOT 绿色）
- **6 类语义色 D3**：`warn / info2 / prog / succ / pos / neg`，承载 11 业务状态映射（见 `src/utils/pc.js`）
- **中性 ink**：`ink-50` ~ `ink-900` 9 阶；侧栏白底 + ink-50 主内容区背景
- **阴影**：`pc-sh-1` ~ `pc-sh-4` 4 阶；默认卡片靠 1px 边框和背景层级，阴影仅用于顶栏、弹层和轻 hover
- **圆角**：`pc-r-2/4/6/8`；后台控件默认收敛在 6-8px，按钮 6px、卡片 6px、Tag 8px
- **字体**：`-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif`；mono 用 `"SF Mono", "JetBrains Mono"`（订单号、样本编号、接口路径）
- **字号**：12 / 12.5 / 13 / 14 / 16 / 18 / 22 / 28 px 八阶；body 13px / 表格 12.5px / 大数 28px
- **图标**：菜单与品牌用 Remix Icon (`ri-*`)；操作微动作用 Element 自带 (`el-icon-*`)

#### 主题
- **Light only**。医疗 SaaS 长时段使用，白底 ink-700 文字，比深色更降眼疲劳
- 不做 dark mode（不是用户场景）

#### 参照感觉
- **像**：Linear（密度 + 克制）、Stripe Dashboard（清晰信息层级）、Apple Health（医疗专业但不冷）
- **不像**：花哨甲方色 / 老式 ERP 灰底蓝标题 / Cyber 暗底紫蓝渐变 / Bootstrap 默认通用感

### Anti-References（明确不要）

> 用户已明确 reject 这三类。生成任何新页面前自检一次。

1. **AI slop** —— 禁止：暗底霓虹紫蓝渐变背景 / 玻璃拟态卡片 / 毛玻璃背景 / 渐变文字 / cyber 风 / 大 emoji 装饰
2. **花哨彩色** —— 禁止：彩虹色调按钮组 / 大圆图标 + 厚重阴影 / 6+ 主色平铺 / "每个数据卡一个不同色"
3. **老式 ERP / 政务** —— 禁止：密密麻麻无气孔表格 / 灰底蓝标题 / 硬色 1px black 边框 / 无视觉节奏
4. **绝对禁令**（来自 impeccable 全局规则）：
   - `border-left: <Npx> solid <color>` 侧边色条（任何颜色、任何宽度 > 1px）
   - 渐变文字 `background-clip: text` + `linear-gradient` —— 文字一律纯色
5. **特别注意**：原 `normal.css` 留下的 `#14a495 !important` 强制覆盖，已在 element-overrides.css 用更高 `!important` 压住，**新页面不要再写局部 !important 重新破坏**

### Accessibility

无明确合规要求（内部 PC 系统）。但仍**必须**遵守：

- focus 状态可见（element-overrides 已处理 `--pc-primary-600` 3px box-shadow）
- 键盘 Tab 序合理，不要 `outline: none` 后不补 focus 样式
- 状态色不单独承载语义 —— 阴/阳 Tag 同时有"阴性"/"阳性"文字，色盲用户也能读
- 不强制做 WCAG 完整审计

---

## Design Principles（5 条总纲）

未来所有设计决策按这 5 条裁判：

1. **密度优先于留白** —— 这是后台不是营销页。表格行高 36px、Tag 22px、按钮 32px；留白用于分组而非"看起来宽敞"
2. **状态即信息** —— 任何业务状态必须命中 D3 6 类语义色之一；自定义颜色 = 错误。新增状态先映射到 6 类，再决定 Tag 文案
3. **多品牌一套骨架** —— BRCA / 维汝健 / 安易筛 / 易见康 同一套表格 + segmented + 工具条；通过菜单 IA 区分入口，**不靠每个品牌单独定制 UI**
4. **数字优先** —— 大数（KPI / 计数）用 mono `tnum` 字体特性 + count-up 动画；订单号、样本编号、接口路径一律 mono 等宽
5. **可信靠克制，温度靠细节** —— 颜色不浮夸（基线），动画不浮夸（200ms ease-out 内）；温度从 hover 反馈 / 空状态文案 / 错误解释 / 加载节奏感来

---

## 现有设计系统索引（写代码前先 grep）

| 关心什么 | 去哪找 |
|---|---|
| 颜色变量 | `src/assets/css/design-system/tokens.css` (`--pc-*`) |
| Element UI 覆盖 | `src/assets/css/design-system/element-overrides.css` (scope `#app`) |
| 11 业务状态 → 6 D3 类映射 | `src/utils/pc.js` `STATUS_MAP` / `STATUS_COLOR` / `mapStatus()` |
| KPI 动画 / sparkline | `src/utils/pc.js` `countUp()` / `sparkPoints()` |
| 现有 shell（侧栏/顶栏/tabs） | `src/views/home/home.vue` |
| KPI / 趋势 / 状态分布 | `src/views/home/dashboard/dashboard.vue` |
| 业务页参考（segmented + 工具条 + 批量条 + 表格） | `src/views/home/order/orderNew.vue` |
| 上传页参考（3 卡 + dragger + 步骤条） | `src/views/home/report/report_upload.vue` |

**新组件优先复用 design-system 的类**（`pc-card / pc-page-title / pc-seg / pc-toolbar / pc-batchbar / pc-kpi / pc-statusbar / pc-dragger / pc-steps / el-tag--{warn,info2,prog,succ,pos,neg}`），不要重新造轮子。

---

## 范围边界（防止扩散）

- **In scope**：`views/home/*` 后台管理页面
- **Out of scope**（不要在本项目内做 impeccable 设计）：
  - `views/wechat/*` H5 微信公众号页面（移动端，另一套约束）
  - `views/customize/*` PDF 报告生成（Puppeteer 渲染目标，规则不同）
  - `views/loading.vue` / `views/register.vue`（非业务页）
- **跨仓库**：本项目设计基线**不**主动覆盖到 sibling repos（`ru6c-wx`、`jiyinjia-wechat`、`consultation-h5`）。它们各自有自己的 `.impeccable.md`（如需）

---

最后更新：2026-05-06，承接 Claude Design v0.2 落地（commit `84f1c2b`）
