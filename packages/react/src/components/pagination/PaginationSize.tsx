'use client'

import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { Select, type SelectProps } from '../select/Select'
import { usePaginationContext } from './context'

export interface PaginationSizeProps extends Omit<
  SelectProps,
  'options' | 'value' | 'defaultValue' | 'onValueChange' | 'renderOption' | 'renderValue'
> {}

export function PaginationSize({ className, ...attrs }: PaginationSizeProps) {
  const { state, options, size, blocked, resize, direction } = usePaginationContext()
  const t = useUiLocale()
  return (
    <Select
      value={state.pageSize}
      onValueChange={value => {
        if (value != null) resize(Number(value))
      }}
      options={options}
      size={size}
      disabled={blocked}
      aria-label={t.pagination.pageSizeLabel}
      dir={direction}
      data-hn-pagination-size=""
      {...attrs}
      className={cn('w-auto shrink-0 whitespace-nowrap', className)}
    />
  )
}
