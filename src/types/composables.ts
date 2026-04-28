/**
 * Composables 相关类型定义
 */

/** 分页配置选项 */
export interface IUsePaginationOptions {
  pageSize?: number
  total?: number
}

/** 加载状态配置选项 */
export interface IUseLoadingOptions {
  initialState?: boolean
}