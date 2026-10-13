---
paths:
  - "src/utils/*.ts"
---
# 工具函数开发规范

## 开发前检查流程

**在编写新函数前，必须按以下顺序检查：**

### 1. 检查全局是否已存在类似函数

**必须先搜索 `src/utils/` 目录**，确认没有可复用的函数：

```bash
# 搜索现有函数
ls src/utils/
grep -r "函数功能关键词" src/utils/
```

**常见全局函数清单**：

| 模块 | 文件 | 功能示例 |
|------|------|----------|
| 存储 | `storage.ts` | `storage.get`、`storage.set` |
| 格式化 | `format.ts` | `formatDate`、`formatPrice` |
| 验证 | `validate.ts` | `isPhone`、`isEmail` |

### 2. 判断函数归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 多个模块共用 | `src/utils/` | `formatDate`、`deepClone` |
| 单个模块独用 | `src/pages/xxx/utils/` | 页面私有工具 |
| 单个组件独用 | 组件内部定义 | 组件私有逻辑 |

### 3. 评估是否应添加到全局

**满足以下条件之一，应添加到全局 utils**：

- ✅ 3个及以上文件需要使用
- ✅ 通用工具函数（格式化、验证、转换等）
- ✅ 与业务无关的纯函数
- ✅ 可能有其他模块未来需要

**不应添加到全局的情况**：

- ❌ 仅单个页面/组件使用
- ❌ 强依赖特定业务逻辑
- ❌ 简单的一次性逻辑

### 4. 扩展现有模块

如果全局存在类似功能的模块，优先**扩展现有模块**：

```typescript
// ✅ 扩展现有模块
// utils/format.ts
export const formatPrice = (price: number): string => `¥${price.toFixed(2)}`
export const formatPercent = (value: number): string => `${(value * 100).toFixed(2)}%`  // 新增

// ❌ 新建重复模块
// utils/price.ts
export const toPrice = ...
```

## 文件组织

- 文件命名：camelCase（如 `storage.ts`、`format.ts`）
- 按功能分文件
- `index.ts` 统一导出

## 函数命名

| 功能类型 | 前缀 | 示例 |
|---------|------|------|
| 获取 | `get` | `getToken` |
| 设置 | `set` | `setToken` |
| 格式化 | `format` | `formatDate` |
| 验证 | `is` | `isPhone` |

## 纯函数原则

- 相同输入返回相同输出
- 不产生副作用
- 不修改输入参数

```typescript
// ✅ 纯函数
export const formatPrice = (price: number): string => `¥${price.toFixed(2)}`

// ❌ 非纯函数（修改了输入参数）
export const formatDate = (date: Date): string => {
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}
```

## 本地存储封装

使用对象形式封装，便于统一管理：

```typescript
// utils/storage.ts
const PREFIX = 'vue_h5_'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set(key: string, value: unknown): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  clear(): void {
    localStorage.clear()
  }
}

export default storage
```

## 统一导出

```typescript
// utils/index.ts
export * from './storage'
export * from './format'  // 新增模块时添加
```

## 使用方式

```typescript
import { storage } from '@/utils'

// 存储数据
storage.set('token', 'xxx')
storage.set('user', { name: 'Tom' })

// 读取数据
const token = storage.get<string>('token')
const user = storage.get<UserInfo>('user')

// 删除数据
storage.remove('token')
```

## 注意事项

1. **类型安全**：所有函数必须添加类型注解
2. **错误处理**：可能出错的地方使用 try-catch
3. **统一前缀**：本地存储使用统一前缀避免冲突