/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

// @zcui/system 模块类型声明
declare module '@zcui/system' {
  import type { DefineComponent } from 'vue'
  
  export const SystemUser: DefineComponent
  export const SystemRole: DefineComponent
  export const SystemMenu: DefineComponent
  export const SystemDepartment: DefineComponent
  export const SystemDict: DefineComponent
  export const SystemTenant: DefineComponent
  
  const zcuiSys: unknown
  export default zcuiSys
}

/** 环境变量类型 */
interface ImportMetaEnv {
  /** API 基础地址 */
  readonly VITE_API_BASE_URL: string
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}