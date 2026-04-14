# 项目结构

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 框架 |
| Vite | 构建 |
| Pinia | 状态管理 |
| Vue Router | 路由 |
| Arco Design Vue | UI 组件库 |
| @antv/g2 | 图表 |

## 目录结构

```
src/
├── services/             # API 请求
├── components/           # 公共组件
├── composables/          # 组合式函数
├── config/               # 项目配置
├── layouts/              # 布局组件
├── pages/                # 页面
├── router/               # 路由配置
├── store/                # 状态管理
├── styles/               # 全局样式
├── types/                # 类型定义
├── utils/                # 工具函数
├── App.vue
└── main.ts
```

## 模块职责

| 目录 | 职责 |
|------|------|
| services/ | API 封装，统一从 `@/types` 导入类型 |
| components/ | 公共组件，每个组件单独目录 |
| composables/ | 全局组合式函数，页面私有放 `pages/xxx/composables/` |
| layouts/ | 布局组件，根据路由 meta.layout 切换 |
| pages/ | 页面，私有组件放 `pages/xxx/components/` |
| router/ | 路由配置，懒加载 + meta 配置 |
| store/ | Pinia Setup Store，token 持久化 |
| styles/ | 全局样式：variables、mixins |
| types/ | 所有类型集中管理，统一从 `@/types` 导入 |
| utils/ | 工具函数 |

## 新增模块流程

### 新页面

1. `src/pages/xxx/` 创建目录
2. 创建 `index.vue` + `index.scss`
3. `src/router/index.ts` 添加路由

### 新组件

1. `src/components/Xxx/` 创建目录
2. 创建 `index.vue` + `index.scss`
3. `src/components/index.ts` 导出

### 新 API

1. `src/types/api/` 添加类型
2. `src/services/` 添加接口
3. 更新各 index.ts 导出