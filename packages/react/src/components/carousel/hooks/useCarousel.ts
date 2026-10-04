'use client'

import {
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from 'react'
import { flushSync } from 'react-dom'
import EmblaCarousel, { type EmblaCarouselType, type EmblaOptionsType } from 'embla-carousel'
import {
  carouselIndex as indexOf,
  carouselInitialLayout,
} from '../../../../../shared/src/lib/carousel'
import { DURATION } from '../../../motion'
import { useDirection } from '../../stepper/hooks/useDirection'
import { usePreferredReducedMotion } from './usePreferredReducedMotion'
import type { CarouselControls, CarouselProps, CarouselState } from '../types'

type Direction = 'ltr' | 'rtl'
type Reduced = 'reduce' | 'no-preference'
type Layout = ReturnType<typeof carouselInitialLayout>

export type CarouselSettings<T> = Pick<
  CarouselProps<T>,
  | 'items'
  | 'getKey'
  | 'dir'
  | 'orientation'
  | 'align'
  | 'containScroll'
  | 'slidesToScroll'
  | 'loop'
  | 'draggable'
  | 'dragFree'
  | 'autoplay'
  | 'itemClass'
>

interface Store {
  ready: boolean
  index: number
  snapCount: number
  canPrev: boolean
  canNext: boolean
  visibleItems: number[]
  visibilityKnown: boolean
  requested: boolean
  hovering: boolean
  dragging: boolean
  onScreen: boolean
  documentVisible: boolean
}

interface Latest<T> {
  props: CarouselSettings<T>
  model: number | undefined
  setModel: (value: number) => void
  emit: (event: 'select' | 'ready', state: CarouselState) => void
  direction: Direction
  rootDirection: Direction | undefined
  reduced: Reduced
  options: EmblaOptionsType
  initialLayout: Layout | undefined
}

function buildOptions<T>(
  props: CarouselSettings<T>,
  direction: Direction,
  reduced: Reduced,
): EmblaOptionsType {
  return {
    axis: props.orientation === 'vertical' ? 'y' : 'x',
    direction,
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
    duration: reduced === 'reduce' ? 0 : DURATION.slow * 60,
  }
}

function buildLayout<T>(
  props: CarouselSettings<T>,
  options: EmblaOptionsType,
  model: number | undefined,
) {
  return !props.itemClass && (options.slidesToScroll === 1 || options.slidesToScroll === 'auto')
    ? carouselInitialLayout(props.items.length, model, props.loop)
    : undefined
}

function createController<T>(
  latest: RefObject<Latest<T>>,
  s: Store,
  bump: () => void,
  element: RefObject<HTMLDivElement | null>,
  viewport: RefObject<HTMLDivElement | null>,
) {
  let api: EmblaCarouselType | undefined
  let mounted = false
  let timer: ReturnType<typeof setTimeout> | undefined
  let cleanup = () => {}
  let pointerIntent: boolean | undefined
  let applied: string | undefined
  let queued = false
  let wasPlaying = false
  const L = () => latest.current

  function flush() {
    queued = false
    const now = playing()
    if (now !== wasPlaying) {
      wasPlaying = now
      schedule()
    }
    flushSync(bump)
  }
  function assign(patch: Partial<Store>) {
    Object.assign(s, patch)
    if (queued) return
    queued = true
    queueMicrotask(flush)
  }
  function setModel(value: number) {
    L().model = value
    L().setModel(value)
  }
  function playing() {
    return (
      s.requested &&
      s.ready &&
      s.snapCount > 1 &&
      s.onScreen &&
      s.documentVisible &&
      !s.hovering &&
      !s.dragging
    )
  }
  function state(): CarouselState {
    const layout = L().initialLayout
    return {
      index: s.ready ? s.index : (layout?.index ?? indexOf(L().model)),
      snapCount: s.ready ? s.snapCount : (layout?.snapCount ?? 0),
      canPrev: s.ready ? s.canPrev : (layout?.canPrev ?? false),
      canNext: s.ready ? s.canNext : (layout?.canNext ?? false),
      visibleItems: s.visibilityKnown ? s.visibleItems : (layout?.visibleItems ?? []),
      ready: s.ready,
      playing: playing(),
    }
  }
  function resolved() {
    const host = element.current
    const direction =
      L().rootDirection ??
      (host && host.ownerDocument.defaultView?.getComputedStyle(host).direction === 'rtl'
        ? 'rtl'
        : 'ltr')
    return buildOptions(L().props, direction, L().reduced)
  }
  function clearTimer() {
    clearTimeout(timer)
    timer = undefined
  }
  function schedule() {
    clearTimer()
    if (!playing()) return
    const autoplay = L().props.autoplay
    const delay =
      typeof autoplay === 'number' && Number.isFinite(autoplay) ? Math.max(1000, autoplay) : 5000
    timer = setTimeout(() => {
      if (!playing() || !api) return
      if (api.canScrollNext()) api.scrollNext(L().reduced === 'reduce')
      else pause()
    }, delay)
  }
  function pause() {
    assign({ requested: false })
    clearTimer()
  }
  function play() {
    if (!L().props.autoplay || !api || s.snapCount < 2) return
    if (!api.canScrollNext()) api.scrollTo(0, true)
    assign({ requested: true })
  }
  function rotationPointerDown() {
    pointerIntent = s.requested
  }
  function toggleRotation() {
    const stop = pointerIntent ?? s.requested
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
    api.scrollTo(indexOf(value, s.snapCount), instant || L().reduced === 'reduce')
  }
  function prev() {
    if (api && s.canPrev) {
      pause()
      api.scrollPrev(L().reduced === 'reduce')
    }
  }
  function next() {
    if (api && s.canNext) {
      pause()
      api.scrollNext(L().reduced === 'reduce')
    }
  }
  function visible() {
    const view = viewport.current
    if (!api || !view) return
    const bounds = view.getBoundingClientRect()
    const vertical = L().props.orientation === 'vertical'
    const nodes = api.slideNodes()
    const items = api.slidesInView().filter(index => {
      const rect = nodes[index]!.getBoundingClientRect()
      return vertical
        ? Math.min(rect.bottom, bounds.bottom) - Math.max(rect.top, bounds.top) > 1
        : Math.min(rect.right, bounds.right) - Math.max(rect.left, bounds.left) > 1
    })
    if (!items.length) return
    const active = view.ownerDocument.activeElement
    if (active && api.slideNodes().some((slide, i) => !items.includes(i) && slide.contains(active)))
      view.focus({ preventScroll: true })
    assign({ visibleItems: items, visibilityKnown: true })
  }
  function sync() {
    const view = viewport.current
    if (!api || !view) return
    const rect = view.getBoundingClientRect()
    const measurable = (L().props.orientation === 'vertical' ? rect.height : rect.width) > 0
    if (!s.ready && !measurable) return
    const initial = !s.ready
    assign({
      index: api.selectedScrollSnap(),
      snapCount: api.scrollSnapList().length,
      canPrev: api.canScrollPrev(),
      canNext: api.canScrollNext(),
    })
    if (L().model !== s.index) setModel(s.index)
    assign({ ready: true })
    visible()
    schedule()
    if (initial) L().emit('ready', state())
  }
  function selected() {
    sync()
    L().emit('select', state())
  }
  function reinitialized() {
    assign({ visibilityKnown: false })
    if (!s.ready && api) api.scrollTo(indexOf(L().model, api.scrollSnapList().length), true)
    sync()
  }
  function destroy() {
    api?.destroy()
    api = undefined
    applied = undefined
    element.current?.removeAttribute('data-engine')
    assign({
      ready: false,
      snapCount: 0,
      canPrev: false,
      canNext: false,
      visibilityKnown: false,
      visibleItems: [],
    })
    clearTimer()
  }
  function refresh() {
    const view = viewport.current
    if (!mounted || !view) return
    if (!L().props.items.length) {
      destroy()
      return
    }
    element.current?.setAttribute('data-engine', '')
    const options = resolved()
    applied = JSON.stringify(options)
    if (api) api.reInit({ ...options, startIndex: indexOf(L().model) })
    else {
      api = EmblaCarousel(view, {
        ...options,
        startIndex: indexOf(L().model, L().initialLayout?.snapCount),
      })
      api
        .on('select', selected)
        .on('reInit', reinitialized)
        .on('slidesInView', visible)
        .on('pointerDown', () => {
          assign({ dragging: true })
          pause()
        })
        .on('pointerUp', () => {
          assign({ dragging: false })
        })
        .on('settle', () => {
          visible()
          schedule()
        })
      sync()
    }
  }
  function optionsChanged() {
    if (JSON.stringify(resolved()) !== applied) refresh()
  }
  function modelChanged(value: number | undefined) {
    if (!api || !s.ready) return
    const target = indexOf(value, s.snapCount)
    if (target !== api.selectedScrollSnap()) scrollTo(target)
    else if (value !== target) setModel(target)
  }
  function autoplayChanged(value: boolean | number | undefined) {
    assign({ requested: !!value && L().reduced !== 'reduce' })
    schedule()
  }
  function keydown(event: KeyboardEvent<HTMLDivElement>) {
    if (
      event.target !== viewport.current ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      !s.ready
    )
      return
    const vertical = L().props.orientation === 'vertical'
    const rtl = L().direction === 'rtl'
    const forward = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
    if (![forward, backward, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === forward) next()
    else if (event.key === backward) prev()
    else scrollTo(event.key === 'Home' ? 0 : s.snapCount - 1)
  }
  function mount() {
    mounted = true
    const root = element.current
    const doc = viewport.current!.ownerDocument
    const view = doc.defaultView!
    const visibility = () => {
      assign({ documentVisible: !doc.hidden })
    }
    visibility()
    doc.addEventListener('visibilitychange', visibility)
    const enter = () => assign({ hovering: true })
    const leave = () => assign({ hovering: false })
    root?.addEventListener('mouseenter', enter)
    root?.addEventListener('mouseleave', leave)
    const observer =
      typeof view.IntersectionObserver === 'function'
        ? new view.IntersectionObserver(entries => {
            assign({ onScreen: entries.some(entry => entry.isIntersecting) })
          })
        : undefined
    if (observer && root) observer.observe(root)
    else assign({ onScreen: true })
    cleanup = () => {
      observer?.disconnect()
      doc.removeEventListener('visibilitychange', visibility)
      root?.removeEventListener('mouseenter', enter)
      root?.removeEventListener('mouseleave', leave)
    }
    assign({ requested: !!L().props.autoplay && L().reduced !== 'reduce' })
    refresh()
    return () => {
      mounted = false
      cleanup()
      destroy()
    }
  }
  return {
    state,
    playing,
    schedule,
    pause,
    play,
    prev,
    next,
    scrollTo,
    refresh,
    rotationPointerDown,
    toggleRotation,
    focusIn,
    keydown,
    mount,
    optionsChanged,
    modelChanged,
    autoplayChanged,
  }
}

function useChange<V>(value: V, effect: (value: V) => void) {
  const previous = useRef(value)
  useLayoutEffect(() => {
    if (Object.is(previous.current, value)) return
    previous.current = value
    effect(value)
  }, [value])
}

export function useCarousel<T>(
  props: CarouselSettings<T>,
  model: number | undefined,
  setModel: (value: number) => void,
  emit: (event: 'select' | 'ready', state: CarouselState) => void,
) {
  const { root: element, direction, rootDirection } = useDirection<HTMLDivElement>(props.dir)
  const viewport = useRef<HTMLDivElement>(null)
  const reduced = usePreferredReducedMotion()
  const [, bump] = useReducer((count: number) => count + 1, 0)
  const [store] = useState<Store>(() => ({
    ready: false,
    index: indexOf(model),
    snapCount: 0,
    canPrev: false,
    canNext: false,
    visibleItems: [],
    visibilityKnown: false,
    requested: false,
    hovering: false,
    dragging: false,
    onScreen: false,
    documentVisible: true,
  }))
  const options = buildOptions(props, direction, reduced)
  const initialLayout = buildLayout(props, options, model)
  const latest = useRef<Latest<T>>(null as unknown as Latest<T>)
  latest.current = {
    props,
    model,
    setModel,
    emit,
    direction,
    rootDirection,
    reduced,
    options,
    initialLayout,
  }
  const [controller] = useState(() =>
    createController<T>(latest, store, bump as () => void, element, viewport),
  )

  const state = controller.state()
  const keys = props.items.map(props.getKey)
  const previousKeys = useRef(keys)

  useLayoutEffect(() => controller.mount(), [controller])
  useChange(model, value => controller.modelChanged(value))
  useChange(JSON.stringify(options), () => controller.optionsChanged())
  useLayoutEffect(() => {
    const before = previousKeys.current
    previousKeys.current = keys
    if (keys.length === before.length && keys.every((key, index) => key === before[index])) return
    controller.refresh()
  })
  useChange(props.autoplay, value => controller.autoplayChanged(value))
  useChange(reduced, value => {
    if (value === 'reduce') controller.pause()
  })

  const controls: CarouselControls = {
    ...state,
    prev: controller.prev,
    next: controller.next,
    scrollTo: controller.scrollTo,
    play: controller.play,
    pause: controller.pause,
  }

  return {
    element,
    viewport,
    rootDirection,
    ready: store.ready,
    initialIndex: store.ready ? undefined : initialLayout?.index,
    visibilityKnown: store.visibilityKnown || !!initialLayout,
    state,
    controls,
    requested: store.requested,
    keydown: controller.keydown,
    focusIn: controller.focusIn,
    rotationPointerDown: controller.rotationPointerDown,
    toggleRotation: controller.toggleRotation,
    refresh: controller.refresh,
    controller,
  }
}
