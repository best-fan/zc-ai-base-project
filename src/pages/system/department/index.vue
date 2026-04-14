<template>
  <div class="system-department">
    <SystemDepartment />
  </div>
</template>

<script setup lang="ts">
/**
 * 部门管理页面
 * 使用 @zcui/system 提供的 SystemDepartment 组件
 */
import { SystemDepartment } from '@zcui/system'

defineOptions({ name: 'SystemDepartment' })
</script>

<style scoped lang="scss">
.system-department {
  height: 100%;

  :deep(.arco-card-body .arco-row .col-buttons) {
    display: none;
  }

  :deep(.arco-card-body .arco-row .card-row-col__right) {
    width: 100%;
    flex: 0;
  }

  :deep(.arco-card-body .arco-table-col-fixed-right) {
    display: none;
  }

  :deep(.arco-table-element colgroup col:last-child) {
    display: none;

  }
}
</style>