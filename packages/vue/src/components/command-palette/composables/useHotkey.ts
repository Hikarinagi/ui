import { useEventListener } from '@vueuse/core'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { matchesHotkey, parseHotkey } from '../utils/hotkey'

export function useHotkey(spec: MaybeRefOrGetter<string | undefined>, handler: () => void) {
  const hotkey = computed(() => {
    const value = toValue(spec)
    return value ? parseHotkey(value) : null
  })

  useEventListener('keydown', (event: KeyboardEvent) => {
    if (!hotkey.value || event.defaultPrevented || event.repeat) return
    if (!matchesHotkey(event, hotkey.value)) return
    event.preventDefault()
    handler()
  })
}
