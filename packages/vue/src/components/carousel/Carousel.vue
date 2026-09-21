<script setup lang="ts" generic="T">
  import { computed, useId } from 'vue'
  import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Pause, Play } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import IconButton from '../icon-button/IconButton.vue'
  import Button from '../button/Button.vue'
  import { useCarousel } from './composables/useCarousel'
  import {
    carousel,
    carouselViewport,
    carouselTrack,
    carouselItem,
    carouselControls,
    carouselIndicators,
    carouselIndicator,
    carouselDot,
    carouselStatus,
  } from './carousel.variants'
  import type {
    CarouselProps,
    CarouselItemSlot,
    CarouselControls,
    CarouselState,
    CarouselIndicatorsSlot,
    CarouselIndicatorSlot,
  } from './types'

  defineOptions({ name: 'HnCarousel' })
  const props = withDefaults(defineProps<Omit<CarouselProps<T>, 'index'>>(), {
    orientation: 'horizontal',
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    draggable: true,
    arrows: true,
    gap: 'md',
  })
  const model = defineModel<number>('index')
  const emit = defineEmits<{ select: [state: CarouselState]; ready: [state: CarouselState] }>()
  const slots = defineSlots<{
    default(props: CarouselItemSlot<T>): unknown
    controls?(props: CarouselControls): unknown
    indicators?(props: CarouselIndicatorsSlot): unknown
    indicator?(props: CarouselIndicatorSlot): unknown
    pending?(): unknown
    empty?(): unknown
  }>()
  const t = useUiLocale()
  const id = useId()
  const {
    element,
    viewport,
    rootDirection,
    ready,
    initialIndex,
    visibilityKnown,
    state,
    controls,
    requested,
    hovering,
    keydown,
    focusIn,
    rotationPointerDown,
    toggleRotation,
    refresh,
  } = useCarousel(props, model, (event, state) => {
    if (event === 'ready') emit('ready', state)
    else emit('select', state)
  })
  const pending = computed(() => !!slots.pending && props.items.length > 0 && !ready.value)
  const showIndicators = () => props.indicators || !!slots.indicators || !!slots.indicator
  const inView = (index: number) =>
    !visibilityKnown.value || state.value.visibleItems.includes(index)
  defineExpose({
    element,
    viewport,
    state,
    prev: () => controls.value.prev(),
    next: () => controls.value.next(),
    scrollTo: (index: number, instant?: boolean) => controls.value.scrollTo(index, instant),
    play: () => controls.value.play(),
    pause: () => controls.value.pause(),
    refresh,
  })
</script>

<template>
  <div
    ref="element"
    role="region"
    :aria-label="props.label ?? t.carousel.label"
    :aria-roledescription="t.carousel.role"
    :aria-busy="pending"
    :dir="rootDirection"
    data-hn-carousel
    :data-ready="ready ? '' : undefined"
    :data-initial-index="initialIndex"
    :data-orientation="props.orientation"
    :class="cn(carousel({ gap: props.gap }), props.class)"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @focusin="focusIn"
  >
    <div v-if="props.autoplay && props.items.length > 1" class="mb-2 flex justify-end">
      <Button
        size="sm"
        variant="ghost"
        tone="neutral"
        :disabled="!ready || state.snapCount < 2"
        data-hn-carousel-rotation
        :aria-controls="id"
        @pointerdown="rotationPointerDown"
        @click="toggleRotation"
      >
        <template #icon>
          <Pause v-if="requested" />
          <Play v-else />
        </template>
        {{ requested ? t.carousel.pause : t.carousel.play }}
      </Button>
    </div>
    <div class="hn-carousel-stage relative min-w-0">
      <div
        v-show="props.items.length"
        :id="id"
        ref="viewport"
        tabindex="0"
        data-hn-carousel-viewport
        :data-pending="pending ? '' : undefined"
        :aria-hidden="pending || undefined"
        :inert="pending || undefined"
        :class="cn(carouselViewport(), props.viewportClass)"
        @keydown="keydown"
      >
        <div :class="carouselTrack()" :style="{ '--hn-carousel-initial-index': initialIndex }">
          <div
            v-for="(item, index) in props.items"
            :key="props.getKey(item, index)"
            role="group"
            :aria-roledescription="t.carousel.slide"
            :aria-label="t.carousel.position(index + 1, props.items.length)"
            :aria-hidden="!inView(index) || undefined"
            :inert="!inView(index) || undefined"
            :data-visible="inView(index) ? '' : undefined"
            data-hn-carousel-item
            :class="
              cn(
                carouselItem(),
                typeof props.itemClass === 'function'
                  ? props.itemClass(item, index)
                  : props.itemClass,
              )
            "
          >
            <slot :item="item" :index="index" :is-visible="inView(index)" :ready="ready" />
          </div>
        </div>
      </div>
      <div v-if="pending" data-hn-carousel-pending role="status" :aria-label="t.common.loading">
        <slot name="pending" />
      </div>
    </div>
    <div v-if="!props.items.length" :class="carouselStatus()">
      <slot name="empty">{{ t.carousel.empty }}</slot>
    </div>
    <div v-else-if="props.arrows || showIndicators() || slots.controls" :class="carouselControls()">
      <slot name="controls" v-bind="controls">
        <IconButton
          v-if="props.arrows"
          variant="soft"
          size="sm"
          pill
          :label="t.carousel.prev"
          :disabled="!state.canPrev"
          :aria-controls="id"
          @click="controls.prev"
        >
          <ChevronUp v-if="props.orientation === 'vertical'" />
          <ChevronLeft v-else class="rtl:rotate-180" />
        </IconButton>
        <div
          v-if="showIndicators()"
          data-hn-carousel-indicators
          role="group"
          :aria-label="t.carousel.choose"
          :class="carouselIndicators({ custom: !!slots.indicator || !!slots.indicators })"
        >
          <slot name="indicators" v-bind="controls" :viewport-id="id">
            <button
              v-for="(_, index) in state.snapCount"
              :key="index"
              type="button"
              data-hn-carousel-indicator
              :data-active="index === state.index ? '' : undefined"
              :aria-label="t.carousel.goTo(index + 1)"
              :aria-controls="id"
              :aria-disabled="index === state.index || undefined"
              :class="carouselIndicator({ custom: !!slots.indicator })"
              @click="index !== state.index && controls.scrollTo(index)"
            >
              <slot
                name="indicator"
                :index="index"
                :active="index === state.index"
                :snap-count="state.snapCount"
              >
                <span
                  aria-hidden="true"
                  :data-current="index === state.index ? '' : undefined"
                  :class="carouselDot()"
                />
              </slot>
            </button>
          </slot>
        </div>
        <IconButton
          v-if="props.arrows"
          variant="soft"
          size="sm"
          pill
          :label="t.carousel.next"
          :disabled="!state.canNext"
          :aria-controls="id"
          @click="controls.next"
        >
          <ChevronDown v-if="props.orientation === 'vertical'" />
          <ChevronRight v-else class="rtl:rotate-180" />
        </IconButton>
      </slot>
    </div>
    <span class="sr-only" :aria-live="state.playing ? 'off' : 'polite'" aria-atomic="true">
      {{ state.snapCount ? t.carousel.position(state.index + 1, state.snapCount) : '' }}
    </span>
  </div>
</template>
