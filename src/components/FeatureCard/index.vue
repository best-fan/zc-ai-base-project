<template>
  <div class="feature-card" :style="cardStyle" @click="handleClick">
    <div class="feature-card__content">
      <h3 class="feature-card__title"><img :src="circleIcon" alt="">{{ title }}</h3>
      <p class="feature-card__desc">{{ description }}</p>
    </div>
    <div class="feature-card__icons">
      <img v-for="(name, index) in icon" :key="index" :src="getIconUrl(name)" alt="">
    </div>
    <div class="feature-card__footer">
      <button class="feature-card__btn" :style="buttonStyle">
        进入看板<img
          src="@/assets/images/index/arrow.png"
          alt=""
        >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 功能卡片组件
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { IFeatureCard } from '@/types'

defineOptions({ name: 'FeatureCard' })

const props = defineProps<IFeatureCard>()

const router = useRouter()

/** 动态获取图标 URL */
const getIconUrl = (name: string): string => {
  return new URL(`../../assets/images/index/${name}.png`, import.meta.url).href
}

/** 标题圆点图标 */
const circleIcon = new URL('../../assets/images/index/circle.png', import.meta.url).href

const cardStyle = computed(() => ({
  background: props.gradientBg,
}))

const buttonStyle = computed(() => ({
  backgroundColor: props.themeColor,
}))

const handleClick = (): void => {
  router.push(props.path)
}
</script>

<style scoped lang="scss" src="./index.scss"></style>