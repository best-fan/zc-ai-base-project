<template>
  <div class="empty-layout">
    <router-view :key="route.fullPath" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

defineOptions({ name: 'EmptyLayout' })

const route = useRoute()
</script>

<style scoped lang="scss">
.empty-layout {
  min-height: 100vh;
  height: 100%;
}
</style>