import type { RouteRecordRaw } from 'vue-router'

/** 静态路由 - 不需要权限的基础路由 */
export const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/home/index.vue'),
    meta: {
      title: '众诚经营助手 - 工作台',
      layout: 'header',
      requiresAuth: true,
      breadcrumb: [{ title: '工作台', icon: 'home' }],
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录',
      layout: 'empty',
    },
  },
  // 404 页面移到动态路由中添加，避免在动态路由加载前匹配所有路由
]