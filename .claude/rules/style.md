---
paths:
  - 'src/**/*.scss'
  - 'src/**/*.vue'
---

# 样式规范

## 开发前检查流程

**在编写新样式前，必须按以下顺序检查：**

### 1. 检查全局样式是否已存在

**必须先检查 `src/styles/` 目录**，确认没有可复用的样式变量或 mixins：

```bash
# 搜索现有样式
ls src/styles/
grep -r "变量关键词" src/styles/
```

**常见全局样式清单**：

| 类型 | 文件 | 内容 |
|------|------|------|
| 变量 | `variables.scss` | 颜色、字体、间距 |
| 混入 | `mixins.scss` | 常用样式组合 |
| 全局 | `global.scss` | 全局基础样式 |

### 2. 判断样式归属

| 条件 | 归属目录 | 示例 |
|------|----------|------|
| 全局通用样式 | `src/styles/` | 颜色变量、字体定义 |
| 组件私有样式 | 组件目录 `index.scss` | `.user-card` |
| 页面私有样式 | 页面目录 `index.scss` | 页面特定样式 |

### 3. 评估是否应添加到全局样式

**满足以下条件之一，应添加到全局 styles**：

- ✅ 全局颜色/字体变量
- ✅ 多个组件共用的样式
- ✅ 通用布局样式（可提取为 mixin）
- ✅ 品牌相关样式定义

**不应添加到全局的情况**：

- ❌ 仅单个组件/页面使用
- ❌ 强依赖特定组件结构
- ❌ 特定业务场景样式

### 4. 扩展现有样式模块

如果全局存在类似样式，优先**使用或扩展全局样式**：

```scss
// ✅ 使用全局变量
@import '@/styles/variables.scss';

.user-card {
  color: $primary-color;      // 使用全局颜色变量
  padding: $spacing-md;       // 使用全局间距变量
}

// ✅ 扩展 mixin
// styles/mixins.scss
@mixin card-base {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@mixin card-hover {           // 新增
  @include card-base;
  transition: transform 0.2s;
  &:hover { transform: translateY(-2px); }
}

// ❌ 新建重复样式定义
.user-card {
  color: #1989fa;             // 硬编码颜色（应使用变量）
  border-radius: 8px;         // 应使用 mixin
}
```

## 技术栈

- **预处理器**: SCSS (Sass)
- **作用域**: Vue scoped style（`<style scoped>`）

## 文件结构

```
components/UserCard/
├── index.vue
└── index.scss

pages/Home/
├── index.vue
└── index.scss
```

## 命名规范

### BEM 命名法

| 类型     | 命名规则             | 示例                                       |
| -------- | -------------------- | ------------------------------------------ |
| Block    | 驼峰命名或kebab-case | `.user-card`, `.home`                      |
| Element  | 双下划线或嵌套       | `.user-card__header`, `.user-card .header` |
| Modifier | 双横杠或class组合    | `.user-card--active`, `.user-card.active`  |

### 使用示例

**SCSS 文件 (`index.scss`)：**

```scss
.user-card {
  border: 1px solid #eee;

  &.active {
    border-color: #1989fa;
  }
  .image {
    width: 100%;
  }
  .info {
    padding: 12px;
  }
}
```

**Vue 组件：**

```vue
<template>
  <div class="user-card" :class="{ active: isActive }">
    <img class="image" />
    <div class="info">...</div>
  </div>
</template>

<script setup lang="ts">
// 无需导入样式文件
</script>

<style scoped lang="scss" src="./index.scss"></style>
```

## 单位

- 统一使用 `px`

## 嵌套层级

- 最多 3 层嵌套
