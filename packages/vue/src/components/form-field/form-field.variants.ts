import { tv } from '../../lib/tv'

export const formFieldRoot = tv({
  base: 'flex min-w-0 flex-col gap-1.5',
})

export const formFieldLabel = tv({
  base: 'text-fg inline-flex items-center gap-1 text-sm font-medium',
  variants: {
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
