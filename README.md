# 通用基础工程项目

前端项目（PC 桌面端）

## 技术栈

- Vue 3 + TypeScript
- Vite 5
- Pinia（状态管理）
- Vue Router（路由）
- Arco Design Vue（UI 组件库）
- @antv/g2（图表）
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
├── layouts/       # 布局组件
├── pages/         # 页面
├── router/        # 路由配置
├── store/         # Pinia 状态管理
├── styles/        # 全局样式
├── types/         # 类型定义
│   ├── api/       # API 类型
│   └── enum/      # 枚举类型
├── utils/         # 工具函数
├── assets/        # 静态资源
├── constants/     # 常量定义
├── App.vue        # 根组件
└── main.ts        # 入口文件
```

## 目录说明

| 目录 | 职责 |
|------|------|
| services/ | API 封装，统一从 `@/types` 导入类型 |
| components/ | 公共组件，每个组件单独目录 |
| composables/ | 全局组合式函数 |
| layouts/ | 布局组件，根据路由 meta.layout 切换 |
| pages/ | 页面，私有组件放 `pages/xxx/components/` |
| router/ | 路由配置，懒加载 + meta 配置 |
| store/ | Pinia Setup Store |
| styles/ | 全局样式：variables、mixins |
| types/ | 所有类型集中管理，统一从 `@/types` 导入 |
| utils/ | 工具函数 |

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