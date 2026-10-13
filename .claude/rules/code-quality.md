---
paths:
  - "src/**/*.ts"
  - "src/**/*.vue"
---

# 代码质量规范

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserCard.vue` |
| 组合式函数 | camelCase + use 前缀 | `useUserStore` |
| 普通函数 | camelCase | `getUserInfo` |
| 常量 | SCREAMING_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 变量 | camelCase | `isLoading` |
| 类型/接口 | PascalCase | `UserInfo` |

## 文件命名

```
user.ts            # Store 模块
user.ts            # Services 模块
UserCard.vue       # Vue 组件
useAuth.ts         # 组合式函数
```

## 类型安全

```typescript
// ✅ 显式类型注解
const userList = ref<UserInfo[]>([])
function getData(): UserInfo { return {} }

// ✅ 使用 unknown 替代 any
function process(data: unknown) {
  if (typeof data === 'string') data.toUpperCase()
}

// ❌ 禁止 any
const user: any = {}
```

## 代码复杂度

- 函数不超过 50 行
- 嵌套最多 3 层
- 圈复杂度不超过 10

```typescript
// ✅ 提前返回减少嵌套
function process(data: Data | null) {
  if (!data) return
  if (!data.items?.length) return
  data.items.forEach(item => { /* ... */ })
}
```

## 注释规范

```typescript
// ✅ 解释原因
// 后端返回秒级时间戳，需乘以 1000
const timestamp = serverTime * 1000

// TODO: 待实现
// FIXME: 需要修复
```

## 错误处理

```typescript
async function fetchData() {
  try {
    const res = await api.getData()
    return res.data
  } catch (error) {
    showToast('获取数据失败')
    return null
  }
}
```

## 性能优化

```typescript
// ✅ computed 缓存
const totalPrice = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
)

// ✅ 防抖/节流
const handleSearch = debounce((keyword: string) => {
  fetchSearchResult(keyword)
}, 300)
```

## 禁止事项

1. ❌ 禁止 `any` 类型
2. ❌ 禁止 `console.log`（生产代码）
3. ❌ 禁止未使用的变量/函数/导入
4. ❌ 禁止嵌套超过 3 层
5. ❌ 禁止直接修改 props
6. ❌ 禁止模板中调用函数（事件处理除外）