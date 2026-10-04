'use client'

import { useCallback, useLayoutEffect, useRef, type MouseEvent, type RefObject } from 'react'
import { caretTop } from '../../../../../shared/src/lib/caret'
import type { ScrollAreaHandle } from '../../scroll-area/ScrollArea'
import type { TextareaVariants } from '../textarea.variants'

interface TextareaSizingProps {
  autosize?: boolean | { minRows?: number; maxRows?: number }
  rows: number
  size?: TextareaVariants['size']
  variant?: TextareaVariants['variant']
}

export function useTextareaSizing(
  props: TextareaSizingProps,
  model: string | undefined,
  el: RefObject<HTMLTextAreaElement | null>,
) {
  const area = useRef<ScrollAreaHandle | null>(null)

  const options = props.autosize === true ? {} : props.autosize || null
  const bounds = { min: options?.minRows ?? props.rows, max: options?.maxRows }

  const reveal = useCallback((node: HTMLTextAreaElement) => {
    const scroller =
      area.current?.viewport ?? node.closest<HTMLElement>('[data-overlayscrollbars-initialize]')
    if (!scroller) return
    const box = scroller.getBoundingClientRect()
    const top = node.getBoundingClientRect().top + caretTop(node)
    const bottom = top + parseFloat(getComputedStyle(node).lineHeight)
    if (bottom > box.bottom) scroller.scrollTop += bottom - box.bottom
    else if (top < box.top) scroller.scrollTop -= box.top - top
  }, [])

  const fit = useCallback(() => {
    const node = el.current
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
    if (document.activeElement === node) reveal(node)
  }, [el, reveal])

  const focus = useCallback(
    (event: MouseEvent) => {
      const node = el.current
      if (!node || node.disabled || event.target === node) return
      node.focus()
      node.setSelectionRange(node.value.length, node.value.length)
    },
    [el],
  )

  useLayoutEffect(fit, [fit, model, props.size, props.variant, bounds.min])

  return { area, bounds, fit, focus }
}
