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

**现有全局类型清单**：

| 类型分类 | 目录/文件 | 类型示例 |
|----------|-----------|----------|
| API 类型 | `types/api/` | `ILoginReqData`、`ILoginRes`、`IApiResponse` |
| 模型类型 | `types/models/` | `IUserInfo`、`ICard` |
| Composables 类型 | `types/composables.ts` | `IUsePaginationOptions` |
| 组件类型 | `types/components.ts` | `IBreadcrumbItem` |

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
│   ├── common.ts     # 通用响应包装（IApiResponse<T>）
│   ├── user.ts       # 用户相关
│   └── verify.ts     # 验证码相关
├── models/           # 业务模型类型
│   ├── user.ts
│   └── card.ts
├── composables.ts    # 组合式函数相关类型
└── components.ts     # 组件相关类型
```

> 注：项目**没有** `types/enum/` 子目录。枚举类型如确有需要，可直接定义在对应的 `api/*.ts` 或 `models/*.ts` 中并导出。

## 命名规范

| 类型 | 前缀 | 示例 |
|------|------|------|
| interface | I | `IUserInfo`、`ILoginParams` |
| type | T | `TStatus`、`TResult<T>` |
| enum | 无（Enum 后缀） | `OrderStatusEnum` |

| 用途 | 后缀 | 示例 |
|------|------|------|
| 请求参数 | ReqData | `ILoginReqData`、`IGetCaptchaReqData` |
| 响应数据 | Res / ResData | `ILoginRes`、`IGetCaptchaResData` |
| 业务模型 | Info / Bo | `IUserInfo` |
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
// src/types/api/common.ts
export interface IApiResponse<T> {
  code: number
  msg: string
  data: T
}

// src/types/api/user.ts
export interface ILoginReqData { account: string; password: string }
export interface ILoginRes { tokenInfo: ITokenInfo }

// src/types/models/user.ts
export interface IUserInfo { userBo: IUserBo; roleList: IRole[] }

// src/types/index.ts
export * from './api/common'
export * from './api/user'
export * from './models/user'
```

## 使用方式

```typescript
// ✅ 正确
import type { IUserInfo, ILoginReqData } from '@/types'

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