export type PaginationItems = Array<{ type: 'ellipsis' } | { type: 'page'; value: number }>

function range(start: number, end: number) {
  const length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

export function transform(items: (string | number)[]): PaginationItems {
  return items.map(value => {
    if (typeof value === 'number') return { type: 'page', value }
    return { type: 'ellipsis' }
  })
}

const ELLIPSIS = 'ellipsis'

export function getRange(
  currentPage: number,
  pageCount: number,
  siblingCount: number,
  showEdges: boolean,
) {
  const firstPageIndex = 1
  const lastPageIndex = pageCount

  const leftSiblingIndex = Math.max(currentPage - siblingCount, firstPageIndex)
  const rightSiblingIndex = Math.min(currentPage + siblingCount, lastPageIndex)

  if (showEdges) {
    const totalPageNumbers = Math.min(2 * siblingCount + 5, pageCount)

    const itemCount = totalPageNumbers - 2

    const showLeftEllipsis =
      leftSiblingIndex > firstPageIndex + 2 &&
      Math.abs(lastPageIndex - itemCount - firstPageIndex + 1) > 2 &&
      Math.abs(leftSiblingIndex - firstPageIndex) > 2

    const showRightEllipsis =
      rightSiblingIndex < lastPageIndex - 2 &&
      Math.abs(lastPageIndex - itemCount) > 2 &&
      Math.abs(lastPageIndex - rightSiblingIndex) > 2

    if (!showLeftEllipsis && showRightEllipsis) {
      const leftRange = range(1, itemCount)

      return [...leftRange, ELLIPSIS, lastPageIndex]
    }

    if (showLeftEllipsis && !showRightEllipsis) {
      const rightRange = range(lastPageIndex - itemCount + 1, lastPageIndex)

      return [firstPageIndex, ELLIPSIS, ...rightRange]
    }

    if (showLeftEllipsis && showRightEllipsis) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex)

      return [firstPageIndex, ELLIPSIS, ...middleRange, ELLIPSIS, lastPageIndex]
    }

    const fullRange = range(firstPageIndex, lastPageIndex)
    return fullRange
  } else {
    const itemCount = siblingCount * 2 + 1

    if (pageCount < itemCount) return range(1, lastPageIndex)
    else if (currentPage <= siblingCount + 1) return range(firstPageIndex, itemCount)
    else if (pageCount - currentPage <= siblingCount)
      return range(pageCount - itemCount + 1, lastPageIndex)
    else return range(leftSiblingIndex, rightSiblingIndex)
  }
}

export type PaginationEdge = 'first' | 'prev' | 'next' | 'last'

export function paginationPageCount(total: number, itemsPerPage: number) {
  return Math.max(1, Math.ceil(total / (itemsPerPage || 1)))
}

export function paginationEdgeDisabled(
  edge: PaginationEdge,
  page: number,
  pageCount: number,
  disabled: boolean,
) {
  return (edge === 'first' || edge === 'prev' ? page === 1 : page === pageCount) || disabled
}

export function paginationEdgeTarget(edge: PaginationEdge, page: number, pageCount: number) {
  return edge === 'first' ? 1 : edge === 'prev' ? page - 1 : edge === 'next' ? page + 1 : pageCount
}

export const PAGINATION_EDGES: Record<PaginationEdge, { label: string; fallback: string }> = {
  first: { label: 'First Page', fallback: 'First page' },
  prev: { label: 'Previous Page', fallback: 'Prev page' },
  next: { label: 'Next Page', fallback: 'Next page' },
  last: { label: 'Last Page', fallback: 'Last page' },
}
