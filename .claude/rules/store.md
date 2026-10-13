---
paths:
  - "src/store/**/*.ts"
---
# Pinia Store 开发规范

## 开发前检查流程

**在创建新 Store 前，必须按以下顺序检查：**

### 1. 检查全局是否已存在类似 Store

**必须先搜索 `src/store/` 目录**，确认没有可复用的 Store：

```bash
# 搜索现有 Store
ls src/store/
grep -r "Store关键词" src/store/
```

**现有 Store 清单**：

| Store | 文件 | 功能 |
|-------|------|------|
| `useUserStore` | `user/index.ts` | 用户信息、登录状态、菜单、动态路由 |

### 2. 判断 Store 归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 全局共享状态 | `src/store/` | 用户信息、应用配置 |
| 页面私有状态 | 页面内 composables | 页面临时数据 |
| 组件私有状态 | 组件内 ref | 组件内部数据 |

### 3. 评估是否应添加到全局 Store

**满足以下条件之一，应添加到全局 store**：

- ✅ 多个页面/组件需要共享
- ✅ 需要跨页面保持状态
- ✅ 需要持久化存储（如用户信息）
- ✅ 用户/应用级别的全局状态

**不应添加到全局的情况**：

- ❌ 仅单个页面使用
- ❌ 不需要跨页面共享
- ❌ 页面卸载后不需要保留
- ❌ 应该使用 composable 的逻辑复用场景

### 4. 扩展现有 Store

如果全局存在类似功能的 Store，优先**扩展现有 Store**：

```typescript
// ✅ 扩展现有 Store
// store/user/index.ts
export const useUserStore = defineStore('user', () => {
  // 现有逻辑...
  const preferences = ref<UserPreferences | null>(null)  // 新增

  const updatePreferences = async (prefs: UserPreferences) => {
    // 新增方法
  }

  return { /* 现有 */, preferences, updatePreferences }
})

// ❌ 新建重复 Store
// store/member/index.ts
export const useMemberStore = defineStore('member', () => { ... })
```

## 文件组织

- **目录形式**：`src/store/{模块名}/index.ts`（如 `user/index.ts`）
- 必须使用 **Setup Store** 风格
- Store 内部顺序固定：**State → Getters → Actions**
- 统一在 `src/store/index.ts` 导出

```
store/
├── index.ts          # 统一导出
└── user/
    └── index.ts      # 用户模块 Store
```

## 标准结构

```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { IUserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const userBo = ref<IUserInfo['userBo']>({ /* 默认值 */ })
  const menuKeys = ref<Set<string>>(new Set())

  // Getters
  const userInfo = computed<IUserInfo>(() => ({ /* 聚合 */ }))
  const isLoggedIn = computed(() => !!userBo.value.id)

  // Actions
  const setInfo = (partial: Partial<IUserInfo>): void => {
    // 更新状态
  }

  const login = async (data: ILoginReqData): Promise<void> => {
    // 登录逻辑
  }

  return {
    // State
    userBo,
    menuKeys,
    // Getters
    userInfo,
    isLoggedIn,
    // Actions
    setInfo,
    login,
  }
})
```

## State 定义

State 必须按顺序定义，顺序如下：
1. `loading` - 加载状态（如有）
2. `error` - 错误信息（如有）
3. 业务数据（按重要程度排序）

```typescript
const loading = ref(false)
const error = ref<string | null>(null)
const userBo = ref<IUserInfo['userBo']>({ /* ... */ })
```

## Getters 定义

```typescript
const isLoggedIn = computed(() => !!userBo.value.id)
const hasMenus = computed(() => menuTreeBoList.value.length > 0)
```

## Actions 定义

```typescript
const info = async (): Promise<IUserInfo | undefined> => {
  if (userBo.value.id) return userInfo.value   // 提前返回，避免重复请求
  const res = await getUserInfo()
  setInfo(res.data)
}
```

## 持久化

项目使用 **`pinia-plugin-persistedstate`**，通过 `defineStore` 的**第三个参数**配置持久化，**不要**手动在 action 里读写 localStorage。

```typescript
export const useUserStore = defineStore(
  'user',
  () => {
    // setup 逻辑...
    return { userBo, mainDept, menuTreeBoList, menuKeys, /* ... */ }
  },
  {
    persist: {
      key: 'user_info',
      // 仅持久化指定字段
      paths: ['userBo', 'mainDept', 'menuTreeBoList', 'roleList', 'otherDeptList', 'menuKeys'],
      // Set 等特殊类型需自定义序列化
      serializer: {
        serialize: (state) =>
          JSON.stringify({
            // ...
            menuKeys: state.menuKeys ? Array.from(state.menuKeys as Set<string>) : [],
          }),
        deserialize: (value) => {
          const parsed = JSON.parse(value)
          return {
            // ...
            menuKeys: parsed.menuKeys ? new Set(parsed.menuKeys) : new Set(),
          }
        },
      },
    },
  }
)
```

**要点**：

- `key` 为持久化到 localStorage 的键名。
- 仅持久化必要字段（用 `paths`），避免状态膨胀。
- `Set` / `Map` / `Date` 等类型必须自定义 `serializer`，否则反序列化后类型丢失。

## Token 持久化（例外）

Token 由 **`@/utils/auth`** 单独管理（不放进 Store 的 `persist`），因为路由守卫需要在 Store 初始化前读取：

```typescript
import { setToken, clearToken } from '@/utils/auth'

const login = async (loginForm: ILoginReqData): Promise<void> => {
  const res = await userLogin(loginForm)
  if (res?.data?.tokenInfo) {
    setToken(res.data.tokenInfo)   // 写入 localStorage
    // ...
  }
}
```

`utils/auth.ts` 提供 `isLogin()`、`getToken()`、`setToken()`、`clearToken()`。

## 在组件中使用

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo, isLoggedIn } = storeToRefs(userStore)
const { login, logout } = userStore
</script>
```

## 禁止事项

1. ❌ 禁止使用 Options Store（必须用 Setup Store）
2. ❌ 禁止在 action 中手动读写 localStorage 做持久化（用 `persist` 配置，token 除外）
3. ❌ 禁止 Store 文件使用单文件形式（`store/user.ts`），应使用 `store/user/index.ts`
4. ❌ 禁止在 Store 中定义类型（类型统一放 `@/types`）
5. ❌ 禁止在 Store 中放置仅单页面使用的状态（应放页面 composables）
