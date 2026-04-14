# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```bash
pnpm dev          # 启动开发服务器（端口 5188）
pnpm build        # 构建生产版本
pnpm lint         # ESLint 检查
pnpm lint:fix     # ESLint 检查并修复
pnpm type-check   # TypeScript 类型检查
```

## 技术栈

- Vue 3 + Composition API (`<script setup>`)
- TypeScript 5（严格模式，禁止 `any`）
- Vite 5
- UI: Arco Design Vue（中文语言包已配置）
- 图表: @antv/g2
- 状态管理: Pinia
- 样式: SCSS

## 架构要点

### 路由布局
- 路由 `meta.layout` 决定使用哪个布局组件
- 布局组件在 `layouts/` 目录
- 路由守卫自动设置页面标题

### 类型管理
- 所有类型集中在 `src/types/`
- **统一从 `@/types` 导入**，禁止导入子路径
- 命名：interface 用 `I` 前缀（`IUserInfo`），type 用 `T` 前缀（`TStatus`）

### API 封装
- `services/` 目录封装 API 请求
- 类型从 `@/types` 导入，禁止在 services 中定义类型

### 组件规范
- 公共组件放 `components/`，私有组件放 `pages/xxx/components/`
- 使用 Setup Store（Pinia）

## 开发规范

详细规范见 `.claude/rules/` 目录，核心约束：

- 禁止 `any` 类型
- 禁止在业务文件中定义类型
- 禁止直接导入 `@/types/` 子路径
- 所有注释使用中文