import { watchEffect } from 'vue'
import { isClient } from '@vueuse/core'
import { installFocusGuards } from '../../../../shared/src/primitives/focus-guards'

export function useFocusGuards() {
  watchEffect(onCleanup => {
    if (!isClient) return
    onCleanup(installFocusGuards())
  })
}
