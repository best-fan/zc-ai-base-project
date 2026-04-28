/**
 * 通用 API 类型定义
 */

/** 统一 API 响应格式 */
export interface IApiResponse<T> {
  code: number
  data: T
  message: string
}
