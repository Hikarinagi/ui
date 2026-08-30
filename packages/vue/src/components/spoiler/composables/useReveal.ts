import { computed, type Ref } from 'vue'
import { irisOrigin } from '../utils/irisOrigin'

export function useReveal(
  host: Ref<HTMLElement | null>,
  hidden: Ref<boolean>,
  revealOn: () => 'click' | 'hover',
) {
  function setOrigin(event?: MouseEvent) {
    const el = host.value
    if (!el) return
    if (!event || !hidden.value) return

    const origin = irisOrigin([...el.getClientRects()], event.clientX, event.clientY)
    if (!origin) {
      el.style.removeProperty('--hn-iris-x')
      el.style.removeProperty('--hn-iris-y')
      return
    }
    el.style.setProperty('--hn-iris-x', `${origin.x.toFixed(1)}%`)
    el.style.setProperty('--hn-iris-y', `${origin.y.toFixed(1)}%`)
  }

  function toggle(event?: MouseEvent) {
    setOrigin(event)
    hidden.value = !hidden.value
  }

  const handlers = computed(() => {
    if (revealOn() === 'hover') {
      return {
        mouseenter: (event: MouseEvent) => {
          setOrigin(event)
          hidden.value = false
        },
        mouseleave: () => (hidden.value = true),
        focus: () => (hidden.value = false),
        blur: () => (hidden.value = true),
      }
    }
    return {
      click: toggle,
      keydown: (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          toggle()
        }
      },
    }
  })

  return handlers
}
