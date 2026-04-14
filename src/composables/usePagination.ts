/**
 * 分页组合式函数
 */
import { ref, computed } from 'vue'

/** 分页配置选项 */
interface IUsePaginationOptions {
  pageSize?: number
  total?: number
}

export function usePagination(options: IUsePaginationOptions = {}) {
  const { pageSize = 10, total = 0 } = options

  const currentPage = ref(1)
  const currentPageSize = ref(pageSize)
  const totalItems = ref(total)

  const totalPages = computed(() => Math.ceil(totalItems.value / currentPageSize.value))

  const offset = computed(() => (currentPage.value - 1) * currentPageSize.value)

  const hasNext = computed(() => currentPage.value < totalPages.value)
  const hasPrev = computed(() => currentPage.value > 1)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNext.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrev.value) {
      currentPage.value--
    }
  }

  const setTotal = (newTotal: number) => {
    totalItems.value = newTotal
  }

  const reset = () => {
    currentPage.value = 1
  }

  return {
    currentPage,
    currentPageSize,
    totalItems,
    totalPages,
    offset,
    hasNext,
    hasPrev,
    goToPage,
    nextPage,
    prevPage,
    setTotal,
    reset,
  }
}