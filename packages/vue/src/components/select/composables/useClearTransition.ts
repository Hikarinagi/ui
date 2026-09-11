import { computed, ref } from 'vue'

export function useClearTransition(visible: () => boolean) {
  const leaving = ref(false)
  const reserved = computed(() => visible() || leaving.value)

  function beforeEnter(element: Element) {
    leaving.value = false
    element.removeAttribute('inert')
  }

  function beforeLeave(element: Element) {
    leaving.value = true
    element.setAttribute('inert', '')
  }

  function finishLeave() {
    leaving.value = false
  }

  return {
    reserved,
    hooks: { beforeEnter, beforeLeave, afterLeave: finishLeave, leaveCancelled: finishLeave },
  }
}
