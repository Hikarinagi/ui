import type { Ref, TdHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { tableCell, type TableCellVariants } from './table.variants'

export interface TableCellProps extends Omit<TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: TableCellVariants['align']
  sticky?: boolean
  ref?: Ref<HTMLTableCellElement>
}

export function TableCell({ align, sticky = false, className, ...props }: TableCellProps) {
  return <td {...props} className={cn(tableCell({ align, sticky }), className)} />
}
