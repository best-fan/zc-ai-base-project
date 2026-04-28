/**
 * 用户相关类型定义
 */

/** 用户信息 */
export interface IUserInfo {
  userBo: IUser
  mainDept: IDepartment
  menuTreeBoList: IMenu[]
  roleList: IRole[]
  otherDeptList: IDepartment[]
  menuKeys: Set<string>
}

/** 用户基本信息 */
export interface IUser {
  id: string
  account: string
  realName: string
  nickName: string
  basicId: string
  birthday: string
  description: string
  telephone: string
  dingtalkPhone: string
  education: string
  email: string
  firstLoginTime: string
  gender: number
  headIcon: string
  lastLoginIp: string
}

/** 菜单 */
export interface IMenu {
  id: string
  hasChildren: boolean
  icon: string
  pid: string
  label: string
  parentId: string
  enCode: string
  path: string
  menuType: string
  children?: IMenu[]
}

/** 角色 */
export interface IRole {
  roleId: string
  roleCode: string
  roleName: string
  userId: string
}

/** 部门 */
export interface IDepartment {
  id?: string
  deptId: string
  deptName: string
  mainFlag?: number
  orgId?: string
  orgName?: string
  orgTypeCode?: string
  orgTypeName?: string
  sortNum?: string
  userId?: string
}

/** 角色类型 */
export type TRoleType = '' | '*' | 'admin' | 'user'
