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

**现有接口清单**：

| 模块 | 文件 | 接口 |
|------|------|------|
| 用户 | `user.ts` | `login`、`logout`、`getUserInfo` |
| 验证码 | `verify.ts` | `getCaptcha`、`checkCaptcha` |

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
export function getUserInfo() {
  return http.get<IApiResponse<IUserInfo>>('/base/user/userInfo')
}
// 新增接口
export function updateUserInfo(data: IUpdateUserReqData) {
  return http.put<IApiResponse<void>>('/base/user/userInfo', data)
}

// ❌ 新建重复模块
// services/member.ts
export function getMemberInfo() { ... }
```

## 文件组织

### 文件命名
- 格式：`{模块名}.ts`
- 模块名使用小写驼峰（camelCase）
- 示例：`user.ts`、`verify.ts`、`order.ts`

### 目录结构
```
services/
├── user.ts            # 用户模块接口
├── verify.ts          # 验证码模块接口
├── request.ts         # Axios 实例、拦截器、http 封装
├── _vendorAxios.ts    # 第三方错误处理（handleError）
└── index.ts           # 统一导出入口
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

**必须使用 `http` 对象（见下方 request.ts 规范），并显式声明响应泛型。**

```typescript
import { http } from './request'
import type { ILoginReqData, ILoginRes, IApiResponse } from '@/types'

/**
 * 用户登录
 * @param data 登录参数
 */
export function login(data: ILoginReqData) {
  return http.post<IApiResponse<ILoginRes>>('/base/login/withPwd', data)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.get<IApiResponse<IUserInfo>>('/base/user/userInfo')
}

/**
 * 更新用户信息
 * @param data 用户数据
 */
export function updateUserInfo(data: IUpdateUserReqData) {
  return http.put<IApiResponse<IUserInfo>>('/base/user/userInfo', data)
}
```

## request.ts 使用规范

### 导入方式

```typescript
// ✅ 业务接口统一使用 http
import { http } from './request'

// ⚠️ request（axios 实例）仅供 request.ts 内部使用，业务层不要直接导入
```

### 请求方法

`http` 对象封装了五个方法，均支持泛型指定响应类型：

```typescript
// GET 请求
http.get<T>(url, config?)

// POST 请求
http.post<T>(url, data?, config?)

// PUT 请求
http.put<T>(url, data?, config?)

// DELETE 请求
http.delete<T>(url, config?)

// PATCH 请求
http.patch<T>(url, data?, config?)
```

> 注意：`http.get<T>()` 中的 `T` 是**响应数据类型**，而非 axios 的 `AxiosResponse`。响应拦截器已剥离外层，直接返回 `response.data`。

### URL 规范
- 不以 `/api` 开头（已在 baseURL 中配置 `VITE_API_BASE_URL`）
- 使用 RESTful 风格
- 当前后端前缀为 `/base`，示例：`/base/login/withPwd`、`/base/user/userInfo`

## 类型规范

### 类型导入
```typescript
// ✅ 正确：从 @/types 统一导入（详见 type.md）
import type { ILoginReqData, ILoginRes, IApiResponse } from '@/types'
```

### 泛型使用

响应统一用 `IApiResponse<T>` 包裹：

```typescript
http.get<IApiResponse<IUserInfo>>('/base/user/userInfo')
http.post<IApiResponse<ILoginRes>>('/base/login/withPwd', data)
// 无响应体的接口用 void
http.post<void>('/base/logout')
```

## 统一导出

### services/index.ts
```typescript
export * from './request'
export * from './user'
export * from './verify'
```

### 业务中使用
```typescript
import { login, getUserInfo } from '@/services'
```

## 错误处理

### 全局错误处理（已在 request.ts 拦截器中统一处理）

响应拦截器规则：

1. **业务错误**：当响应体 `code` 存在且 `code !== 1` 时，使用 Arco Design 的 `Message.error(msg)` 弹出提示，并 `reject`。
2. **网络/HTTP 错误**：交由 `_vendorAxios.ts` 的 `handleError(error)` 统一处理（如超时、断网、非 2xx 状态码）。

```typescript
// request.ts 中的拦截器（节选）
import { Message } from '@arco-design/web-vue'

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data
    if (code && code != 1) {
      Message.error(msg)
      return Promise.reject(msg)
    }
    return response.data
  },
  (error: AxiosError) => {
    handleError(error)
    return Promise.reject(error)
  }
)
```

**提示**：业务代码通常无需再 catch 弹提示（拦截器已弹）；仅需在需要中断后续流程时使用 `try/catch`。

## 禁止事项

1. ❌ 禁止在 API 文件中定义类型（类型应在 `@/types` 中定义）
2. ❌ 禁止直接导入 `@/types/` 子路径
3. ❌ 禁止在 URL 前加 `/api` 前缀
4. ❌ 禁止返回 `any` 类型
5. ❌ 禁止业务层直接导入 axios 实例 `request`（统一用 `http`）
