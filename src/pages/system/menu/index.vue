<template>
  <div class="system-menu">
    <SystemMenu />
  </div>
</template>

<script setup lang="ts">
/**
 * 菜单管理页面
 * 使用 @zcui/system 提供的 SystemMenu 组件
 */
import { SystemMenu } from '@zcui/system'

defineOptions({ name: 'SystemMenu' })
</script>

<style scoped lang="scss">
.system-menu {
  height: 100%;
}
</style>
