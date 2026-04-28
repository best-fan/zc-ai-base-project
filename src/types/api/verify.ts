/**
 * 验证码相关 API 类型定义
 */

/** 获取验证码请求参数 */
export interface IGetCaptchaReqData {
  captchaType: string
  clientUid: string
  ts: number
}

/** 获取验证码响应数据 */
export interface IGetCaptchaResData {
  originalImageBase64: string
  jigsawImageBase64: string
  token: string
  secretKey: string
}

/** 获取验证码响应 */
export interface IGetCaptchaRes {
  repCode: string
  repData: IGetCaptchaResData
  repMsg: string | null
  success: boolean
}

/** 校验验证码请求参数 */
export interface ICheckCaptchaReqData {
  captchaType: string
  pointJson: string
  token: string
}

/** 校验验证码响应数据 */
export interface ICheckCaptchaResData {
  result: boolean
  token: string
  pointJson: string
  captchaType: string
}

/** 校验验证码响应 */
export interface ICheckCaptchaRes {
  repCode: string
  repData: ICheckCaptchaResData
  repMsg: string | null
  success: boolean
}
