import { tv } from '../../lib/tv'

export const formFieldRoot = tv({
  base: 'min-w-0',
  variants: {
    orientation: {
      vertical: '',
      horizontal: '',
      responsive: '@container/hn-form-field',
    },
  },
})

export const formFieldLayout = tv({
  base: 'grid min-w-0 grid-cols-1 items-start gap-x-6 gap-y-1.5',
  variants: {
    orientation: {
      vertical: '',
      horizontal: 'grid-cols-[var(--hn-form-label-width)_minmax(0,1fr)]',
      responsive: '@min-[32rem]/hn-form-field:grid-cols-[var(--hn-form-label-width)_minmax(0,1fr)]',
    },
  },
})

export const formFieldContent = tv({
  base: 'flex min-w-0 flex-col gap-1.5',
})

export const formFieldControl = tv({
  base: 'min-w-0',
  variants: {
    orientation: {
      vertical: '',
      horizontal: 'grid min-h-[var(--hn-control-h-md)] items-center',
      responsive:
        '@min-[32rem]/hn-form-field:grid @min-[32rem]/hn-form-field:min-h-[var(--hn-control-h-md)] @min-[32rem]/hn-form-field:items-center',
    },
  },
})

export const formFieldLabel = tv({
  base: 'text-fg inline-flex items-center gap-1 text-sm font-medium',
  variants: {
    orientation: {
      vertical: '',
      horizontal: 'min-h-[var(--hn-control-h-md)]',
      responsive: '@min-[32rem]/hn-form-field:min-h-[var(--hn-control-h-md)]',
    },
    disabled: {
      true: 'text-disabled',
    },
  },
})

export const formFieldMark = tv({
  base: 'text-danger-text',
})

export const formFieldDescription = tv({
  base: 'text-muted text-sm',
})

export const formFieldMessage = tv({
  base: 'text-danger-text text-sm',
})
