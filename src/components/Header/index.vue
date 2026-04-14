<template>
  <header class="header">
    <div class="header__left">
      <Logo />
      <nav class="header__breadcrumb">
        <template v-for="(item, index) in breadcrumbItems" :key="index">
          <img
            v-if="item.icon == 'home' && breadcrumbLength <= 1" src="@/assets/images/index/home.png" alt=""
            class="header__breadcrumb-icon" @click="handleBreadcrumbClick(item)"
          >
          <img
            v-if="item.icon == 'home' && breadcrumbLength > 1" src="@/assets/images/index/home2.png" alt=""
            class="header__breadcrumb-icon" @click="handleBreadcrumbClick(item)"
          >
          <img
            v-if="item.icon == 'jf'" src="@/assets/images/index/jf.png" alt="" class="header__breadcrumb-icon"
            @click="handleBreadcrumbClick(item)"
          >
          <span
            class="header__breadcrumb-item" :class="{ 'header__breadcrumb-item--link': item.path }"
            @click="handleBreadcrumbClick(item)"
          >
            {{ item.title }}
          </span>
          <span v-if="index < breadcrumbItems.length - 1" class="header__breadcrumb-separator">/</span>
        </template>
      </nav>
    </div>
    <div class="header__right">
      <a-popover trigger="click" position="bottom" :content-style="{ padding: '0' }">
        <img class="set" src="@/assets/images/index/set.png" alt="">
        <template #content>
          <div class="settings-menu">
            <div class="settings-menu__title">系统设置</div>
            <div
              v-for="item in settingsMenu" :key="item.key" class="settings-menu__item"
              @click="handleMenuClick(item)"
            >
              <component :is="item.icon" class="settings-menu__icon" />
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
import { computed, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IconUser, IconUserGroup, IconIdcard, IconApps } from '@arco-design/web-vue/es/icon'
import Logo from './Logo.vue'
import UserProfile from './UserProfile.vue'

defineOptions({ name: 'AppHeader' })

interface IBreadcrumbItem {
  title: string
  icon?: string
  path?: string
}

interface ISettingsMenuItem {
  key: string
  label: string
  icon: Component
  path: string
}

const route = useRoute()
const router = useRouter()

// 系统设置菜单
const settingsMenu: ISettingsMenuItem[] = [
  { key: 'user', label: '用户管理', icon: IconUser, path: '/system/user' },
  { key: 'dept', label: '部门管理', icon: IconUserGroup, path: '/system/department' },
  { key: 'role', label: '角色管理', icon: IconIdcard, path: '/system/role' },
  { key: 'menu', label: '菜单管理', icon: IconApps, path: '/system/menu', },
]

// 获取面包屑配置
const breadcrumbItems = computed<IBreadcrumbItem[]>(() => {
  const breadcrumb = route.meta.breadcrumb as IBreadcrumbItem[] | undefined
  if (!breadcrumb) {
    // 默认显示工作台
    return [{ title: '工作台', icon: 'home', path: '/' }]
  }
  // 添加图标组件
  return breadcrumb
})

// 面包屑长度（安全访问）
const breadcrumbLength = computed(() => {
  const breadcrumb = route.meta.breadcrumb as IBreadcrumbItem[] | undefined
  return breadcrumb?.length ?? 0
})

// 处理面包屑点击
const handleBreadcrumbClick = (item: IBreadcrumbItem): void => {
  if (item.path) {
    router.push(item.path)
  }
}

// 处理设置菜单点击
const handleMenuClick = (item: ISettingsMenuItem): void => {
  // TODO: 跳转到对应管理页面
  router.push(item.path)
}
</script>

<style scoped lang="scss" src="./index.scss"></style>