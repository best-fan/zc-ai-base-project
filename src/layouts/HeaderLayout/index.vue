<template>
  <div class="header-layout">
    <AppHeader />
    <main class="header-layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
/**
 * 带全局 Header 的布局组件
 */
import { AppHeader } from '@/components'

defineOptions({ name: 'HeaderLayout' })
</script>

<style scoped lang="scss" src="./index.scss"></style>
