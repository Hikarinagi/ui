import { onUnmounted, watch, type MaybeRefOrGetter } from 'vue'
import { unrefElement, type MaybeElement } from '@vueuse/core'
import { hideOutside } from '../../../../shared/src/primitives/dialog'

export function useHideOthers(target: MaybeRefOrGetter<MaybeElement>) {
  let undo: (() => void) | undefined
  watch(
    () => unrefElement(target),
    element => {
      const next = element ? hideOutside(element) : undefined
      if (next) undo = next
      else if (undo) undo()
    },
  )
  onUnmounted(() => {
    if (undo) undo()
  })
}
