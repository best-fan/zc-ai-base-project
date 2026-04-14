<template>
  <div class="system-role">
    <SystemRole />
  </div>
</template>

<script setup lang="ts">
/**
 * 角色管理页面
 * 使用 @zcui/system 提供的 SystemRole 组件
 */
import { SystemRole } from '@zcui/system'

defineOptions({ name: 'SystemRole' })
</script>

<style scoped lang="scss">
.system-role {
  height: 100%;
}
</style>