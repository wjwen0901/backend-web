# Claude Design 背景说明

日期：`2026-04-20`

## 项目背景

- 项目路径：`/Users/wjwen/git/mdhcare/gensultation-web/genetic-consultaion`
- 技术栈：`Vue 2 + Element UI`
- 项目属性：真实医疗健康业务项目，不是演示型后台
- 仓库结构：同仓内同时存在后台管理端和微信/H5 端

## 当前阶段范围

- 本轮只聚焦后台管理端 `src/views/home/**`
- 微信/H5 端暂不进入第一阶段落地
- 本轮不是全站一起改，而是先建立后台设计系统基线

## 已确认的设计目标

- 风格方向：`Premium Clinical`
- 品牌感强度：中等品牌感
- 视觉目标：高级、洁净、可信
- 后台信息密度：中高密度
- 第一阶段核心痛点：当前后台缺少统一感

## 明确约束

- 严格保留 `Vue 2 + Element UI`
- 不升级到 `Vue 3`
- 不引入新的重型 UI 框架
- 不改变现有接口、路由语义和核心业务逻辑
- 可以优化视觉、布局和交互表达，但不要改变核心业务流程

## 第一阶段样板页

- 后台框架页：`src/views/home/home.vue`
- 仪表盘：`src/views/home/dashboard/dashboard.vue`
- 通用列表页样板：`src/views/home/order/order.vue`
- 复杂表单样板：`src/views/home/report/report_upload.vue`

## 已查看的关键文件

- `src/views/home/home.vue`
- `src/views/home/dashboard/dashboard.vue`
- `src/views/home/order/order.vue`
- `src/views/home/report/report_upload.vue`
- `src/App.vue`
- `src/element-variables.scss`

## 对当前项目的判断

- 当前后台整体仍然带有明显旧版默认 Element UI 风格
- 全局主题能力偏弱，目前主要依赖主色 `#14a495`
- 仪表盘仍是旧式彩色统计卡片思路
- 列表页和表单页缺少统一设计语言
- 当前最大问题不是单页不好看，而是跨页面系统性不足

## 希望 Claude Design 达到的效果

- 让后台管理端明显不再像旧版默认 Element UI 项目
- 建立统一的导航、标题区、卡片、表格、表单、上传区、分页、状态标签和按钮体系
- 整体气质更像高质量医疗品牌后台，而不是普通运营后台或互联网数据后台
- 保持后台操作效率，不要因为追求视觉高级感而牺牲使用效率

## 工作方式要求

- 先做设计系统诊断和方案，不要直接全站开改
- 先用样板页建立系统基线，再总结推广规则
- 不要给出太发散的多套风格路线，围绕 `Premium Clinical` 深挖
- 所有建议必须可在现有 `Vue 2 + Element UI` 栈内落地

## 推荐使用方式

把这份文档作为 Claude Design 的前置背景材料，与以下内容一起提供：

- 关键页面截图
- 对应页面源码
- 当前主题文件与全局样式入口

优先附上：

- `src/views/home/home.vue`
- `src/views/home/dashboard/dashboard.vue`
- `src/views/home/order/order.vue`
- `src/views/home/report/report_upload.vue`
- `src/App.vue`
- `src/element-variables.scss`
