import { computed, nextTick, onUnmounted, ref, watch, type Ref } from 'vue'
import { createPresence, type PresenceState } from '../../../../shared/src/primitives/presence'

export function usePresence(present: Ref<boolean>, node: Ref<HTMLElement | undefined>) {
  const state = ref<PresenceState>(present.value ? 'mounted' : 'unmounted')
  const presence = createPresence(present.value, next => (state.value = next), {
    fillForwards: false,
  })

  watch(
    present,
    async (current, previous) => {
      await nextTick()
      presence.update(current, previous)
    },
    { immediate: true },
  )

  const stop = watch(node, element => presence.setNode(element), { immediate: true })

  onUnmounted(() => {
    stop()
    presence.dispose()
  })

  const isPresent = computed(() => ['mounted', 'unmountSuspended'].includes(state.value))
  return { isPresent }
}
