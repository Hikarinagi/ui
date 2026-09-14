import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { PaginationState } from './types'

export interface PaginationContext {
  state: Readonly<Ref<PaginationState>>
  blocked: Readonly<Ref<boolean>>
  size: Readonly<Ref<'sm' | 'md' | 'lg'>>
  direction: Readonly<Ref<'ltr' | 'rtl'>>
  siblingCount: Readonly<Ref<number>>
  showFirstLast: Readonly<Ref<boolean>>
  options: Readonly<Ref<Array<{ value: number; label: string }>>>
  update: (page: number) => void
  resize: (pageSize: number) => void
}

const key: InjectionKey<PaginationContext> = Symbol('HnPagination')

export const providePagination = (context: PaginationContext) => provide(key, context)
export function usePaginationContext() {
  const context = inject(key)
  if (!context) throw new Error('Pagination parts require a Pagination parent')
  return context
}
