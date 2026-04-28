<template>
  <div class="home-page">
    <main class="home-page__main">
      <PageTitle />
      <div class="home-page__cards">
        <FeatureCard v-for="card in featureCards" :key="card.id" v-bind="card" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 首页工作台
 */
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store'
import { FeatureCard } from '@/components'
import PageTitle from './components/PageTitle/index.vue'
import type { IFeatureCard } from '@/types'

defineOptions({ name: 'HomePage' })

const userStore = useUserStore()

const featureCards = ref<IFeatureCard[]>([
  {
    id: 'menu',
    title: '菜单管理',
    description: '系统菜单配置、权限控制',
    themeColor: '#1996E0',
    gradientBg:
      'linear-gradient(180deg, rgba(207, 232, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 77%)',
    path: '/system/menu',
    icon: [],
  },
  {
    id: 'role',
    title: '角色管理',
    description: '角色配置、权限分配',
    themeColor: '#4073E6',
    gradientBg:
      'linear-gradient(180deg, rgba(216, 228, 255, 0.7) 0%, rgba(255, 255, 255, 0.5) 77%)',
    path: '/system/role',
    icon: [],
  },
  {
    id: 'department',
    title: '部门管理',
    description: '组织架构、部门配置',
    themeColor: '#139EB1',
    gradientBg:
      'linear-gradient(180deg, rgba(190, 241, 248, 0.7) 0%, rgba(255, 255, 255, 0.5) 77%)',
    path: '/system/department',
    icon: [],
  },
  {
    id: 'user',
    title: '用户管理',
    description: '用户账号、权限分配',
    themeColor: '#E64B6F',
    gradientBg:
      'linear-gradient(180deg, rgba(255, 221, 229, 0.7) 0%, rgba(255, 255, 255, 0.5) 77%)',
    path: '/system/user',
    icon: [],
  },
])

onMounted(() => {
  userStore.info()
})
</script>

<style scoped lang="scss" src="./index.scss"></style>
