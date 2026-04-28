/**
 * 用户相关 API 类型定义
 */

/** 登录请求参数 */
export interface ILoginReqData {
  account: string
  password: string
  orgId: string
  captchaVerification: string
  rememberMe: string
}

/** Token 信息 */
export interface ITokenInfo {
  tokenName: string
  tokenValue: string
}

/** 登录响应 */
export interface ILoginRes {
  tokenInfo: ITokenInfo
}

/** 组织机构请求参数 */
export interface IOrgReqData {
  account: string
  captchaVerification: string
  orgId: string
  password: string
  rememberMe: string
}

/** 组织机构 */
export interface IOrganization {
  deptName: string
  enableFlag: number
  fullName: string
  id: string
  lastLogin: boolean
  postName: string
  realName: string
  shortName: string
  sortNum: string
  userId: string
}

/** 组织机构列表 */
export type TOrgRecord = IOrganization[]
