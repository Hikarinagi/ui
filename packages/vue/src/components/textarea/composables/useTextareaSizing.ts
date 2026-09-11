import { computed, nextTick, onMounted, shallowRef, watch, type Ref } from 'vue'
import { caretTop } from '../../../lib/caret'
import type { TextareaVariants } from '../textarea.variants'

interface TextareaSizingProps {
  autosize?: boolean | { minRows?: number; maxRows?: number }
  rows: number
  size?: TextareaVariants['size']
  variant?: TextareaVariants['variant']
}

export function useTextareaSizing(props: TextareaSizingProps, model: Ref<string | undefined>) {
  const el = shallowRef<HTMLTextAreaElement | null>(null)
  const area = shallowRef<{ viewport?: HTMLElement }>()

  const bounds = computed(() => {
    const options = props.autosize === true ? {} : props.autosize || null
    return { min: options?.minRows ?? props.rows, max: options?.maxRows }
  })

  function fit() {
    const node = el.value
    if (!node) return
    node.style.height = 'auto'
    node.style.height = `${node.scrollHeight}px`
    if (document.activeElement === node) reveal(node)
  }

  function reveal(node: HTMLTextAreaElement) {
    const scroller =
      area.value?.viewport ?? node.closest<HTMLElement>('[data-overlayscrollbars-initialize]')
    if (!scroller) return
    const box = scroller.getBoundingClientRect()
    const top = node.getBoundingClientRect().top + caretTop(node)
    const bottom = top + parseFloat(getComputedStyle(node).lineHeight)
    if (bottom > box.bottom) scroller.scrollTop += bottom - box.bottom
    else if (top < box.top) scroller.scrollTop -= box.top - top
  }

  function focus(event: MouseEvent) {
    const node = el.value
    if (!node || node.disabled || event.target === node) return
    node.focus()
    node.setSelectionRange(node.value.length, node.value.length)
  }

  onMounted(fit)
  watch(
    () => [model.value, props.size, props.variant, bounds.value.min],
    () => void nextTick(fit),
  )

  return { el, area, bounds, fit, focus }
}
