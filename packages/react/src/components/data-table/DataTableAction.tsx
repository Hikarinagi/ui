import clsx from 'clsx'
import type { ButtonHTMLAttributes, Ref } from 'react'
import { Spinner } from '../spinner/Spinner'

export interface DataTableActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
  loading?: boolean
  ref?: Ref<HTMLButtonElement>
  [attribute: `data-${string}`]: string | undefined
}

export function DataTableAction({
  disabled,
  loading,
  className,
  children,
  ...attrs
}: DataTableActionProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...attrs}
      className={clsx('hn-table-action hn-focus-ring', className)}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}
