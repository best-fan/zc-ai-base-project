/**
 * 本地存储工具
 */

const PREFIX = 'zc_kpi_'

export const storage = {
  /**
   * 获取存储数据
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  /**
   * 设置存储数据
   */
  set(key: string, value: unknown): void {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  /**
   * 移除存储数据
   */
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },

  /**
   * 清空所有存储
   */
  clear(): void {
    localStorage.clear()
  },
}

export default storage
