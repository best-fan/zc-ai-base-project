<template>
  <component :is="layoutComponent" class="app">
    <router-view />
  </component>
</template>

<script setup lang="ts">
/**
 * 应用根组件
 * 布局选择逻辑：
 * - 只对顶层路由应用布局（嵌套路由由父路由组件处理）
 * - 顶层路由通过 meta.layout 指定布局类型
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HeaderLayout, EmptyLayout } from '@/layouts'

defineOptions({ name: 'App' })

const route = useRoute()

const layoutComponent = computed(() => {
  const layout = route.meta.layout as string | undefined
  switch (layout) {
    case 'header':
      return HeaderLayout
    case 'empty':
      return EmptyLayout
    default:
      return HeaderLayout
  }
})
</script>

<style scoped lang="scss">
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
