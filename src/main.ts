import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import ArcoVue from '@arco-design/web-vue'
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import '@arco-design/web-vue/dist/arco.css'
import zhCN from '@arco-design/web-vue/es/locale/lang/zh-cn'
import zcuiComp from '@zcui/components';

import App from './App.vue'
import router from './router'
// 初始化全局 axios（供 @zcui/system 等第三方库使用）
import './services/_vendorAxios' 
import './index.scss'

/**
 * 应用入口文件
 */

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(ArcoVue, { locale: zhCN })
app.use(ArcoVueIcon)
// @ts-ignore - zcuiComp 类型定义可能与 Vue 插件类型不完全匹配，但实际可用
app.use(zcuiComp)
app.mount('#root')
