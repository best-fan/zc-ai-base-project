/**
 * Router 实例存储
 * 用于解决循环依赖问题
 */
import type { Router } from 'vue-router'

let routerInstance: Router | null = null

export const setRouterInstance = (router: Router): void => {
  routerInstance = router
}

export const getRouterInstance = (): Router => {
  if (!routerInstance) {
    throw new Error('Router instance not initialized. Call setRouterInstance first.')
  }
  return routerInstance
}
