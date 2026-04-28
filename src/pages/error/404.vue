<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <div class="error-title">页面不存在</div>
      <div class="error-desc">抱歉，您访问的页面不存在或已被移除</div>
      <a-button type="primary" @click="goHome"> 返回首页 </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'NotFound' })

const router = useRouter()

const goHome = (): void => {
  router.push({ name: 'Home' })
}
</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.error-content {
  text-align: center;
  color: #fff;
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 16px;
}

.error-desc {
  font-size: 16px;
  opacity: 0.8;
  margin-bottom: 32px;
}
</style>
