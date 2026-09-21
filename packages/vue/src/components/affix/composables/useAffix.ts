import { computed, onBeforeUnmount, onMounted, onUpdated, shallowRef, watch } from 'vue'
import type { AffixProps } from '../types'

export function useAffix(props: AffixProps, onChange: (affixed: boolean) => void) {
  const element = shallowRef<HTMLElement>()
  const affixed = shallowRef(false)
  const offset = computed(() => (Number.isFinite(props.offset) ? props.offset! : 0))
  let mounted = false
  let frame = 0
  let cleanup: (() => void) | undefined
  let scrollport: HTMLElement | undefined

  function findScrollport(el: HTMLElement) {
    const view = el.ownerDocument.defaultView!
    let parent = el.parentElement
    while (
      parent &&
      parent !== el.ownerDocument.documentElement &&
      parent !== el.ownerDocument.body
    ) {
      if (/^(auto|scroll|hidden|overlay)$/.test(view.getComputedStyle(parent).overflowY))
        return parent
      parent = parent.parentElement
    }
    return undefined
  }

  function setAffixed(value: boolean) {
    if (value === affixed.value) return
    affixed.value = value
    onChange(value)
  }

  function measure() {
    frame = 0
    const el = element.value
    const view = el?.ownerDocument.defaultView
    if (!el || !view || props.disabled || !el.getClientRects().length) {
      setAffixed(false)
      return
    }
    if (findScrollport(el) !== scrollport) {
      connect()
      return
    }
    const box = el.getBoundingClientRect()
    const port = scrollport?.getBoundingClientRect()
    const scale = scrollport?.offsetHeight ? port!.height / scrollport.offsetHeight : 1
    const top = port ? port.top + scrollport!.clientTop * scale : 0
    const height = scrollport
      ? scrollport.clientHeight * scale
      : el.ownerDocument.documentElement.clientHeight
    const edge =
      props.position === 'bottom' ? top + height - offset.value * scale : top + offset.value * scale
    const actual = props.position === 'bottom' ? box.bottom : box.top
    setAffixed(
      box.width > 0 &&
        box.height > 0 &&
        height > 0 &&
        view.getComputedStyle(el).position === 'sticky' &&
        Math.abs(actual - edge) < 1,
    )
  }

  function update() {
    const view = element.value?.ownerDocument.defaultView
    if (mounted && view && !frame) frame = view.requestAnimationFrame(measure)
  }

  function connect() {
    cleanup?.()
    cleanup = undefined
    scrollport = undefined
    const el = element.value
    const view = el?.ownerDocument.defaultView
    if (!mounted || !el || !view) return
    if (props.disabled) {
      setAffixed(false)
      return
    }
    scrollport = findScrollport(el)
    const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(update)
    resize?.observe(el)
    if (el.parentElement) resize?.observe(el.parentElement)
    if (scrollport && scrollport !== el.parentElement) resize?.observe(scrollport)
    const margin = `${-(Math.max(0, offset.value) + 1)}px`
    const intersection =
      typeof IntersectionObserver === 'undefined'
        ? undefined
        : new IntersectionObserver(update, {
            root: scrollport ?? null,
            rootMargin:
              props.position === 'bottom' ? `0px 0px ${margin} 0px` : `${margin} 0px 0px 0px`,
            threshold: [0, 1],
          })
    intersection?.observe(el)
    const onScroll = (event: Event) => {
      if (
        event.target === el.ownerDocument ||
        (event.target instanceof Element && event.target.contains(el))
      )
        update()
    }
    el.ownerDocument.addEventListener('scroll', onScroll, { passive: true, capture: true })
    view.addEventListener('resize', update, { passive: true })
    cleanup = () => {
      el.ownerDocument.removeEventListener('scroll', onScroll, true)
      view.removeEventListener('resize', update)
      resize?.disconnect()
      intersection?.disconnect()
    }
    update()
  }

  onMounted(() => {
    mounted = true
    connect()
  })
  watch(() => [props.position, offset.value, props.disabled, props.as], connect, { flush: 'post' })
  onUpdated(update)
  onBeforeUnmount(() => {
    mounted = false
    cleanup?.()
    if (frame) element.value?.ownerDocument.defaultView?.cancelAnimationFrame(frame)
  })
  return { element, affixed, offset, update }
}
