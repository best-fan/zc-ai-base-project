import type { Router } from 'vue-router'
import { isLogin } from '@/utils/auth'
import { useUserStore } from '@/store/user'
import { addDynamicRoutes, hasDynamicRoutes } from './dynamic'

/**
 * 设置路由守卫
 * @param router 路由实例
 */
export const setupRouterGuards = (router: Router): void => {
  router.beforeEach(async (to, _from, next) => {
    // 设置页面标题
    if (to.meta.title) {
      document.title = to.meta.title as string
    }

    // 未登录处理
    if (to.meta.requiresAuth && !isLogin()) {
      next({
        path: '/login',
        query: { redirect: encodeURIComponent(to.fullPath) },
      })
      return
    }

    // 已登录访问登录页，跳转首页
    if (to.path === '/login' && isLogin()) {
      next({ path: '/', replace: true })
      return
    }

    // 动态路由未加载，从持久化数据恢复
    if (!hasDynamicRoutes() && isLogin()) {
      const userStore = useUserStore()
      if (userStore.menuTreeBoList.length > 0) {
        addDynamicRoutes(userStore.menuTreeBoList)
        // 重新导航到目标路由
        next({ ...to, replace: true })
        return
      }
      // 持久化数据也没有，重新获取用户信息
      try {
        await userStore.info()
        next({ ...to, replace: true })
        return
      } catch {
        // 获取用户信息失败，跳转登录
        userStore.logoutCallBack()
        next({ path: '/login', replace: true })
        return
      }
    }

    next()
  })
}
