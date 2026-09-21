import { tv } from '../lib/tv'

export const editable = tv({
  base: 'flex w-full min-w-0 flex-col gap-2 text-fg',
  variants: {
    size: {
      sm: 'text-sm [--hn-editable-h:var(--hn-control-h-sm)] [--hn-editable-px:var(--hn-control-px-sm)]',
      md: 'text-base [--hn-editable-h:var(--hn-control-h-md)] [--hn-editable-px:var(--hn-control-px-md)]',
      lg: 'text-md [--hn-editable-h:var(--hn-control-h-lg)] [--hn-editable-px:var(--hn-control-px-lg)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export const editablePreview = tv({
  base: [
    'relative flex min-h-(--hn-editable-h) w-full min-w-0 items-center gap-3 rounded-md border border-transparent px-(--hn-editable-px) py-[calc((var(--hn-editable-h)-1lh)/2-1px)] text-start [font:inherit]',
    'data-disabled:cursor-not-allowed data-disabled:opacity-50',
    'data-invalid:border-danger',
  ],
  variants: { interactive: { true: 'hn-focus-ring hn-state-layer cursor-pointer outline-none' } },
})

export const editablePreviewText = tv({
  base: 'min-w-0 flex-1 data-empty:text-faint',
  variants: { multiline: { true: 'whitespace-pre-wrap break-words', false: 'truncate' } },
})

export const editableInput = tv({
  base: [
    'hn-field block h-(--hn-editable-h) w-full min-w-0 rounded-md border border-line px-(--hn-editable-px) py-[calc((var(--hn-editable-h)-1lh)/2-1px)] outline-none [font:inherit]',
    '[--hn-field-bg:var(--hn-surface)] [--hn-field-shadow:var(--hn-shadow-sm)]',
    'placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50',
  ],
})

export const editableActions = tv({ base: 'flex min-w-0 items-center justify-end gap-1' })
export const editableError = tv({ base: 'px-(--hn-editable-px) text-sm text-danger-text' })
