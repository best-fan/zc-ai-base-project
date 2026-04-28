/**
 * 用户相关 API
 */
import { http } from './request'
import type { ILoginReqData, ILoginRes, IUserInfo, IApiResponse } from '@/types'

/** 用户登录 */
export function login(data: ILoginReqData) {
  return http.post<IApiResponse<ILoginRes>>('/base/login/withPwd', data)
}

/** 用户登出 */
export function logout() {
  return http.post<void>('/base/logout')
}

/** 获取用户信息 */
export function getUserInfo() {
  return http.get<IApiResponse<IUserInfo>>('/base/user/userInfo')
}
