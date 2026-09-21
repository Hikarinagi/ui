import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
  type Ref,
} from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel'
import {
  carouselIndex as indexOf,
  carouselInitialLayout,
} from '../../../../../shared/src/lib/carousel'
import { DURATION } from '../../../motion'
import { useDirection } from '../../../lib/useDirection'
import type { CarouselProps, CarouselControls, CarouselState } from '../types'

export function useCarousel<T>(
  props: CarouselProps<T>,
  model: Ref<number | undefined>,
  emit: (event: 'select' | 'ready', state: CarouselState) => void,
) {
  const { root: element, direction, rootDirection } = useDirection(() => props.dir)
  const viewport = shallowRef<HTMLElement>()
  const reduced = usePreferredReducedMotion()
  const ready = ref(false)
  const index = ref(indexOf(model.value))
  const snapCount = ref(0)
  const canPrev = ref(false)
  const canNext = ref(false)
  const visibleItems = ref<number[]>([])
  const visibilityKnown = ref(false)
  const requested = ref(false)
  const hovering = ref(false)
  const dragging = ref(false)
  const onScreen = ref(false)
  const documentVisible = ref(true)
  let api: EmblaCarouselType | undefined
  let mounted = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let cleanup = () => {}
  let pointerIntent: boolean | undefined

  const options = computed<EmblaOptionsType>(() => ({
    axis: props.orientation === 'vertical' ? 'y' : 'x',
    direction: direction.value,
    align: props.align ?? 'start',
    containScroll: props.containScroll === undefined ? 'trimSnaps' : props.containScroll,
    slidesToScroll:
      props.slidesToScroll === 'auto'
        ? 'auto'
        : Number.isFinite(props.slidesToScroll)
          ? Math.max(1, Math.trunc(props.slidesToScroll!))
          : 1,
    inViewThreshold: 0.01,
    loop: props.loop,
    watchDrag: props.draggable !== false,
    dragFree: props.dragFree,
    watchSlides: false,
    duration: reduced.value === 'reduce' ? 0 : DURATION.slow * 60,
  }))
  const initialLayout = computed(() =>
    !props.itemClass &&
    (options.value.slidesToScroll === 1 || options.value.slidesToScroll === 'auto')
      ? carouselInitialLayout(props.items.length, model.value, props.loop)
      : undefined,
  )
  const initialIndex = computed(() => (ready.value ? undefined : initialLayout.value?.index))
  const playing = computed(
    () =>
      requested.value &&
      ready.value &&
      snapCount.value > 1 &&
      onScreen.value &&
      documentVisible.value &&
      !hovering.value &&
      !dragging.value,
  )
  const state = computed<CarouselState>(() => ({
    index: ready.value ? index.value : (initialLayout.value?.index ?? indexOf(model.value)),
    snapCount: ready.value ? snapCount.value : (initialLayout.value?.snapCount ?? 0),
    canPrev: ready.value ? canPrev.value : (initialLayout.value?.canPrev ?? false),
    canNext: ready.value ? canNext.value : (initialLayout.value?.canNext ?? false),
    visibleItems: visibilityKnown.value
      ? visibleItems.value
      : (initialLayout.value?.visibleItems ?? []),
    ready: ready.value,
    playing: playing.value,
  }))
  const controls = computed<CarouselControls>(() => ({
    ...state.value,
    prev,
    next,
    scrollTo,
    play,
    pause,
  }))

  function clearTimer() {
    clearTimeout(timer)
    timer = undefined
  }
  function schedule() {
    clearTimer()
    if (!playing.value) return
    const delay =
      typeof props.autoplay === 'number' && Number.isFinite(props.autoplay)
        ? Math.max(1000, props.autoplay)
        : 5000
    timer = setTimeout(() => {
      if (!playing.value || !api) return
      if (api.canScrollNext()) api.scrollNext(reduced.value === 'reduce')
      else pause()
    }, delay)
  }
  function pause() {
    requested.value = false
    clearTimer()
  }
  function play() {
    if (!props.autoplay || !api || snapCount.value < 2) return
    if (!api.canScrollNext()) api.scrollTo(0, true)
    requested.value = true
  }
  function rotationPointerDown() {
    pointerIntent = requested.value
  }
  function toggleRotation() {
    const stop = pointerIntent ?? requested.value
    pointerIntent = undefined
    if (stop) pause()
    else play()
  }
  function focusIn() {
    pause()
  }
  function scrollTo(value: number, instant = false) {
    if (!api) return
    pause()
    api.scrollTo(indexOf(value, snapCount.value), instant || reduced.value === 'reduce')
  }
  function prev() {
    if (api && canPrev.value) {
      pause()
      api.scrollPrev(reduced.value === 'reduce')
    }
  }
  function next() {
    if (api && canNext.value) {
      pause()
      api.scrollNext(reduced.value === 'reduce')
    }
  }
  function visible() {
    if (!api || !viewport.value) return
    const bounds = viewport.value.getBoundingClientRect()
    const vertical = props.orientation === 'vertical'
    const nodes = api.slideNodes()
    const items = api.slidesInView().filter(index => {
      const rect = nodes[index]!.getBoundingClientRect()
      return vertical
        ? Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top) > 1
        : Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left) > 1
    })
    if (!items.length) return
    const active = viewport.value?.ownerDocument.activeElement
    if (active && api.slideNodes().some((slide, i) => !items.includes(i) && slide.contains(active)))
      viewport.value?.focus({ preventScroll: true })
    visibleItems.value = items
    visibilityKnown.value = true
  }
  function sync() {
    if (!api || !viewport.value) return
    const rect = viewport.value.getBoundingClientRect()
    const measurable = (props.orientation === 'vertical' ? rect.height : rect.width) > 0
    if (!ready.value && !measurable) return
    const initial = !ready.value
    index.value = api.selectedScrollSnap()
    snapCount.value = api.scrollSnapList().length
    canPrev.value = api.canScrollPrev()
    canNext.value = api.canScrollNext()
    if (model.value !== index.value) model.value = index.value
    ready.value = true
    visible()
    schedule()
    if (initial) emit('ready', state.value)
  }
  function selected() {
    sync()
    emit('select', state.value)
  }
  function reinitialized() {
    visibilityKnown.value = false
    if (!ready.value && api) api.scrollTo(indexOf(model.value, api.scrollSnapList().length), true)
    sync()
  }
  function destroy() {
    api?.destroy()
    api = undefined
    element.value?.removeAttribute('data-engine')
    ready.value = false
    snapCount.value = 0
    canPrev.value = false
    canNext.value = false
    visibilityKnown.value = false
    visibleItems.value = []
    clearTimer()
  }
  function refresh() {
    if (!mounted || !viewport.value) return
    if (!props.items.length) {
      destroy()
      return
    }
    element.value?.setAttribute('data-engine', '')
    if (api) api.reInit({ ...options.value, startIndex: indexOf(model.value) })
    else {
      api = EmblaCarousel(viewport.value, {
        ...options.value,
        startIndex: indexOf(model.value, initialLayout.value?.snapCount),
      })
      api
        .on('select', selected)
        .on('reInit', reinitialized)
        .on('slidesInView', visible)
        .on('pointerDown', () => {
          dragging.value = true
          pause()
        })
        .on('pointerUp', () => {
          dragging.value = false
        })
        .on('settle', () => {
          visible()
          schedule()
        })
      sync()
    }
  }
  function keydown(event: KeyboardEvent) {
    if (
      event.target !== viewport.value ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !ready.value
    )
      return
    const forward =
      props.orientation === 'vertical'
        ? 'ArrowDown'
        : direction.value === 'rtl'
          ? 'ArrowLeft'
          : 'ArrowRight'
    const backward =
      props.orientation === 'vertical'
        ? 'ArrowUp'
        : direction.value === 'rtl'
          ? 'ArrowRight'
          : 'ArrowLeft'
    if (![forward, backward, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === forward) next()
    else if (event.key === backward) prev()
    else scrollTo(event.key === 'Home' ? 0 : snapCount.value - 1)
  }
  watch(model, value => {
    if (!api || !ready.value) return
    const target = indexOf(value, snapCount.value)
    if (target !== api.selectedScrollSnap()) scrollTo(target)
    else if (value !== target) model.value = target
  })
  watch(options, async () => {
    await nextTick()
    refresh()
  })
  watch(
    () => props.items.map(props.getKey),
    async (keys, before) => {
      if (keys.length === before.length && keys.every((key, index) => key === before[index])) return
      await nextTick()
      refresh()
    },
  )
  watch(playing, schedule)
  watch(
    () => props.autoplay,
    value => {
      requested.value = !!value && reduced.value !== 'reduce'
      schedule()
    },
  )
  watch(reduced, value => {
    if (value === 'reduce') pause()
  })
  onMounted(() => {
    mounted = true
    const doc = viewport.value!.ownerDocument
    const view = doc.defaultView!
    const visibility = () => {
      documentVisible.value = !doc.hidden
    }
    visibility()
    doc.addEventListener('visibilitychange', visibility)
    const observer =
      typeof view.IntersectionObserver === 'function'
        ? new view.IntersectionObserver(entries => {
            onScreen.value = entries.some(entry => entry.isIntersecting)
          })
        : undefined
    if (observer && element.value) observer.observe(element.value)
    else onScreen.value = true
    cleanup = () => {
      observer?.disconnect()
      doc.removeEventListener('visibilitychange', visibility)
    }
    requested.value = !!props.autoplay && reduced.value !== 'reduce'
    refresh()
  })
  onBeforeUnmount(() => {
    mounted = false
    cleanup()
    destroy()
  })
  return {
    element,
    viewport,
    rootDirection,
    ready,
    initialIndex,
    visibilityKnown: computed(() => visibilityKnown.value || !!initialLayout.value),
    state,
    controls,
    requested,
    hovering,
    keydown,
    focusIn,
    rotationPointerDown,
    toggleRotation,
    refresh,
  }
}
