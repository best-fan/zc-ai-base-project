/**
 * Token 认证工具函数
 */
import type { ITokenInfo } from '@/types'

let TOKEN_KEY = localStorage.getItem('tokenName') || 'token'

/** 检查是否已登录 */
export const isLogin = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY)
  return !!token && token !== 'undefined'
}

/** 获取 Token */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

/** 设置 Token */
export const setToken = (token: ITokenInfo): void => {
  TOKEN_KEY = token.tokenName
  localStorage.setItem(TOKEN_KEY, token.tokenValue)
  localStorage.setItem('tokenName', token.tokenName)
}

/** 清除 Token */
export const clearToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem('tokenName')
}