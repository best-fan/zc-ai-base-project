---
paths:
  - "src/router/*.ts"
---
# 路由开发规范

## 文件组织

路由已按职责拆分为多个文件，**禁止全部塞回 `index.ts`**：

```
router/
├── index.ts      # 创建 router 实例，组装静态路由 + 守卫 + 动态路由导出
├── static.ts     # 静态路由（无需权限的基础路由：登录页、首页等）
├── dynamic.ts    # 动态路由（根据后端菜单 IMenu[] 生成，addRoute）
├── guard.ts      # 路由守卫（标题、登录拦截、动态路由恢复）
└── instance.ts   # router 实例存储（解决循环依赖，getRouterInstance/setRouterInstance）
```

| 文件 | 职责 |
|------|------|
| `index.ts` | `createRouter`，注册静态路由，调用 `setupRouterGuards`，导出动态路由方法 |
| `static.ts` | 导出 `staticRoutes: RouteRecordRaw[]` |
| `dynamic.ts` | `addDynamicRoutes(menus)` / `resetDynamicRoutes()` / `hasDynamicRoutes()` |
| `guard.ts` | `setupRouterGuards(router)`，集中处理 `beforeEach` |
| `instance.ts` | 保存 router 引用，供 `dynamic.ts` 在守卫外调用 `addRoute` |

## 开发前检查流程

**在添加新路由前，必须按以下顺序检查：**

### 1. 检查路由是否已存在

**静态页面检查 `src/router/static.ts`**，确认路由不存在：

```bash
grep -r "path:" src/router/static.ts
```

**现有静态路由清单**：

| 路径 | 名称 | 页面 | 布局 |
|------|------|------|------|
| `/` | `Home` | 首页工作台 | header |
| `/login` | `Login` | 登录页 | empty |

> 其余业务页面**不在静态路由中**，而是登录后由后端菜单（`IMenu[]`）经 `dynamic.ts` 动态生成。

### 2. 判断路由归属

| 条件 | 归属 | 示例 |
|------|------|------|
| 无需登录的公开页 | `static.ts` | 登录页 |
| 需登录的业务页 | 动态路由（后端菜单驱动） | 系统管理各页面 |
| 404 兜底 | `dynamic.ts` 中动态添加 | `/pages/error/404.vue` |

### 3. 评估路由设计

**添加路由时必须配置**：

- ✅ 路径语义清晰
- ✅ 适当设置 meta（title、layout、requiresAuth）
- ✅ 使用懒加载
- ✅ 路由命名规范（PascalCase）

**路由 meta 配置参考**：

| 页面类型 | layout | requiresAuth |
|----------|--------|--------------|
| 需登录页面 | `'header'` | `true` |
| 公开页面 | `'empty'` | 省略 |
| 目录容器（动态路由） | `'empty'` | `true` |

> `meta.layout` 由 `App.vue` 读取，决定使用 `HeaderLayout` 还是 `EmptyLayout`。`meta.breadcrumb` 用于面包屑。

### 4. 动态路由机制（重要）

业务页面通过后端返回的菜单树动态注册：

```typescript
// dynamic.ts 核心逻辑（节选）
const pageModules = import.meta.glob('@/pages/**/*.vue')

export const addDynamicRoutes = (menus: IMenu[]): void => {
  if (dynamicRoutesAdded) return   // 防止重复添加
  dynamicRoutesAdded = true
  if (!menus?.length) return

  const router = getRouterInstance()
  transformMenusToRoutes(menus).forEach((route) => router.addRoute(route))

  // 404 必须在动态路由之后添加，避免提前匹配所有路径
  router.removeRoute('NotFound')
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: { title: '页面不存在', layout: 'empty' },
  })
}
```

**菜单类型约定**（`IMenu.menuType`）：

| 类型 | 含义 | 生成的组件 |
|------|------|-----------|
| `M` | 目录（容器） | `EmptyLayout`，含 `children` |
| `C` | 实际页面 | 按 `pages/{path}/index.vue` 匹配 `import.meta.glob` |
| `A` | 权限点（按钮） | 不生成路由 |

**新增业务页面流程**：在 `src/pages/{菜单path}/index.vue` 创建页面 → 后端菜单配置对应 `path` 与 `enCode` → 前端自动匹配，**无需手改路由文件**。

## 路由定义规范

### 路由懒加载

所有页面组件必须使用懒加载：

```typescript
// ✅ 正确 - 使用懒加载
{
  path: '/login',
  component: () => import('@/pages/login/index.vue')
}

// ❌ 错误 - 直接导入
import LoginPage from '@/pages/login/index.vue'
{
  path: '/login',
  component: LoginPage
}
```

## Meta 字段规范

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 页面标题（守卫会写入 `document.title`） |
| `layout` | string | 布局类型：`'header'`（带 Header）、`'empty'`（纯空白） |
| `requiresAuth` | boolean | 是否需要登录 |
| `breadcrumb` | `IBreadcrumbItem[]` | 面包屑配置 |
| `icon` | string | 菜单图标（动态路由生成） |

## 路由守卫

守卫统一在 `router/guard.ts` 的 `setupRouterGuards` 中注册，逻辑分四步：

```typescript
import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/store/user'
import { addDynamicRoutes, hasDynamicRoutes } from './dynamic'

export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, _from, next) => {
    // 1. 设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string
    }

    // 2. 未登录访问受保护页 -> 跳登录，携带 redirect
    if (to.meta.requiresAuth && !isLogin()) {
      next({ path: '/login', query: { redirect: encodeURIComponent(to.fullPath) } })
      return
    }

    // 3. 已登录访问登录页 -> 跳首页
    if (to.path === '/login' && isLogin()) {
      next({ path: '/', replace: true })
      return
    }

    // 4. 动态路由未加载 -> 从持久化恢复，或重新拉取用户信息
    if (!hasDynamicRoutes() && isLogin()) {
      const userStore = useUserStore()
      if (userStore.menuTreeBoList.length > 0) {
        addDynamicRoutes(userStore.menuTreeBoList)
        next({ ...to, replace: true })
        return
      }
      try {
        await userStore.info()
        next({ ...to, replace: true })
        return
      } catch {
        userStore.logoutCallBack()
        next({ path: '/login', replace: true })
        return
      }
    }

    next()
  })
}
```

**注意事项**：

- 登录拦截使用 `@/utils/auth` 的 `isLogin()`（读 localStorage），**不是** `userStore.isLoggedIn`（内存态，刷新后为空）。
- `redirect` 参数必须使用 `encodeURIComponent` 编码，防止特殊字符导致路由解析错误。
- 动态路由刷新后需从持久化的 `menuTreeBoList` 恢复，避免白屏。

## 路由命名规范

- 使用 PascalCase
- 语义清晰，表达页面功能
- 动态路由的 `name` 取后端菜单的 `enCode`

```typescript
// ✅ 推荐
{ path: '/', name: 'Home' }
{ path: '/login', name: 'Login' }

// ❌ 避免
{ path: '/login', name: 'login' }   // 不是 PascalCase
{ path: '/', name: 'page1' }        // 语义不清
```

## 动态路由参数

```typescript
// 定义带参数的路由
{
  path: '/product/:id',
  name: 'ProductDetail',
  component: () => import('@/pages/product/detail/index.vue')
}

// 使用参数
const route = useRoute()
const productId = computed(() => route.params.id as string)
```

## 禁止事项

1. ❌ 禁止在路由配置中使用非懒加载的组件导入
2. ❌ 禁止在路由守卫中进行复杂的异步操作（保持轻量）
3. ❌ 禁止直接在模板中使用 `$router`（应在方法中封装）
4. ❌ 禁止在路由配置中定义类型（类型统一放在 `@/types`）
5. ❌ 禁止业务页面手动写入 `static.ts`（应通过后端菜单动态注册）
