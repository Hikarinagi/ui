import type { Ref } from 'vue'

export function useSegmentFocus(host: Ref<HTMLElement | null>) {
  function segments() {
    return Array.from(
      host.value?.querySelectorAll<HTMLElement>('[data-hn-segment]:not([aria-hidden="true"])') ??
        [],
    )
  }

  function focus() {
    const all = segments()
    ;(all.find(segment => segment.hasAttribute('data-placeholder')) ?? all[0])?.focus()
  }

  function onHostClick(event: MouseEvent) {
    if ((event.target as Element).closest('[data-hn-segment], button')) return
    focus()
  }

  return { focus, onHostClick }
}
