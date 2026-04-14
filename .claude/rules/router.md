---
paths:
  - "src/router/*.ts"
---
# 路由开发规范

## 开发前检查流程

**在添加新路由前，必须按以下顺序检查：**

### 1. 检查路由是否已存在

**必须先检查 `src/router/index.ts`**，确认路由不存在：

```bash
# 检查现有路由
grep -r "path:" src/router/
grep -r "/目标路径" src/router/
```

**常见路由清单**：

| 路径 | 名称 | 页面 |
|------|------|------|
| `/` | `Home` | 首页 |
| `/login` | `Login` | 登录页 |

### 2. 判断路由归属

| 条件 | 归属 | 示例 |
|------|------|------|
| 主应用页面 | `src/router/index.ts` | 所有业务页面 |
| 动态路由 | 路由配置 + 后端返回 | 权限控制页面 |

### 3. 评估路由设计

**添加路由时必须配置**：

- ✅ 路径语义清晰
- ✅ 适当设置 meta（title、layout、requiresAuth）
- ✅ 使用懒加载
- ✅ 路由命名规范

**路由 meta 配置参考**：

| 页面类型 | layout | tabBar | requiresAuth |
|----------|--------|--------|--------------|
| 需登录页面 | `'header'` | `false` | `true` |
| 公开页面 | `'header'` | `false` | `false` |
| 空白布局页面 | `'empty'` | `false` | 按需 |

### 4. 扩展现有路由配置

如果需要添加子路由或嵌套路由，**扩展现有路由结构**：

```typescript
// ✅ 扩展为嵌套路由
{
  path: '/user',
  name: 'User',
  component: () => import('@/layouts/MainLayout.vue'),
  children: [
    {
      path: '',
      name: 'UserList',
      component: () => import('@/pages/user/list/index.vue')
    },
    {
      path: 'detail/:id',  // 新增子路由
      name: 'UserDetail',
      component: () => import('@/pages/user/detail/index.vue')
    }
  ]
}

// ❌ 新建平级路由（应使用嵌套）
{ path: '/user/detail/:id', ... }
```

## 文件组织

- 路由配置统一放在 `src/router/index.ts`
- 路由守卫逻辑也在此文件中

## 路由定义规范

### 路由懒加载

所有页面组件必须使用懒加载：

```typescript
// ✅ 正确 - 使用懒加载
{
  path: '/user',
  component: () => import('@/pages/user/index.vue')
}

// ❌ 错误 - 直接导入
import UserPage from '@/pages/user/index.vue'
{
  path: '/user',
  component: UserPage
}
```

## Meta 字段规范

| 字段 | 类型 | 说明 |
|------|------|------|
| `title` | string | 页面标题 |
| `layout` | string | 布局类型：`'header'`（带 Header）、`'empty'`（纯空白） |
| `tabBar` | boolean | 是否显示 TabBar |
| `requiresAuth` | boolean | 是否需要登录 |

## 路由守卫

```typescript
import { useUserStore } from '@/store/user.store'

router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 登录拦截
  const userStore = useUserStore()
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: encodeURIComponent(to.fullPath) }
    })
  } else {
    next()
  }
})
```

**注意**：`redirect` 参数必须使用 `encodeURIComponent` 编码，防止特殊字符导致路由解析错误。

## 路由命名规范

- 使用 PascalCase
- 语义清晰，表达页面功能

```typescript
// ✅ 推荐
{ path: '/user/profile', name: 'UserProfile' }

// ❌ 避免
{ path: '/user/profile', name: 'userProfile' }  // 不是 PascalCase
{ path: '/user/profile', name: 'page1' }        // 语义不清
```

## 动态路由

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
2. ❌ 禁止在路由守卫中进行复杂的异步操作
3. ❌ 禁止直接在模板中使用 `$router`（应在方法中封装）
4. ❌ 禁止在路由配置中定义类型（类型统一放在 `@/types`）