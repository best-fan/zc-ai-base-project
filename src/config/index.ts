/**
 * 项目配置
 */

/** 应用标题 */
export const APP_TITLE = '通用基础工程项目'

/** API 基础地址 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/** Token 存储键名 */
export const TOKEN_KEY = 'token'

/** 用户信息存储键名 */
export const USER_INFO_KEY = 'user_info'

/** 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT = 10000

/** 分页默认配置 */
export const PAGINATION = {
  pageSize: 10,
  pageSizeOptions: ['10', '20', '50', '100'],
} as const
