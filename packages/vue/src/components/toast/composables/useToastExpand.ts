import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { pauseTimers, resumeTimers } from '../store'

export function useToastExpand() {
  const reasons = ref(new Set<string>())
  const expanded = computed(() => reasons.value.size > 0)

  function enter(reason: string) {
    reasons.value.add(reason)
    pauseTimers(reason)
  }

  function leave(reason: string) {
    reasons.value.delete(reason)
    resumeTimers(reason)
  }

  function onVisibility() {
    if (document.hidden) pauseTimers('hidden')
    else resumeTimers('hidden')
  }

  onMounted(() => document.addEventListener('visibilitychange', onVisibility))
  onBeforeUnmount(() => document.removeEventListener('visibilitychange', onVisibility))

  return { expanded, enter, leave }
}
