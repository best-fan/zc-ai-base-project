---
paths:
  - "src/types/**/*.ts"
---
# 类型定义规范

## 开发前检查流程

**在定义新类型前，必须按以下顺序检查：**

### 1. 检查全局是否已存在类似类型

**必须先搜索 `src/types/` 目录**，确认没有可复用的类型：

```bash
# 搜索现有类型
ls src/types/
ls src/types/api/
ls src/types/models/
grep -r "类型关键词" src/types/
```

**常见全局类型清单**：

| 类型分类 | 目录 | 类型示例 |
|----------|------|----------|
| API 类型 | `types/api/` | `ILoginParams`、`IUserInfo` |
| 模型类型 | `types/models/` | `IOrderItem`、`IProduct` |
| 枚举类型 | `types/enum/` | `OrderStatusEnum` |

### 2. 判断类型归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 多个模块共用 | `src/types/` | `IUserInfo`、`TStatus` |
| 单个组件私有 | 组件目录内 `types.ts` | 组件特有 props 类型 |
| API 请求/响应 | `src/types/api/` | `ILoginParams`、`ILoginData` |

### 3. 评估是否应添加到全局

**满足以下条件之一，应添加到全局 types**：

- ✅ 3个及以上文件需要使用
- ✅ API 请求/响应类型
- ✅ 通用业务模型类型
- ✅ 可能有其他模块未来需要

**不应添加到全局的情况**：

- ❌ 仅单个组件使用且不涉及 API
- ❌ 强依赖特定组件内部逻辑
- ❌ 简单的一次性类型定义

### 4. 扩展现有类型

如果全局存在类似功能的类型，优先**扩展现有类型**：

```typescript
// ✅ 扩展现有类型
// types/models/user.ts
export interface IUserInfo {
  id: number
  username: string
}

export interface IUserInfoDetail extends IUserInfo {  // 新增扩展类型
  nickname: string
  avatar: string
}

// ❌ 新建重复类型
// types/models/member.ts
export interface IMemberInfo { id: number; username: string }
```

## 核心原则

**所有类型定义集中在 `src/types/` 这一个文件夹下管理**，禁止散落在业务文件中。

## 目录结构

```
src/types/
├── index.ts          # 统一导出入口
├── api/              # API 请求/响应类型
├── models/           # 模块类型
└── enum/             # 枚举类型
```

## 命名规范

| 类型 | 前缀 | 示例 |
|------|------|------|
| interface | I | `IUserInfo`、`ILoginParams` |
| type | T | `TStatus`、`TResult<T>` |
| enum | 无（Enum 后缀） | `OrderStatusEnum` |

| 用途 | 后缀 | 示例 |
|------|------|------|
| 请求参数 | Params | `ILoginParams` |
| 响应数据 | Data / Info | `IUserInfo` |
| 列表项 | Item | `IOrderItem` |

```typescript
// interface
export interface IUserInfo { id: number; username: string }

// type
export type TStatus = 'pending' | 'success' | 'failed'

// enum
export enum OrderStatusEnum { Pending = 0, Paid = 1 }
```

## 文件示例

```typescript
// src/types/api/user.ts
export interface ILoginParams { username: string; password: string }
export interface ILoginData { token: string; expiresIn: number }

// src/types/models/user.ts
export interface IUserInfo { id: number; username: string; nickname: string }

// src/types/index.ts
export * from './api/user'
export * from './models/user'
```

## 使用方式

```typescript
// ✅ 正确
import type { IUserInfo, ILoginParams } from '@/types'

// ❌ 禁止
import type { IUserInfo } from '@/types/models/user'
```

## 类型安全

```typescript
// ✅ 使用类型守卫
function isUserInfo(obj: unknown): obj is IUserInfo {
  return typeof obj === 'object' && obj !== null && 'id' in obj
}

// ✅ 使用 unknown
function process(data: unknown) {
  if (typeof data === 'string') data.toUpperCase()
}

// ❌ 禁止 any
function process(data: any) { data.anyMethod() }
```

## 禁止事项

1. 禁止在业务文件中定义类型（组件私有类型除外，可放在组件目录内的 types.ts）
2. 禁止直接导入 `@/types/` 子路径
3. 禁止使用 `any` 类型
4. 禁止 interface 不使用 `I` 前缀
5. 禁止 type 不使用 `T` 前缀