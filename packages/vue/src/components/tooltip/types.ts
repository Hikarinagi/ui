export interface TooltipProps {
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  open?: boolean
  disabled?: boolean
  class?: string
}

export type TooltipDirectiveOptions = Omit<TooltipProps, 'open' | 'content'> & {
  content: string
}

export type TooltipDirectiveValue = string | TooltipDirectiveOptions | null | undefined | false
