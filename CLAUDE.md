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
- 业务组件: @zcui/components、@zcui/system（系统管理页面）
- 状态管理: Pinia + pinia-plugin-persistedstate（持久化）
- 路由: Vue Router（静态路由 + 后端菜单驱动的动态路由）
- 加密: crypto-js（MD5、AES）
- 样式: SCSS

## 架构要点

### 路由布局
- 路由 `meta.layout` 决定使用哪个布局组件（`HeaderLayout` / `EmptyLayout`）
- 布局组件在 `layouts/` 目录，`App.vue` 根据 `meta.layout` 动态渲染
- 路由配置已拆分到 `router/` 多文件：`static.ts`（静态路由）、`dynamic.ts`（后端菜单动态路由）、`guard.ts`（守卫）、`instance.ts`、`index.ts`
- 路由守卫自动设置页面标题、登录拦截、恢复动态路由

### 类型管理
- 所有类型集中在 `src/types/`
- **统一从 `@/types` 导入**，禁止导入子路径
- 命名：interface 用 `I` 前缀（`IUserInfo`），type 用 `T` 前缀（`TStatus`）
- 请求参数后缀 `ReqData`，响应后缀 `Res`（如 `ILoginReqData`、`ILoginRes`）

### API 封装
- `services/` 目录封装 API 请求，业务层统一使用 `http` 对象（非 axios 实例 `request`）
- 响应统一用 `IApiResponse<T>` 包裹泛型
- 类型从 `@/types` 导入，禁止在 services 中定义类型

### 组件规范
- 公共组件放 `components/`，私有组件放 `pages/xxx/components/`
- 使用 Setup Store（Pinia），Store 为子目录形式（`store/user/index.ts`）

## 开发规范

详细规范见 `.claude/rules/` 目录，核心约束：

- 禁止 `any` 类型
- 禁止在业务文件中定义类型
- 禁止直接导入 `@/types/` 子路径
- 业务层统一使用 `http` 对象请求（禁止直接用 axios 实例 `request`）
- 业务页面通过后端菜单动态注册路由，不手动写入 `static.ts`
- 所有注释使用中文