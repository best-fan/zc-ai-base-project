<template>
  <div class="system-user">
    <SystemUser />
  </div>
</template>

<script setup lang="ts">
/**
 * 用户管理页面
 * 使用 @zcui/system 提供的 SystemUser 组件
 */
import { SystemUser } from '@zcui/system'

defineOptions({ name: 'SystemUser' })
</script>

<style scoped lang="scss">
.system-user {
  height: 100%;

  :deep(.arco-card-body .arco-row .col-buttons) {
    display: none;
  }

  :deep(.arco-card-body .arco-row .card-row-col__right) {
    width: 100%;
    flex: 0;
  }

  :deep(.arco-card-body .arco-row .card-row-col__right .user-operation-checkbox) {
    width: 150px;
  }

  :deep(.arco-card-body .arco-table-col-fixed-right .arco-table-td-content .arco-btn:first-child) {
    display: none;
  }
}
</style>