<template>
  <header class="header">
    <div class="header__left">
      <Logo />
      <nav class="header__breadcrumb">
        <template v-for="(item, index) in breadcrumbItems" :key="index">
          <img
            v-if="item.icon == 'home' && breadcrumbLength <= 1"
            src="@/assets/images/index/home.png"
            alt=""
            class="header__breadcrumb-icon"
            :class="{ 'header__breadcrumb-icon--link': item.path }"
            @click="item.path && handleBreadcrumbClick(item)"
          >
          <img
            v-if="item.icon == 'home' && breadcrumbLength > 1"
            src="@/assets/images/index/home2.png"
            alt=""
            class="header__breadcrumb-icon"
            :class="{ 'header__breadcrumb-icon--link': item.path }"
            @click="item.path && handleBreadcrumbClick(item)"
          >
          <span
            class="header__breadcrumb-item"
            :class="{
              'header__breadcrumb-item--link': item.path,
              'header__breadcrumb-item--first': index === 0,
            }"
            @click="handleBreadcrumbClick(item)"
          >
            {{ item.title }}
          </span>
          <span v-if="index < breadcrumbItems.length - 1" class="header__breadcrumb-separator">
            /
          </span>
        </template>
      </nav>
    </div>
    <div class="header__right">
      <!-- 设置按钮 - 有 sys 权限时才显示 -->
      <a-popover
        v-if="showSettings"
        trigger="click"
        position="bottom"
        :content-style="{ padding: '0' }"
      >
        <img class="set" src="@/assets/images/index/set.png" alt="">
        <template #content>
          <div class="settings-menu">
            <div class="settings-menu__title">{{ settingsMenuData?.title }}</div>
            <div
              v-for="item in settingsMenuData?.children"
              :key="item.enCode"
              class="settings-menu__item"
              @click="handleMenuClick(item)"
            >
              <span class="settings-menu__text">{{ item.label }}</span>
            </div>
          </div>
        </template>
      </a-popover>
      <UserProfile />
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * 头部导航栏组件
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message, Modal } from '@arco-design/web-vue'
import Logo from './Logo.vue'
import UserProfile from './UserProfile.vue'
import { useUserStore } from '@/store'

defineOptions({ name: 'AppHeader' })

interface IBreadcrumbItem {
  title: string
  icon?: string
  path?: string
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

/** 需要显示的的菜单路径 */
const excludedPaths = ['department', 'role', 'user', 'menu']

/** 系统设置菜单数据 - 包含标题和子菜单 */
const settingsMenuData = computed(() => {
  const menus = userStore.menuTreeBoList || []
  const sysMenu = menus.find((m) => m.menuType === 'M' && m.enCode === 'sys')
  if (!sysMenu?.children) return null
  const parentPath = sysMenu.path?.replace(/^\//, '') || ''
  const children = sysMenu.children
    .filter((child) => excludedPaths.includes(child.path || '') || child.menuType === 'A')
    .map((child) => {
      // 按钮类型(A)不生成路由路径
      if (child.menuType === 'A') {
        return {
          enCode: child.enCode,
          label: child.label,
          icon: child.icon,
          path: '',
          menuType: child.menuType,
        }
      }
      // 如果 child.path 已经是绝对路径，直接使用；否则拼接父级路径
      const fullPath = child.path?.startsWith('/') ? child.path : `/${parentPath}/${child.path}`
      return {
        enCode: child.enCode,
        label: child.label,
        icon: child.icon,
        path: fullPath,
        menuType: child.menuType,
      }
    })
  return {
    title: sysMenu.label,
    children,
  }
})

/** 是否显示设置按钮 - 有 sys 权限时才显示 */
const showSettings = computed(() => {
  const menus = userStore.menuTreeBoList || []
  return menus.some((m) => m.menuType === 'M' && m.enCode === 'sys')
})

// 获取面包屑配置 - 根据路由层级自动生成，过滤目录类型(M)
const breadcrumbItems = computed<IBreadcrumbItem[]>(() => {
  // 过滤掉目录类型(M)，只保留实际页面(C)
  const matched = route.matched.filter((r) => r.meta.title && r.meta.layout === 'header')

  // 首页特殊处理 - 工作台不可点击，颜色为 #1B2129
  if (matched.length === 0 || route.path === '/') {
    return [{ title: '工作台', icon: 'home' }]
  }

  // 动态路由：构建面包屑链
  const items: IBreadcrumbItem[] = [{ title: '工作台', icon: 'home', path: '/' }]

  matched.forEach((r, index) => {
    const isLast = index === matched.length - 1
    items.push({
      title: r.meta.title as string,
      icon: r.meta.icon as string | undefined,
      path: isLast ? undefined : r.path,
    })
  })

  return items
})

// 面包屑长度
const breadcrumbLength = computed(() => breadcrumbItems.value.length)

// 处理面包屑点击
const handleBreadcrumbClick = (item: IBreadcrumbItem): void => {
  if (item.path) {
    router.push(item.path)
  }
}

// 处理设置菜单点击
const handleMenuClick = async (item: {
  enCode: string
  path: string
  label?: string
  menuType?: string
}): Promise<void> => {
  // 同步角色按钮特殊处理（menuType === 'A'，enCode === 'sysrole'）
  if (item.enCode === 'sysrole' && item.menuType === 'A') {
    Modal.confirm({
      title: item.label || '同步角色',
      content: '确定要同步PMS中的角色数据吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        // await syncRoleFromPms()
        Message.success('同步成功')
      },
    })
    return
  }
  // 路由菜单项跳转
  if (item.path && item.menuType === 'C') {
    router.push(item.path)
  }
}
</script>

<style scoped lang="scss" src="./index.scss"></style>
