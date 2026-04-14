import { createRouter, createWebHistory } from 'vue-router'
import { staticRoutes } from './static'
import { setupRouterGuards } from './guard'
import { setRouterInstance } from './instance'

const router = createRouter({
  history: createWebHistory(),
  routes: staticRoutes,
})

// 设置路由实例（供动态路由使用）
setRouterInstance(router)

// 设置路由守卫
setupRouterGuards(router)

export { addDynamicRoutes, resetDynamicRoutes, hasDynamicRoutes } from './dynamic'
export default router