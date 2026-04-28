import type { RouteRecordRaw } from 'vue-router'
import type { IMenu } from '@/types'
import { getRouterInstance } from './instance'

/** 动态路由标记 */
let dynamicRoutesAdded = false

/** 预加载所有页面组件 */
const pageModules = import.meta.glob('@/pages/**/*.vue')

/**
 * 将菜单转换为路由配置（保留层级结构）
 */
const transformMenusToRoutes = (menus: IMenu[]): RouteRecordRaw[] => {
  const routes: RouteRecordRaw[] = []

  // 防御性检查
  if (!menus || !Array.isArray(menus)) {
    return routes
  }

  const processMenu = (menu: IMenu, parentPath = ''): RouteRecordRaw | null => {
    // 目录类型 (M) - 有子菜单的容器
    if (menu.menuType === 'M') {
      if (!menu.children || menu.children.length === 0) {
        return null
      }

      const currentPath = menu.path?.startsWith('/') ? menu.path : `/${menu.path || ''}`
      const childRoutes: RouteRecordRaw[] = []
      menu.children.forEach((child) => {
        const route = processMenu(child, currentPath)
        if (route) {
          childRoutes.push(route)
        }
      })

      if (childRoutes.length === 0) {
        return null
      }

      return {
        path: currentPath,
        name: menu.enCode,
        component: () => import('@/layouts/EmptyLayout/index.vue'),
        meta: {
          title: menu.label,
          icon: menu.icon,
          layout: 'empty',
          requiresAuth: true,
        },
        children: childRoutes,
      }
    }

    // 菜单类型 (C) - 实际页面
    if (menu.menuType === 'C' && menu.path) {
      // 拼接完整路径：父级目录 + 当前菜单路径
      const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path
      // 规范化路径：移除开头和结尾的斜杠，确保格式正确
      const normalizedPath = fullPath.replace(/^\/+|\/+$/g, '')
      const componentPath = `/src/pages/${normalizedPath}/index.vue`

      // 查找匹配的组件
      const matchedModule = Object.keys(pageModules).find((key) => key === componentPath)
      if (!matchedModule) {
        // 页面组件不存在，静默跳过
        return null
      }

      return {
        path: menu.path,
        name: menu.enCode,
        component: pageModules[matchedModule],
        meta: {
          title: menu.label,
          icon: menu.icon,
          layout: 'header',
          requiresAuth: true,
        },
      }
    }

    return null
  }

  menus.forEach((menu) => {
    const route = processMenu(menu)
    if (route) {
      routes.push(route)
    }
  })

  return routes
}

/**
 * 动态添加路由
 * @param menus 菜单列表
 */
export const addDynamicRoutes = (menus: IMenu[]): void => {
  // 无论菜单是否为空，都标记为已处理，防止重复请求
  if (dynamicRoutesAdded) return
  dynamicRoutesAdded = true

  // 菜单为空时无需添加路由
  if (!menus || menus.length === 0) return

  const router = getRouterInstance()
  const routes = transformMenusToRoutes(menus)

  routes.forEach((route) => {
    try {
      router.addRoute(route)
    } catch {
      // 路由添加失败时静默处理
    }
  })

  // 移除之前的 404 路由，重新添加到末尾
  try {
    router.removeRoute('NotFound')
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/pages/error/404.vue'),
      meta: {
        title: '页面不存在',
        layout: 'empty',
      },
    })
  } catch {
    // 404 路由重置失败时静默处理
  }
}

/**
 * 重置动态路由标记（用于退出登录）
 */
export const resetDynamicRoutes = (): void => {
  dynamicRoutesAdded = false
}

/**
 * 检查动态路由是否已添加
 */
export const hasDynamicRoutes = (): boolean => dynamicRoutesAdded