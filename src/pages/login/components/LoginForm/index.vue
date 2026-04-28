<template>
  <div class="login-form-wrapper">
    <Verify
      ref="verifyRef"
      :captcha-type="'blockPuzzle'"
      :img-size="{ width: '362px', height: '140px' }"
      @verify-success="handleLogin"
      @stop-loading="setLoading(false)"
    />
    <div class="login-form-welcome">{{ form.login.welcome }}</div>
    <div class="login-form-sub-title">{{ form.login.subTitle }}</div>
    <div class="login-form-title">{{ form.login.title }}</div>
    <a-form
      ref="loginForm"
      size="large"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        field="account"
        :rules="[{ required: true, message: form.login.account.errMsg }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model.trim="userInfo.account"
          :placeholder="form.login.account.placeholder"
        >
          <template #prefix>
            <IconUser />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: form.login.password.errMsg }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model.trim="userInfo.password"
          :placeholder="form.login.password.placeholder"
        >
          <template #prefix>
            <IconLock />
          </template>
        </a-input-password>
      </a-form-item>

      <div class="login-form-remember">
        <a-checkbox :model-value="form.login.rememberMe === '1'" @change="setRememberPassword">
          {{ form.login.rememberPassword }}
        </a-checkbox>
        <a-link v-if="false">{{ form.login.forgetPassword }}</a-link>
      </div>

      <a-button type="primary" html-type="submit" long :loading="loading" size="large">
        {{ form.login.loginBtnName }}
      </a-button>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import type { ValidatedError } from '@arco-design/web-vue/es/form/interface'
import { IconUser, IconLock } from '@arco-design/web-vue/es/icon'
import { useLoading } from '@/composables'
import { useUserStore } from '@/store'
import { md5 } from '@/utils/crypto'
import { Verify } from '@/components'
import type { ILoginReqData } from '@/types'

defineOptions({ name: 'LoginForm' })

const form = {
  login: {
    welcome: '欢迎登录',
    subTitle: '—  welcome to login  —',
    title: import.meta.env.VITE_APP_TITLE,
    account: {
      placeholder: '请输入用户名',
      errMsg: '请输入用户名',
    },
    password: {
      placeholder: '请输入密码',
      errMsg: '请输入密码',
    },
    rememberPassword: '记住密码',
    forgetPassword: '忘记密码',
    loginBtnName: '登录',
    loginSuccessMsg: '登录成功',
    rememberMe: '0',
  },
}

const userInfo = reactive({
  account: '',
  password: '',
})

const router = useRouter()
const userStore = useUserStore()
const verifyRef = ref<InstanceType<typeof Verify>>()

const { loading, setLoading } = useLoading()

const setRememberPassword = (value: boolean): void => {
  form.login.rememberMe = value ? '1' : '0'
}

/** 表单提交 */
const handleSubmit = async ({
  errors,
}: {
  errors: Record<string, ValidatedError> | undefined
  values: Record<string, unknown>
}): Promise<void> => {
  if (loading.value) return
  if (!errors) {
    setLoading(true)
    verifyRef.value?.show()
  }
}

/** 处理登录 */
const handleLogin = async (captchaVerification: string): Promise<void> => {
  try {
    const data: ILoginReqData = {
      account: userInfo.account,
      password: md5(userInfo.password),
      captchaVerification,
      rememberMe: form.login.rememberMe,
      orgId: '1',
    }

    await userStore.login(data)
    const { redirect } = router.currentRoute.value.query
    router.push(redirect ? decodeURIComponent(redirect as string) : { name: 'Home' })
    Message.success(form.login.loginSuccessMsg)
  } catch (err) {
    Message.error((err as Error).message || '登录失败')
  } finally {
    setLoading(false)
  }
}
</script>

<style lang="scss" scoped src="./index.scss"></style>