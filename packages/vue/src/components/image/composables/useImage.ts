import { computed, nextTick, onMounted, shallowRef, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useImageResolver } from '../resolver'

function ready(img: HTMLImageElement): Promise<void> {
  if (typeof img.decode === 'function') return img.decode()
  if (img.complete) {
    return img.naturalWidth > 0 ? Promise.resolve() : Promise.reject(new Error('image failed'))
  }
  return new Promise((res, rej) => {
    img.addEventListener('load', () => res(), { once: true })
    img.addEventListener('error', () => rej(new Error('image failed')), { once: true })
  })
}

export function useImage(
  props: {
    src?: string
    fallback?: string
    lazy: boolean
    rootMargin: string
    skeleton: boolean
  },
  emit: {
    (e: 'load', size: { width: number; height: number }): void
    (e: 'error'): void
  },
) {
  const resolve = useImageResolver()

  const rootEl = shallowRef<HTMLElement>()
  const imageEl = shallowRef<HTMLImageElement>()
  const skeletonEl = shallowRef<HTMLElement>()
  const entered = shallowRef(!props.lazy)
  const usingFallback = shallowRef(false)
  const revealed = shallowRef(false)
  const skeletonMounted = shallowRef(true)
  const failed = shallowRef(false)

  let fade: Animation | null = null

  const { isSupported, stop } = useIntersectionObserver(
    rootEl,
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      entered.value = true
      stop()
    },
    { rootMargin: props.rootMargin, immediate: props.lazy },
  )

  const primary = computed(() => (props.src ? resolve(props.src) : ''))

  const fallback = computed(() => (props.fallback ? resolve(props.fallback) : ''))

  const resolved = computed(() => (usingFallback.value ? fallback.value : primary.value))

  const src = computed(() => (entered.value ? resolved.value || undefined : undefined))
  const showImage = computed(() => Boolean(resolved.value) && !failed.value)
  const showSkeleton = computed(() => props.skeleton && showImage.value && skeletonMounted.value)

  watch(primary, () => {
    usingFallback.value = false
  })

  watch(resolved, () => {
    fade?.cancel()
    fade = null
    revealed.value = false
    skeletonMounted.value = true
    failed.value = false
  })

  function play(el: HTMLElement, frames: Keyframe[]): Animation | null {
    const style = getComputedStyle(el)
    try {
      return el.animate(frames, {
        duration: Number.parseFloat(style.getPropertyValue('--hn-duration-base')) || 0,
        easing: style.getPropertyValue('--hn-ease-enter').trim() || 'linear',
        fill: 'forwards',
      })
    } catch {
      return null
    }
  }

  function afterPaint() {
    return new Promise<void>(res => requestAnimationFrame(() => requestAnimationFrame(() => res())))
  }

  async function reveal() {
    revealed.value = true

    if (!props.lazy) {
      skeletonMounted.value = false
      return
    }

    await nextTick()
    await afterPaint()

    const layer = skeletonEl.value
    const anim = layer && play(layer, [{ opacity: 1 }, { opacity: 0 }])
    if (!anim) {
      skeletonMounted.value = false
      return
    }

    fade = anim
    anim.finished.then(
      () => {
        if (fade === anim) skeletonMounted.value = false
      },
      () => {},
    )
  }

  function fail() {
    if (!usingFallback.value && fallback.value) {
      usingFallback.value = true
      return
    }
    failed.value = true
    emit('error')
  }

  watch(
    [imageEl, src],
    async () => {
      const img = imageEl.value
      if (!img || !src.value) return

      const at = src.value
      try {
        await ready(img)
      } catch {
        if (src.value === at) fail()
        return
      }
      if (src.value !== at) return

      emit('load', { width: img.naturalWidth, height: img.naturalHeight })
      void reveal()
    },
    { flush: 'post' },
  )

  onMounted(() => {
    if (!isSupported.value) entered.value = true
  })

  return { rootEl, imageEl, skeletonEl, src, revealed, failed, showImage, showSkeleton }
}
