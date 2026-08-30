import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { isPaintWorkletSupported, SpoilerPainter } from '../SpoilerPainter'

const ACCENT_LIGHT = '0 0% 20%'
const ACCENT_DARK = '0 0% 100%'

export function useSpoiler(
  host: Ref<HTMLElement | null>,
  hidden: Ref<boolean>,
  forceFallback: () => boolean,
) {
  const usesFallback = ref(true)

  let painter: SpoilerPainter | undefined
  let themeObserver: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  const isDark = ref(false)

  const accent = () => (isDark.value ? ACCENT_DARK : ACCENT_LIGHT)

  onMounted(() => {
    usesFallback.value = !isPaintWorkletSupported || forceFallback()
    if (usesFallback.value || !host.value) return

    const readTheme = () => {
      isDark.value = document.documentElement.classList.contains('dark')
    }
    readTheme()
    themeObserver = new MutationObserver(readTheme)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    painter = new SpoilerPainter(host.value, { accent: accent() })

    resizeObserver = new ResizeObserver(() => {
      painter?.update({ accent: accent() })
    })
    resizeObserver.observe(host.value)

    watch(
      hidden,
      value => {
        if (!painter) return
        if (value !== painter.isHidden) {
          if (value) {
            painter.hide()
          } else {
            painter.reveal()
          }
        }
      },
      { immediate: true },
    )

    watch(isDark, () => painter?.update({ accent: accent() }))
  })

  onBeforeUnmount(() => {
    painter?.destroy()
    painter = undefined
    themeObserver?.disconnect()
    resizeObserver?.disconnect()
  })

  return { usesFallback }
}
