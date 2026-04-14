/**
 * 全局 axios 配置初始化
 *
 * ⚠️ 警告：此文件仅供 @zcui/system 等第三方库使用
 * ⚠️ 项目内部请使用 request.ts 中的 http 或 request 实例
 *
 * 注意：@zcui/system 的请求 URL 已包含 /api 前缀，所以 baseURL 不应再包含 /api
 */
import axios from 'axios'
import type { AxiosError, AxiosResponse } from 'axios'
import { Message } from '@arco-design/web-vue'
import { getToken } from '@/utils/auth'

/**
 * 处理请求错误
 * @param error Axios 错误对象
 */
export const handleError = (error: AxiosError): void => {
  const response = error.response as AxiosResponse | undefined
  let message = '请求失败'

  if (response) {
    switch (response.status) {
      case 401:
        message = '未授权，请重新登录'
        break
      case 403:
        message = '拒绝访问'
        break
      case 404:
        message = '请求地址不存在'
        break
      case 500:
        message = '服务器内部错误'
        break
      default:
        message = response.data?.message || `请求错误: ${response.status}`
    }
  } else if (error.message.includes('timeout')) {
    message = '请求超时'
  } else if (error.message.includes('Network')) {
    message = '网络错误'
  }

  Message.error(message)
}

// 基础 URL（去除 /api 后缀，因为第三方库的请求 URL 已包含 /api 前缀）
const VENDOR_API_BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '')

// 全局 axios 配置
axios.defaults.baseURL = VENDOR_API_BASE_URL
axios.defaults.timeout = 10000
axios.defaults.headers.common['Content-Type'] = 'application/json'

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.token = token
    }
    return config
  },
  (error: AxiosError) => {
    handleError(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    handleError(error)
    return Promise.reject(error)
  }
)
