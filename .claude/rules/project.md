# 项目结构

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 框架 |
| Vite | 构建 |
| Pinia + pinia-plugin-persistedstate | 状态管理（含持久化） |
| Vue Router | 路由（静态 + 动态路由） |
| Arco Design Vue | UI 组件库 |
| @zcui/components、@zcui/system | 业务组件库（系统管理页面） |
| crypto-js | 加密（MD5、AES） |
| @antv/g2 | 图表（已安装，当前暂未使用） |

## 目录结构

```
src/
├── services/             # API 请求
├── components/           # 公共组件
├── composables/          # 组合式函数
├── config/               # 项目配置
├── constants/            # 应用常量
├── layouts/              # 布局组件
├── pages/                # 页面
├── router/               # 路由配置（多文件）
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
| config/ | 项目配置常量（标题、API 地址、超时等） |
| constants/ | 应用常量（STORAGE_KEYS、PAGINATION_CONFIG、DATE_FORMAT 等） |
| layouts/ | 布局组件，根据路由 meta.layout 切换（HeaderLayout / EmptyLayout） |
| pages/ | 页面，私有组件放 `pages/xxx/components/` |
| router/ | 路由配置，多文件拆分（index/static/dynamic/guard/instance） |
| store/ | Pinia Setup Store，子目录形式（`store/user/index.ts`），persist 持久化 |
| styles/ | 全局样式：variables、mixins |
| types/ | 所有类型集中管理，统一从 `@/types` 导入 |
| utils/ | 工具函数（storage、crypto、auth） |

## 新增模块流程

### 新页面

1. `src/pages/xxx/` 创建目录
2. 创建 `index.vue` + `index.scss`
3. 静态页面：在 `src/router/static.ts` 添加路由；业务页面：由后端菜单动态注册（详见 `router.md`）

### 新组件

1. `src/components/Xxx/` 创建目录
2. 创建 `index.vue` + `index.scss`
3. `src/components/index.ts` 导出

### 新 API

1. `src/types/api/` 添加类型
2. `src/services/` 添加接口
3. 更新各 index.ts 导出

### 新 Store

1. `src/store/xxx/` 创建目录
2. 创建 `index.ts`（Setup Store）
3. `src/store/index.ts` 导出
