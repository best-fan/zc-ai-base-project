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

**常见全局 Store 清单**：

| Store | 文件 | 功能 |
|-------|------|------|
| `useUserStore` | `user.ts` | 用户信息、登录状态 |
| `useAppStore` | `app.ts` | 应用全局状态 |

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
- ✅ 需要持久化存储（如 token）
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
// store/user.ts
export const useUserStore = defineStore('user', () => {
  // 现有逻辑...
  const preferences = ref<UserPreferences | null>(null)  // 新增

  const updatePreferences = async (prefs: UserPreferences) => {
    // 新增方法
  }

  return { /* 现有 */, preferences, updatePreferences }
})

// ❌ 新建重复 Store
// store/member.ts
export const useMemberStore = defineStore('member', () => { ... })
```

## 文件组织

- 文件命名：`{模块名}.ts`（如 `user.ts`）
- 必须使用 **Setup Store** 风格
- Store 内部顺序固定：**State → Getters → Actions**

## 标准结构

```typescript
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { UserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)

  // Actions
  const setToken = (newToken: string) => {
    token.value = newToken
  }

  return { token, userInfo, isLoggedIn, setToken }
})
```

## State 定义

State 必须按顺序定义，顺序如下：
1. `loading` - 加载状态
2. `error` - 错误信息
3. 业务数据（按重要程度排序）

```typescript
const loading = ref(false)
const error = ref<string | null>(null)
const list = ref<SomeItem[]>([])
```

## Getters 定义

```typescript
const isLoggedIn = computed(() => !!token.value)
const hasItems = computed(() => items.value.length > 0)
```

## Actions 定义

```typescript
const fetchUserInfo = async () => {
  loading.value = true
  try {
    const res = await getUserInfo()
    userInfo.value = res.data
  } catch (err) {
    showToast('获取用户信息失败')
  } finally {
    loading.value = false
  }
}
```

## 持久化

使用 action 处理持久化，禁止使用 watch：

```typescript
import { storage } from '@/utils'

const token = ref<string>(storage.get('token') || '')

const setToken = (newToken: string) => {
  token.value = newToken
  storage.set('token', newToken)
}

const clearToken = () => {
  token.value = ''
  storage.remove('token')
}
```

## 在组件中使用

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { isLoggedIn, userInfo } = storeToRefs(userStore)
const { login, logout } = userStore
</script>
```