import type { ReactNode } from 'react'

export function hasContent(node: ReactNode) {
  return node !== undefined && node !== null && node !== false && node !== true
}
