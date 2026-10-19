import { computed, nextTick, onMounted, shallowRef, watch, type ComponentPublicInstance } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { cssTimeToMs } from '../../../../../shared/src/lib/css-time'
import { decodeThumbhash } from '../../../../../shared/src/lib/thumbhash'
import { fitPlaceholder, settlePlaceholder } from '../../../../../shared/src/lib/image-placeholder'
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
    thumbhash?: string
    lazy: boolean
    rootMargin: string
    skeleton: boolean
    fit?: string
    imageClass?: string
    imageStyle?: unknown
  },
  emit: {
    (e: 'load', size: { width: number; height: number }): void
    (e: 'error'): void
  },
) {
  const resolve = useImageResolver()

  const rootEl = shallowRef<HTMLElement | ComponentPublicInstance>()
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

  const primary = computed(() => (props.src ? resolve(props.src, 'image') : ''))

  const fallback = computed(() => (props.fallback ? resolve(props.fallback, 'image') : ''))

  const resolved = computed(() => (usingFallback.value ? fallback.value : primary.value))

  const thumb = computed(() => (props.thumbhash ? decodeThumbhash(props.thumbhash) : null))

  const placeholder = computed(() => thumb.value?.url ?? null)

  const src = computed(() => (entered.value ? resolved.value || undefined : undefined))
  const showImage = computed(() => Boolean(resolved.value) && !failed.value)
  const showSkeleton = computed(
    () => (props.skeleton || !!placeholder.value) && showImage.value && skeletonMounted.value,
  )

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

  function fitLayer() {
    const layer = skeletonEl.value
    const img = imageEl.value
    if (layer && img && placeholder.value) fitPlaceholder(layer, img)
  }

  watch(
    [skeletonEl, imageEl, () => props.fit, () => props.imageClass, () => props.imageStyle],
    fitLayer,
    { flush: 'post' },
  )

  function play(
    el: HTMLElement,
    duration: string,
    easing: string,
    transform?: string,
  ): Animation | null {
    const style = getComputedStyle(el)
    try {
      const from: Keyframe = transform ? { opacity: 1, transform: 'none' } : { opacity: 1 }
      const to: Keyframe = transform ? { opacity: 0, transform } : { opacity: 0 }
      return el.animate([from, to], {
        duration: cssTimeToMs(style.getPropertyValue(duration)),
        easing: style.getPropertyValue(easing).trim() || 'linear',
        fill: 'forwards',
      })
    } catch {
      return null
    }
  }

  function afterPaint() {
    return new Promise<void>(res => requestAnimationFrame(() => requestAnimationFrame(() => res())))
  }

  function settleLayer(layer: HTMLElement) {
    const img = imageEl.value
    if (!img || !thumb.value) return undefined
    fitPlaceholder(layer, img)
    const settle = settlePlaceholder(img, thumb.value)
    if (!settle) return undefined
    layer.style.transformOrigin = settle.transformOrigin
    return settle.transform
  }

  function dropLayer() {
    const layer = skeletonEl.value
    const anim =
      layer &&
      (placeholder.value
        ? play(layer, '--hn-duration-slow', '--hn-ease-move', settleLayer(layer))
        : play(layer, '--hn-duration-fast', '--hn-ease-enter'))
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

  async function reveal() {
    if (!props.lazy) {
      revealed.value = true
      if (placeholder.value) dropLayer()
      else skeletonMounted.value = false
      return
    }

    const img = imageEl.value
    const at = src.value
    await nextTick()
    await afterPaint()
    if (imageEl.value !== img || src.value !== at) return

    revealed.value = true
    dropLayer()
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

  return {
    rootEl,
    imageEl,
    skeletonEl,
    src,
    placeholder,
    revealed,
    failed,
    showImage,
    showSkeleton,
  }
}
