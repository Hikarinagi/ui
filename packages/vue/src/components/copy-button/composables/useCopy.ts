import { onBeforeUnmount, shallowRef } from 'vue'

export function useCopy(text: () => string, onCopied?: (value: string) => void) {
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
    }, 2000)
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copied, copy }
}
