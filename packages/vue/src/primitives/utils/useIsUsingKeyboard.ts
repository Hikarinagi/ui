import { onMounted, ref } from 'vue'
import { createSharedComposable, useEventListener } from '@vueuse/core'

function useIsUsingKeyboardImpl() {
  const isUsingKeyboard = ref(false)
  onMounted(() => {
    useEventListener(
      'keydown',
      () => {
        isUsingKeyboard.value = true
      },
      { capture: true, passive: true },
    )
    useEventListener(
      ['pointerdown', 'pointermove'],
      () => {
        isUsingKeyboard.value = false
      },
      { capture: true, passive: true },
    )
  })
  return isUsingKeyboard
}

export const useIsUsingKeyboard = createSharedComposable(useIsUsingKeyboardImpl)
