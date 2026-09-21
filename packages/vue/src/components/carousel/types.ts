import type { CarouselGap } from './carousel.variants'

export interface CarouselProps<T> {
  items: readonly T[]
  getKey: (item: T, index: number) => string | number
  index?: number
  label?: string
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
  align?: 'start' | 'center' | 'end'
  containScroll?: false | 'trimSnaps' | 'keepSnaps'
  slidesToScroll?: number | 'auto'
  loop?: boolean
  draggable?: boolean
  dragFree?: boolean
  autoplay?: boolean | number
  arrows?: boolean
  indicators?: boolean
  gap?: CarouselGap
  class?: string
  viewportClass?: string
  itemClass?: string | ((item: T, index: number) => string | undefined)
}

export interface CarouselItemSlot<T> {
  item: T
  index: number
  isVisible: boolean
  ready: boolean
}

export interface CarouselState {
  index: number
  snapCount: number
  canPrev: boolean
  canNext: boolean
  visibleItems: readonly number[]
  ready: boolean
  playing: boolean
}

export interface CarouselControls extends CarouselState {
  prev: () => void
  next: () => void
  scrollTo: (index: number, instant?: boolean) => void
  play: () => void
  pause: () => void
}

export interface CarouselIndicatorsSlot extends CarouselControls {
  viewportId: string
}

export interface CarouselIndicatorSlot {
  index: number
  active: boolean
  snapCount: number
}

export interface CarouselExpose {
  element: HTMLElement | undefined
  viewport: HTMLElement | undefined
  state: CarouselState
  prev: () => void
  next: () => void
  scrollTo: (index: number, instant?: boolean) => void
  play: () => void
  pause: () => void
  refresh: () => void
}
