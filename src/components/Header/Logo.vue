<template>
  <span class="header-logo">
    <img class="logo" src="@/assets/images/index/logo.png" alt="">
    <span class="header-logo__text">众诚</span>
    <img class="ai" src="@/assets/images/index/ai.png" alt="">
    <span class="header-logo__text">经营助手</span>
    <div class="line" />
  </span>
</template>

<script setup lang="ts">
/**
 * Logo 子组件
 */
defineOptions({ name: 'HeaderLogo' })
</script>

<style scoped lang="scss">
.header-logo {
  display: flex;
  align-items: center;
  gap: 4px;

  .logo {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }

  .ai {
    width: 15.4px;
    height: 12.29px;
  }

  .line {
    width: 1px;
    height: 10px;
    background: #C4C9CF;
    margin: 0 16px;
  }

  &__text {
    font-size: 14px;
    font-weight: bold;
    line-height: 22px;
    color: #1b2129;
    font-family: 'Source Han Sans CN', '思源黑体', sans-serif;
  }
}
</style>