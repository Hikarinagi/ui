export interface PaginationChange {
  page: number
  pageSize: number
}

export interface PaginationState extends PaginationChange {
  total: number
  pageCount: number
  from: number
  to: number
}

export type PaginationEntry = { type: 'page'; value: number } | { type: 'ellipsis' }
export type PaginationSide = 'prev' | 'next'
export interface PaginationRange {
  side: PaginationSide
  from: number
  to: number
}
