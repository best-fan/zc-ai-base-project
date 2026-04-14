/**
 * 功能卡片相关类型定义
 */

/** 功能卡片配置 */
export interface IFeatureCard {
  /** 卡片唯一标识 */
  id: string
  /** 卡片标题 */
  title: string
  /** 卡片描述 */
  description: string
  /** 主题色 */
  themeColor: string
  /** 渐变背景 */
  gradientBg: string
  /** 跳转路径 */
  path: string
  /** 图标名称 */
  icon: Array<string>
}