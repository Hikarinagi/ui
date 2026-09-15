import { onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'
import type { OverlayScrollbars } from 'overlayscrollbars'
import type ScrollArea from '../../scroll-area/ScrollArea.vue'

export function useSidebarScrollUpdates(
  area: Readonly<Ref<InstanceType<typeof ScrollArea> | undefined>>,
) {
  const transitioning = shallowRef(false)
  let paused: OverlayScrollbars | undefined
  let revision = 0

  function resume() {
    const instance = paused
    paused = undefined
    if (instance && !instance.state().destroyed) instance.sleep(false)
  }

  const stop = watch(
    [() => area.value?.instance, transitioning],
    ([instance, active]) => {
      if (active && instance === paused) return
      resume()
      if (active && instance && !instance.state().sleeping && !instance.state().destroyed) {
        paused = instance
        instance.sleep(true)
      }
    },
    { flush: 'sync' },
  )

  onBeforeUnmount(() => {
    revision++
    stop()
    resume()
  })

  return (event: TransitionEvent) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'width') return
    const target = event.currentTarget as HTMLElement
    const animations = target
      .getAnimations()
      .filter(
        animation => animation instanceof CSSTransition && animation.transitionProperty === 'width',
      )
    if (!animations.length) return
    const current = ++revision
    transitioning.value = true
    void Promise.allSettled(animations.map(animation => animation.finished)).then(() => {
      if (current === revision) transitioning.value = false
    })
  }
}
