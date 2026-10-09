import type { Ref } from 'vue'
import { createContext } from '../utils/createContext'

export interface PaginationRootContext {
  page: Ref<number>
  onPageChange: (value: number) => void
  pageCount: Ref<number>
  siblingCount: Ref<number>
  disabled: Ref<boolean>
  showEdges: Ref<boolean>
}

export const [injectPaginationRootContext, providePaginationRootContext] =
  createContext<PaginationRootContext>('PaginationRoot')
