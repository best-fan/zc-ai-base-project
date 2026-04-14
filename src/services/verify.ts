/**
 * 验证码相关 API
 */
import { http } from './request'
import type {
  IGetCaptchaReqData,
  IGetCaptchaRes,
  ICheckCaptchaReqData,
  ICheckCaptchaRes,
} from '@/types'

/** 获取验证码 */
export function getCaptcha(data: IGetCaptchaReqData) {
  return http.post<IGetCaptchaRes>('/base/captcha/get', data)
}

/** 校验验证码 */
export function checkCaptcha(data: ICheckCaptchaReqData) {
  return http.post<ICheckCaptchaRes>('/base/captcha/check', data)
}
