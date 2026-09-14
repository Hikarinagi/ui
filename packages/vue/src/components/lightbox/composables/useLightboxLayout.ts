import { watch } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { LightboxItem } from '../types'
import type { useLightboxFrames } from './useLightboxFrames'
import type { useLightboxLarge } from './useLightboxLarge'
import type { useLightboxPhase } from './useLightboxPhase'
import type { useLightboxZoom } from './useLightboxZoom'

export function useLightboxLayout(options: {
  stage: () => HTMLElement | undefined
  current: () => LightboxItem | undefined
  frames: ReturnType<typeof useLightboxFrames>
  large: ReturnType<typeof useLightboxLarge>
  phase: ReturnType<typeof useLightboxPhase>
  zoom: ReturnType<typeof useLightboxZoom>
  measure: () => void
}) {
  function sync() {
    if (options.phase.current() !== 'open') return
    options.zoom.reflow(() => {
      options.measure()
      options.frames.learnPreview(options.current(), options.large.image.value)
    })
  }

  function learn(id: string, img: HTMLImageElement) {
    const update = () => options.frames.learn(id, img)
    if (options.phase.current() === 'open' && options.current()?.id === id)
      options.zoom.reflow(update)
    else update()
  }

  watch(() => [options.phase.current(), options.current(), options.large.image.value], sync, {
    flush: 'post',
  })
  useResizeObserver(() => {
    const stage = options.stage()
    if (!stage) return []
    const chrome = stage.querySelector<HTMLElement>('[data-hn-chrome]')
    return chrome ? [stage, chrome] : [stage]
  }, sync)

  return { learn }
}
