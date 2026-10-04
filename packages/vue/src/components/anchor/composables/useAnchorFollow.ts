import { useResizeObserver } from '@vueuse/core'
import { onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue'
import { createAnchorFollow } from '../../../../../shared/src/behavior/anchor-follow'

export function useAnchorFollow(
  root: Readonly<Ref<HTMLElement | null>>,
  current: Readonly<Ref<string | undefined>>,
  lastCovered: Readonly<Ref<string | undefined>>,
  enabled: () => boolean,
) {
  const viewport = shallowRef<HTMLElement>()
  const follower = createAnchorFollow()
  let mounted = false
  let frame = 0

  function follow() {
    frame = 0
    const result = follower.follow({
      nav: root.value,
      current: current.value,
      lastCovered: lastCovered.value,
      enabled: enabled(),
    })
    if (result) viewport.value = result.viewport
  }

  function schedule() {
    if (mounted && !frame) frame = requestAnimationFrame(follow)
  }

  watch([root, current, lastCovered, enabled], schedule, { flush: 'post' })
  useResizeObserver(
    () =>
      [root.value, root.value?.parentElement, viewport.value].filter(
        (el): el is HTMLElement => !!el,
      ),
    schedule,
  )
  onMounted(() => {
    mounted = true
    schedule()
  })
  onBeforeUnmount(() => {
    mounted = false
    cancelAnimationFrame(frame)
  })
}
