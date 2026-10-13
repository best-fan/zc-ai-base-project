# 通用基础工程项目

前端项目（PC 桌面端）

## 技术栈

- Vue 3 + TypeScript
- Vite 5
- Pinia + pinia-plugin-persistedstate（状态管理，支持持久化）
- Vue Router（路由，静态路由 + 后端菜单驱动的动态路由）
- Arco Design Vue（UI 组件库）
- @zcui/components、@zcui/system（业务组件库，系统管理页面）
- crypto-js（加密：MD5、AES）
- @antv/g2（图表，已安装，当前暂未使用）
- SCSS（样式）

## 开发环境

- Node.js: 20.x（通过 Volta 管理）
- 包管理器: pnpm

## 开始开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview

# 代码检查
pnpm lint

# 类型检查
pnpm type-check

# 代码检查并自动修复
pnpm lint:fix

# 格式化代码
pnpm format
```

## 代码规范

- 所有代码使用 TypeScript，禁止 JavaScript
- 禁止使用 `any` 类型
- 组件使用 PascalCase 命名
- 类型接口使用 `I` 前缀（如 `IUserInfo`）
- 类型别名使用 `T` 前缀（如 `TStatus`）
- 使用 SCSS（`.scss`）
- 所有注释使用中文

## 项目结构

```
src/
├── services/      # API 请求封装
├── components/    # 公共组件
├── composables/   # 组合式函数
├── config/        # 项目配置
├── constants/     # 应用常量
├── layouts/       # 布局组件（HeaderLayout / EmptyLayout）
├── pages/         # 页面
├── router/        # 路由配置（index/static/dynamic/guard/instance）
├── store/         # Pinia 状态管理（子目录形式，如 store/user/index.ts）
├── styles/        # 全局样式
├── types/         # 类型定义
│   ├── api/       # API 请求/响应类型
│   ├── models/    # 业务模型类型
│   ├── components.ts   # 组件相关类型
│   └── composables.ts  # 组合式函数相关类型
├── utils/         # 工具函数
├── assets/        # 静态资源
├── App.vue        # 根组件
└── main.ts        # 入口文件
```

## 目录说明

| 目录 | 职责 |
|------|------|
| services/ | API 封装，业务层统一使用 `http` 对象，类型从 `@/types` 导入 |
| components/ | 公共组件，每个组件单独目录 |
| composables/ | 全局组合式函数（`use` 前缀） |
| config/ | 项目配置常量（标题、API 地址、超时等） |
| constants/ | 应用常量（STORAGE_KEYS、PAGINATION_CONFIG、DATE_FORMAT 等） |
| layouts/ | 布局组件（HeaderLayout / EmptyLayout），根据路由 meta.layout 切换 |
| pages/ | 页面，私有组件放 `pages/xxx/components/` |
| router/ | 路由配置，多文件拆分：静态路由 + 后端菜单驱动的动态路由 |
| store/ | Pinia Setup Store（子目录形式），persist 持久化 |
| styles/ | 全局样式：variables、mixins |
| types/ | 所有类型集中管理，统一从 `@/types` 导入 |
| utils/ | 工具函数（storage、crypto、auth） |

## 路由机制

项目采用「静态路由 + 动态路由」组合：

- **静态路由**（`router/static.ts`）：无需权限的基础路由，如登录页 `/login`、首页 `/`。
- **动态路由**（`router/dynamic.ts`）：登录后根据后端返回的菜单树（`IMenu[]`）动态生成并注册，页面组件按 `pages/{菜单path}/index.vue` 自动匹配。
- **路由守卫**（`router/guard.ts`）：处理页面标题、登录拦截、动态路由恢复。
- **路由实例**（`router/instance.ts`）：解决循环依赖，供动态路由注册使用。

> 新增业务页面只需在 `src/pages/` 下按菜单路径创建页面，并在后端菜单配置对应路径，前端无需手动修改路由文件。

## 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| VITE_API_BASE_URL | API 基础地址 | /api |
| VITE_APP_TITLE | 应用标题 | 通用基础工程项目 |
| VITE_ENV | 环境标识 | development / production |

本地开发可创建 `.env.local` 覆盖配置。

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 开发规范文档

详细规范请参考 `.claude/rules/` 目录：

- [代码质量规范](.claude/rules/code-quality.md)
- [Vue 组件规范](.claude/rules/vue-component.md)
- [Store 规范](.claude/rules/store.md)
- [Services 规范](.claude/rules/services.md)
- [类型规范](.claude/rules/type.md)
- [路由规范](.claude/rules/router.md)
- [样式规范](.claude/rules/style.md)
- [工具函数规范](.claude/rules/utils.md)
- [组合式函数规范](.claude/rules/composables.md)
- [项目结构规范](.claude/rules/project.md)