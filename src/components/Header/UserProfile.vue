<template>
  <a-dropdown v-model:popup-visible="dropdownVisible" trigger="click">
    <div class="user-profile">
      <a-avatar :size="24" class="user-profile__avatar">
        <img v-if="userStore.userBo.headIcon" :src="userStore.userBo.headIcon" alt="用户头像">
        <span v-else>{{ avatarText }}</span>
      </a-avatar>
      <div class="user-profile__info">
        <span class="user-profile__name">{{ userStore.userBo.realName || '用户' }}</span>
        <span class="user-profile__role">{{ userStore.mainDept?.deptName || '' }}</span>
      </div>
      <icon-caret-up v-if="dropdownVisible" class="user-profile__arrow" />
      <icon-caret-down v-else class="user-profile__arrow" />
    </div>
    <template #content>
      <a-doption @click="handleLogout">
        <template #icon>
          <icon-export />
        </template>
        退出登录
      </a-doption>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
/**
 * 用户信息子组件
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store'

defineOptions({ name: 'UserProfile' })

const router = useRouter()
const userStore = useUserStore()

const dropdownVisible = ref(false)

// 头像文字（无头像时显示用户名首字）
const avatarText = computed(() => {
  const name = userStore.userBo.realName || userStore.userBo.nickName || 'U'
  return name.charAt(0).toUpperCase()
})

// 退出登录
const handleLogout = async (): Promise<void> => {
  dropdownVisible.value = false;
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &__avatar {
    flex-shrink: 0;
    background-color: #165dff;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.3);
  }

  &__info {
    display: flex;
    flex-direction: column;
    margin-left: 8px;
  }

  &__name {
    font-size: 14px;
    font-weight: 400;
    color: #1b2129;
    line-height: 1.2;
  }

  &__role {
    font-size: 12px;
    font-weight: 400;
    color: #8b949e;
    line-height: 1.2;
  }

  &__arrow {
    font-size: 12px;
    color: #86909c;
    margin-left: 4px;
  }
}
</style>