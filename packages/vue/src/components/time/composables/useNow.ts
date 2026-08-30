import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export function useNow(active: () => boolean, intervalMs = 30_000) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    watch(
      active,
      on => {
        clearInterval(timer)
        timer = undefined
        if (on) {
          now.value = Date.now()
          timer = setInterval(() => {
            now.value = Date.now()
          }, intervalMs)
        }
      },
      { immediate: true },
    )
  })

  onBeforeUnmount(() => clearInterval(timer))

  return now
}
