import { computed, nextTick, ref } from 'vue'

const IME_SCRIPT =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Bopomofo}]/u

function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

export function useComposing(onEnd?: (event: CompositionEvent) => void) {
  const isComposing = ref(false)
  const isImeComposition = ref(true)
  const sawImeScript = ref(false)
  const shouldDeferInput = computed(() => isComposing.value && isImeComposition.value)

  function handleCompositionStart() {
    isComposing.value = true
    isImeComposition.value = true
    sawImeScript.value = false
  }

  function handleCompositionUpdate(event: CompositionEvent) {
    if (!event.data) return
    if (IME_SCRIPT.test(event.data)) {
      isImeComposition.value = true
      sawImeScript.value = true
    } else if (isAndroid() && !sawImeScript.value) isImeComposition.value = false
  }

  function handleCompositionEnd(event: CompositionEvent) {
    void nextTick(() => {
      isComposing.value = false
      onEnd?.(event)
    })
  }

  return {
    isComposing,
    shouldDeferInput,
    handleCompositionStart,
    handleCompositionUpdate,
    handleCompositionEnd,
  }
}
