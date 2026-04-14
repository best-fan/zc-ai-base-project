<template>
  <div>
    <div class="container">
      <div class="logo">
        <img width="162px" height="29px" src="@/assets/logo.webp" alt="" draggable="false">
      </div>

      <div class="content">
        <div class="content-left">
          <img width="100%" height="auto" src="@/assets/login-left.webp" draggable="false" alt="">
        </div>
        <div class="content-right">
          <LoginForm />
        </div>
      </div>

      <div class="footer">
        <LoginFooter />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from './components/LoginForm/index.vue'
import LoginFooter from './components/Footer/index.vue'

defineOptions({ name: 'LoginPage' })
</script>

<style lang="scss" scoped src="./index.scss"></style>