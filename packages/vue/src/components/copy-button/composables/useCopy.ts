import { onBeforeUnmount, shallowRef } from 'vue'

export const COPIED_RESET_MS = 2000

export function useCopy(
  text: () => string,
  onCopied?: (value: string) => void,
  resetAfter: () => number = () => COPIED_RESET_MS,
) {
  const copied = shallowRef(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy() {
    const value = text()
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    copied.value = true
    onCopied?.(value)
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, resetAfter())
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copied, copy }
}
