import type { Ref, ThHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { tableCell, type TableCellVariants } from './table.variants'

export interface TableHeadProps extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'align'> {
  scope?: 'col' | 'row' | 'colgroup' | 'rowgroup'
  align?: TableCellVariants['align']
  sticky?: boolean
  ref?: Ref<HTMLTableCellElement>
}

export function TableHead({
  scope = 'col',
  align,
  sticky = false,
  className,
  ...props
}: TableHeadProps) {
  return (
    <th
      {...props}
      scope={scope}
      className={cn(tableCell({ align, sticky, head: true }), className)}
    />
  )
}
