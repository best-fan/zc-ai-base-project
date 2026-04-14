---
paths:
  - "src/components/**/*"
  - "src/pages/**/*"

---
# Vue 组件开发规范

## 开发前检查流程

**在创建新组件前，必须按以下顺序检查：**

### 1. 判断组件归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 多个页面共用 | `src/components/` | `Button`、`Modal`、`Table` |
| 单个页面独用 | `src/pages/xxx/components/` | `UserCard`（仅在用户页使用） |
| 页面内复用但其他页面不用 | `src/pages/xxx/components/` | 页面私有组件 |

### 2. 检查全局组件是否已存在

**必须先搜索 `src/components/` 目录**，确认没有可复用的组件：

```bash
# 搜索现有组件
ls src/components/
grep -r "组件功能关键词" src/components/
```

**常见全局组件清单**（示例）：

| 组件名 | 路径 | 功能 |
|--------|------|------|
| `DonutChart` | `components/DonutChart` | 环形图 |
| `PageContainer` | `components/PageContainer` | 页面容器 |

### 3. 评估是否应提取为全局组件

**满足以下条件之一，应提取为全局组件**：

- ✅ 3个及以上页面需要使用
- ✅ 通用UI组件（按钮、表单、卡片等）
- ✅ 通用业务组件（图表、列表项等）
- ✅ 可配置性高、复用性强

**不应提取的情况**：

- ❌ 仅单个页面使用
- ❌ 强依赖特定业务上下文
- ❌ 复杂度低，内联即可

### 4. 扩展现有组件

如果全局存在类似组件，优先**扩展现有组件**而非新建：

```vue
<!-- ✅ 扩展现有组件 -->
<ExistingComponent :prop1="value" :prop2="newValue">
  <template #extra>新增内容</template>
</ExistingComponent>

<!-- ❌ 新建重复组件 -->
<NewComponent ... />
```

## 目录结构

**每个组件必须单独一个目录**

```
src/components/
├── UserCard/                    # 组件目录（PascalCase）
│   ├── index.vue               # 组件入口
│   ├── index.scss              # 样式文件
│   ├── types.ts                # 类型定义（可选）
│   └── constants.ts            # 常量定义（可选）
└── index.ts                    # 统一导出
```

### 目录结构文件说明

| 文件 | 必须 | 说明 |
|------|------|------|
| `index.vue` | ✅ | 组件入口文件 |
| `index.scss` | ✅ | 组件样式文件 |
| `types.ts` | 按需 | 组件私有类型定义 |
| `constants.ts` | 按需 | 组件私有常量定义 |

- 公共组件：`src/components/`
- 页面私有组件：`src/pages/xxx/components/`

## 组件名称

必须使用 `defineOptions` 声明组件名称：

```vue
<script setup lang="ts">
defineOptions({ name: 'UserCard' })
</script>
```

## 组件结构

```vue
<script setup lang="ts">
// 1. 组件名称
defineOptions({ name: 'UserCard' })

// 2. 类型导入
import type { UserInfo } from './types'

// 3. Vue 导入
import { ref, computed } from 'vue'

// 4. Props/Emits
interface Props {
  userId: string
  title?: string
}

const props = withDefaults(defineProps<Props>(), { title: '' })

interface Emits {
  (e: 'click', id: string): void
}

const emit = defineEmits<Emits>()

// 5. 响应式/计算/方法
const loading = ref(false)
const handleClick = () => emit('click', props.userId)
</script>

<template>
  <div class="user-card">
    <div class="header">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss" src="./index.scss"></style>
```

## Props 定义

```vue
<script setup lang="ts">
interface Props {
  userId: string       // 必填
  title?: string       // 可选
  items: OrderItem[]   // 数组
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  items: () => []
})
</script>
```

## Emits 定义

```vue
<script setup lang="ts">
interface Emits {
  (e: 'click', id: string): void
  (e: 'update:modelValue', value: string): void
}

const emit = defineEmits<Emits>()

// 触发
emit('click', props.userId)
</script>
```

## 统一导出

```typescript
// components/index.ts
export { default as UserCard } from './UserCard'

// 使用
import { UserCard } from '@/components'
```

## constants.ts 规范

### 何时使用 constants.ts

**满足以下条件之一，应创建 constants.ts**：

- ✅ 组件内有多个配置项/选项列表
- ✅ 组件内有状态映射关系（如状态码 → 状态文本）
- ✅ 组件内有固定枚举值（如 Tab 选项、类型选项）
- ✅ 组件内有业务相关常量（如阈值、限制值）

**不需要 constants.ts 的情况**：

- ❌ 组件内仅 1-2 个简单常量（可直接在 vue 文件中定义）
- ❌ 常量已在全局 types/enum 中定义

### 常量命名规范

| 常量类型 | 前缀/后缀 | 示例 |
|----------|----------|------|
| 选项列表 | `_OPTIONS` | `STATUS_OPTIONS`、`TAB_OPTIONS` |
| 映射关系 | `_MAP` | `STATUS_MAP`、`TYPE_LABEL_MAP` |
| 配置项 | `_CONFIG` | `CHART_CONFIG`、`FORM_CONFIG` |
| 枚举值 | `_LIST` 或 `_VALUES` | `ALLOWED_TYPES_LIST` |

### constants.ts 示例

```typescript
// components/UserCard/constants.ts

// 状态选项列表
export const STATUS_OPTIONS = [
  { label: '待处理', value: 'pending' },
  { label: '进行中', value: 'processing' },
  { label: '已完成', value: 'completed' },
]

// 状态映射关系
export const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: '待处理', color: '#999' },
  processing: { label: '进行中', color: '#1890ff' },
  completed: { label: '已完成', color: '#52c41a' },
}

// 图表配置
export const CHART_CONFIG = {
  height: 200,
  innerRadius: 0.6,
  outerRadius: 0.8,
}

// 业务阈值
export const MAX_RETRY_COUNT = 3
export const DEFAULT_PAGE_SIZE = 10
```

### 在组件中使用

```vue
<script setup lang="ts">
import { STATUS_OPTIONS, STATUS_MAP, CHART_CONFIG } from './constants'

const currentStatus = ref('pending')
const statusInfo = computed(() => STATUS_MAP[currentStatus.value])
</script>

<template>
  <select :options="STATUS_OPTIONS" />
  <span :style="{ color: statusInfo.color }">{{ statusInfo.label }}</span>
</template>
```