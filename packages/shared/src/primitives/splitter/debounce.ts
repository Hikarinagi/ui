export function debounce<T extends unknown[]>(callback: (...args: T) => void, durationMs = 10) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  const callable = (...args: T) => {
    if (timeoutId !== null) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback(...args)
    }, durationMs)
  }
  return callable
}
