---
paths:
  - "src/services/*.ts"
---
# services 开发规范

## 开发前检查流程

**在编写新接口前，必须按以下顺序检查：**

### 1. 检查全局是否已存在类似接口

**必须先搜索 `src/services/` 目录**，确认没有可复用的接口：

```bash
# 搜索现有接口
ls src/services/
grep -r "接口关键词" src/services/
```

**常见全局接口清单**：

| 模块 | 文件 | 接口示例 |
|------|------|----------|
| 用户 | `user.ts` | `login`、`getUserInfo`、`updateUserInfo` |
| 订单 | `order.ts` | `getOrderList`、`getOrderDetail` |

### 2. 判断接口归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 多个模块共用 | `src/services/` | `getUserInfo`、`uploadImage` |
| 页面私有接口 | 页面内定义 | 页面特有接口（极少使用） |

**注意**：几乎所有接口都应该放在 `src/services/`，页面私有接口极少使用。

### 3. 评估是否应添加到全局 services

**满足以下条件之一，应添加到全局 services**：

- ✅ 任何 API 接口（默认都应放在 services）
- ✅ 多个页面可能需要使用
- ✅ 通用接口（上传、登录等）
- ✅ RESTful 资源操作

**不应添加到全局的情况**：

- ❌ 几乎不存在（API 接口默认放 services）

### 4. 扩展现有接口模块

如果全局存在相同模块的接口文件，优先**扩展现有文件**：

```typescript
// ✅ 扩展现有模块
// services/user.ts
export const getUserInfo = () => request.get<UserInfo>('/user/info')
export const getUserDetail = () => request.get<UserDetail>('/user/detail')  // 新增

// ❌ 新建重复模块
// services/member.ts
export const getMemberInfo = () => request.get<MemberInfo>('/member/info')
```

## 文件组织

### 文件命名
- 格式：`{模块名}.ts`
- 模块名使用小写驼峰（camelCase）
- 示例：`user.ts`、`order.ts`、`product.ts`

### 目录结构
```
services/
├── user.ts          # 用户模块接口
├── order.ts         # 订单模块接口
├── request.ts       # Axios 实例和拦截器
└── index.ts         # 统一导出入口
```

## 接口函数规范

### 命名规范
- 使用 camelCase 命名
- 动词 + 名词结构，清晰表达操作
- 常用动词：`get`、`fetch`、`create`、`update`、`delete`、`upload`

| 操作类型 | 推荐动词 | 示例 |
|---------|---------|------|
| 获取单个 | `get` / `fetch` | `getUserInfo`、`fetchOrderDetail` |
| 获取列表 | `get` / `fetch` + `List` | `getOrderList`、`fetchProductList` |
| 创建 | `create` | `createOrder`、`createAddress` |
| 更新 | `update` | `updateUserInfo`、`updateOrderStatus` |
| 删除 | `delete` / `remove` | `deleteAddress`、`removeCartItem` |
| 上传 | `upload` | `uploadAvatar`、`uploadImage` |

### 函数定义模板

```typescript
import request from './request'
import type { LoginParams, UserInfo, ApiResponse } from '@/types'

/**
 * 用户登录
 * @param params 登录参数
 */
export const login = (params: LoginParams) => {
  return request.post<string>('/auth/login', params)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info')
}

/**
 * 更新用户信息
 * @param data 用户数据
 */
export const updateUserInfo = (data: Partial<UserInfo>) => {
  return request.put<UserInfo>('/user/info', data)
}
```

## request.ts 使用规范

### 导入方式
```typescript
import request from './request'
```

### 请求方法

```typescript
// GET 请求
request.get<T>(url, config?)

// POST 请求
request.post<T>(url, data?, config?)

// PUT 请求
request.put<T>(url, data?, config?)

// DELETE 请求
request.delete<T>(url, config?)

// PATCH 请求
request.patch<T>(url, data?, config?)
```

### URL 规范
- 不以 `/api` 开头（已在 baseURL 中配置）
- 使用 RESTful 风格
- 示例：`/auth/login`、`/user/info`、`/orders/${orderId}`

## 类型规范

### 类型导入
```typescript
// ✅ 正确：从 @/types 统一导入（详见 type.md）
import type { LoginParams, UserInfo } from '@/types'
```

### 泛型使用
```typescript
// 明确指定响应数据类型
request.get<UserInfo>('/user/info')
request.post<string>('/auth/login', params)
request.get<OrderItem[]>('/orders')
```

## 统一导出

### services/index.ts
```typescript
export * from './user'
export * from './order'
export * from './product'
```

### 业务中使用
```typescript
import { login, getUserInfo } from '@/services'
```

## 错误处理

### 全局错误处理
- 已在 `request.ts` 拦截器中统一处理
- 使用 `console.error()` 显示错误提示，需结合项目UI框架弹出toast 提示
- 401 状态自动触发登出

## 禁止事项

1. ❌ 禁止在 API 文件中定义类型（类型应在 `@/types` 中定义）
2. ❌ 禁止直接导入 `@/types/` 子路径
3. ❌ 禁止在 URL 前加 `/api` 前缀
4. ❌ 禁止返回 `any` 类型
