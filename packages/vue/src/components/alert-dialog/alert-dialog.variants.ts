import { tv } from '../../lib/tv'

export const alertDialogHeader = tv({
  base: 'flex min-w-0 flex-col gap-1.5 px-(--hn-panel-p)',
})

export const alertDialogContent = tv({
  base: 'px-(--hn-panel-p)',
})

export const alertDialogActions = tv({
  base: 'flex justify-end gap-(--hn-inline-gap) px-(--hn-panel-p)',
})
