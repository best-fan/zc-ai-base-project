/**
 * Token 认证工具函数
 */
import type { ITokenInfo } from '@/types'

let tokenKey = localStorage.getItem('tokenName') || 'token'

/** 检查是否已登录 */
export const isLogin = (): boolean => {
  const token = localStorage.getItem(tokenKey)
  return !!token && token !== 'undefined'
}

/** 获取 Token */
export const getToken = (): string | null => {
  return localStorage.getItem(tokenKey)
}

/** 设置 Token */
export const setToken = (token: ITokenInfo): void => {
  tokenKey = token.tokenName
  localStorage.setItem(tokenKey, token.tokenValue)
  localStorage.setItem('tokenName', token.tokenName)
}

/** 清除 Token */
export const clearToken = (): void => {
  localStorage.removeItem(tokenKey)
  localStorage.removeItem('tokenName')
}
