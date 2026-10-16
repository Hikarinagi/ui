import { ref, watchEffect, type Ref } from 'vue'
import { createEventHook, refAutoReset, tryOnScopeDispose } from '@vueuse/core'
import {
  exitSideFromRect,
  hull,
  isPointInPolygon,
  paddedExitPoints,
  pointsFromRect,
  type Polygon,
} from '../../../../shared/src/primitives/grace-area'

export function useGraceArea(
  triggerElement: Ref<HTMLElement | undefined>,
  containerElement: Ref<HTMLElement | undefined>,
) {
  const isPointerInTransit = refAutoReset(false, 300)
  tryOnScopeDispose(() => {
    isPointerInTransit.value = false
  })

  const pointerGraceArea = ref<Polygon | null>(null)
  const pointerExit = createEventHook<void>()

  function handleRemoveGraceArea() {
    pointerGraceArea.value = null
    isPointerInTransit.value = false
  }

  function handleCreateGraceArea(event: PointerEvent, hoverTarget: HTMLElement | undefined) {
    if (!hoverTarget) return
    const currentTarget = event.currentTarget as HTMLElement
    const exitPoint = { x: event.clientX, y: event.clientY }
    const exitSide = exitSideFromRect(exitPoint, currentTarget.getBoundingClientRect())
    pointerGraceArea.value = hull([
      ...paddedExitPoints(exitPoint, exitSide, 1),
      ...pointsFromRect(hoverTarget.getBoundingClientRect()),
    ])
    isPointerInTransit.value = true
  }

  watchEffect(onCleanup => {
    const trigger = triggerElement.value
    const container = containerElement.value
    if (!trigger || !container) return
    const handleTriggerLeave = (event: PointerEvent) =>
      handleCreateGraceArea(event, containerElement.value)
    const handleContentLeave = (event: PointerEvent) =>
      handleCreateGraceArea(event, triggerElement.value)
    trigger.addEventListener('pointerleave', handleTriggerLeave)
    container.addEventListener('pointerleave', handleContentLeave)
    onCleanup(() => {
      triggerElement.value?.removeEventListener('pointerleave', handleTriggerLeave)
      containerElement.value?.removeEventListener('pointerleave', handleContentLeave)
    })
  })

  watchEffect(onCleanup => {
    if (!pointerGraceArea.value) return
    const handleTrackPointerGrace = (event: PointerEvent) => {
      if (!pointerGraceArea.value || !(event.target instanceof Element)) return
      const target = event.target
      const hasEnteredTarget =
        triggerElement.value?.contains(target) || containerElement.value?.contains(target)
      const isPointerOutsideGraceArea = !isPointInPolygon(
        { x: event.clientX, y: event.clientY },
        pointerGraceArea.value,
      )
      const isAnotherGraceAreaTrigger = !!target.closest('[data-grace-area-trigger]')
      if (hasEnteredTarget) handleRemoveGraceArea()
      else if (isPointerOutsideGraceArea || isAnotherGraceAreaTrigger) {
        handleRemoveGraceArea()
        void pointerExit.trigger()
      }
    }
    triggerElement.value?.ownerDocument.addEventListener('pointermove', handleTrackPointerGrace)
    onCleanup(() =>
      triggerElement.value?.ownerDocument.removeEventListener(
        'pointermove',
        handleTrackPointerGrace,
      ),
    )
  })

  return { isPointerInTransit, onPointerExit: pointerExit.on }
}
