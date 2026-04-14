/**
 * 加载状态组合式函数
 */
import { ref } from 'vue'

/** 加载状态配置选项 */
interface IUseLoadingOptions {
  initialState?: boolean
}

export function useLoading(options: IUseLoadingOptions = {}) {
  const { initialState = false } = options

  const loading = ref(initialState)

  const startLoading = () => {
    loading.value = true
  }

  const stopLoading = () => {
    loading.value = false
  }

  const setLoading = (value: boolean) => {
    loading.value = value
  }

  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    startLoading()
    try {
      return await fn()
    } finally {
      stopLoading()
    }
  }

  return {
    loading,
    startLoading,
    stopLoading,
    setLoading,
    withLoading,
  }
}