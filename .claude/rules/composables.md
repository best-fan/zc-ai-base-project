---
paths:
  - "src/composables/**/*.ts"
  - "src/pages/**/composables/*.ts"

---
# Composables 开发规范

## 开发前检查流程

**在编写新的组合式函数前，必须按以下顺序检查：**

### 1. 检查全局是否已存在类似函数

**必须先搜索 `src/composables/` 目录**，确认没有可复用的函数：

```bash
# 搜索现有 composables
ls src/composables/
grep -r "功能关键词" src/composables/
```

**常见全局 composables 清单**：

| 函数名 | 文件 | 功能 |
|--------|------|------|
| `useLoading` | `useLoading.ts` | 加载状态管理 |
| `usePagination` | `usePagination.ts` | 分页逻辑 |

### 2. 判断函数归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 多个模块共用 | `src/composables/` | `useLoading`、`usePagination` |
| 单个页面独用 | `src/pages/xxx/composables/` | 页面私有逻辑 |
| 单个组件独用 | 组件内部定义 | 组件私有逻辑 |

### 3. 评估是否应添加到全局

**满足以下条件之一，应添加到全局 composables**：

- ✅ 3个及以上文件需要使用
- ✅ 通用逻辑封装（分页、加载、表单等）
- ✅ 与 Vue 生命周期绑定的通用逻辑
- ✅ 可能有其他模块未来需要

**不应添加到全局的情况**：

- ❌ 仅单个页面/组件使用
- ❌ 强依赖特定业务逻辑
- ❌ 简单的一次性逻辑

### 4. 扩展现有模块

如果全局存在类似功能的函数，优先**扩展现有函数**：

```typescript
// ✅ 扩展现有函数
// composables/usePagination.ts
export function usePagination<T>(options: PaginationOptions = {}) {
  // 现有逻辑...
}

// 新增功能：支持搜索
export function usePaginationWithSearch<T>(searchFn: SearchFunction<T>) {
  const pagination = usePagination<T>()
  const keyword = ref('')
  // 扩展逻辑...
  return { ...pagination, keyword }
}

// ❌ 新建重复函数
// composables/useList.ts
export function useList() { ... }
```

## 文件组织

- 文件命名：`use` 开头的 camelCase（如 `useAuth.ts`、`usePagination.ts`）
- 全局 composables 放 `src/composables/`
- 页面私有 composables 放 `src/pages/xxx/composables/`

## 与 Store 的区别

| 场景 | 使用 Store | 使用 Composable |
|------|-----------|-----------------|
| 全局共享状态 | ✅ | ❌ |
| 跨组件复用逻辑 | ❌ | ✅ |
| 需要持久化 | ✅ | ❌ |
| 与 Vue 生命周期绑定 | ❌ | ✅ |

## 基本结构

```typescript
import { ref, computed } from 'vue'

export function useCounter(initial = 0) {
  const count = ref(initial)
  const double = computed(() => count.value * 2)
  const increment = () => count.value++

  return { count, double, increment }
}
```

## 常见模式

```typescript
// 带配置参数
export function usePagination<T>(
  fetchFn: (page: number) => Promise<T[]>,
  options: { pageSize?: number } = {}
) {
  const { pageSize = 10 } = options
  const list = ref<T[]>([])
  const loading = ref(false)

  const fetch = async () => {
    loading.value = true
    try {
      list.value = await fetchFn(1)
    } finally {
      loading.value = false
    }
  }

  return { list, loading, fetch }
}

// 副作用清理
export function useEventListener(target: EventTarget, event: string, callback: EventListener) {
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```

## 禁止事项

1. ❌ 禁止名称不以 `use` 开头
2. ❌ 禁止返回未响应化的数据
3. ❌ 禁止在全局 composable 中管理全局状态（使用 Store）