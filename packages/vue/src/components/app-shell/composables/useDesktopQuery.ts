import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useDesktopQuery(query = '(min-width: 64rem)') {
  const isDesktop = ref(true)
  let media: MediaQueryList | undefined

  function onChange() {
    isDesktop.value = media?.matches ?? true
  }

  onMounted(() => {
    media = window.matchMedia(query)
    media.addEventListener('change', onChange)
    onChange()
  })

  onBeforeUnmount(() => media?.removeEventListener('change', onChange))

  return isDesktop
}
