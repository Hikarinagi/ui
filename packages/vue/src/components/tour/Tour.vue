<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, shallowRef, useId, watch, watchEffect } from 'vue'
  import {
    beaconPoint,
    clampTourStep,
    hideOutsideTour,
    resolveTourTarget,
    revealTourTarget,
    runTourChange,
    spotlightPath,
    spotlightRect,
    TOUR_ARROW_HEIGHT,
    TOUR_ARROW_PADDING,
    TOUR_ARROW_PATH,
    TOUR_ARROW_WIDTH,
    TOUR_PADDING,
    TOUR_RADIUS,
    TOUR_SIDE_OFFSET,
    tourBeaconOnArrival,
    tourKeyAction,
    tourReference,
    tourTargetBlocked,
    trapTourFocus,
    watchTourTarget,
    type TourRect,
  } from '../../../../shared/src/lib/tour'
  import { DismissableLayer } from '../../primitives/dismissable-layer'
  import { PopperArrow, PopperContent, PopperRoot } from '../../primitives/popper'
  import { Presence } from '../../primitives/presence'
  import { Teleport as TeleportPrimitive } from '../../primitives/teleport'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useDirection } from '../../lib/useDirection'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Card from '../card/Card.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import Text from '../text/Text.vue'
  import {
    tourBeacon,
    tourBeaconDot,
    tourBeaconPulse,
    tourBlocker,
    tourCard,
    tourCentered,
    tourFooter,
    tourHeader,
    tourMask,
  } from './tour.variants'
  import type { TourExpose, TourProps, TourSlotProps, TourStep } from './types'

  defineOptions({ name: 'HnTour' })

  const props = withDefaults(defineProps<TourProps>(), { mask: true, blockTarget: false })
  const emit = defineEmits<{ finish: []; skip: [] }>()
  defineSlots<{
    content?(props: TourSlotProps): unknown
    footer?(props: TourSlotProps): unknown
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const step = defineModel<number>('step', { default: 1 })

  const t = useUiLocale()
  const titleId = useId()
  const descriptionId = useId()
  const { root, direction } = useDirection(() => props.dir)

  const total = computed(() => props.steps.length)
  const current = computed(() => clampTourStep(step.value, total.value))
  const currentStep = computed<TourStep>(() => props.steps[current.value - 1] ?? {})
  const isLast = computed(() => current.value >= total.value)
  const busy = ref(false)
  const beaconPending = ref(false)
  const resolvedFor = ref<number | null>(null)
  const target = shallowRef<HTMLElement | null>(null)
  const hole = ref<TourRect | null>(null)
  const targetRect = ref<TourRect | null>(null)
  const viewport = ref({ width: 0, height: 0 })

  const padding = computed(() => currentStep.value.padding ?? TOUR_PADDING)
  const active = computed(() => open.value && total.value > 0)
  const resolved = computed(() => active.value && resolvedFor.value !== null)
  const beaconVisible = computed(() => resolved.value && !!target.value && beaconPending.value)
  const cardVisible = computed(() => resolved.value && !beaconVisible.value)
  const maskVisible = computed(() => cardVisible.value && props.mask)
  const modal = computed(() => props.mask)
  const blocked = computed(() => tourTargetBlocked(currentStep.value, props.blockTarget))
  const blocking = computed(() => cardVisible.value && !!hole.value && blocked.value)

  const clipPath = computed(() =>
    spotlightPath(viewport.value, hole.value, currentStep.value.radius ?? TOUR_RADIUS),
  )
  const holeStyle = computed(() =>
    hole.value
      ? {
          left: `${hole.value.x}px`,
          top: `${hole.value.y}px`,
          width: `${hole.value.width}px`,
          height: `${hole.value.height}px`,
        }
      : undefined,
  )
  const beaconStyle = computed(() => {
    if (!targetRect.value) return undefined
    const point = beaconPoint(targetRect.value, direction.value)
    return { left: `${point.x}px`, top: `${point.y}px` }
  })
  const reference = computed(() =>
    target.value ? tourReference(target.value, padding.value) : undefined,
  )

  const card = shallowRef<{ $el: HTMLElement } | null>(null)
  const layer = shallowRef<{ $el: HTMLElement } | null>(null)
  const beaconButton = shallowRef<HTMLButtonElement | null>(null)
  let returnFocus: HTMLElement | null = null

  const mounted = ref(false)
  let navigated = false

  function resolveTarget() {
    if (!mounted.value || !active.value) return
    const definition = currentStep.value.target
    const element = resolveTourTarget(definition)
    if (definition && !element)
      devWarn('Tour', `the target of step ${current.value} was not found; the card is centered`)
    target.value = element
    root.value = element ?? document.documentElement
    resolvedFor.value = current.value
    if (element && currentStep.value.scroll !== false) revealTourTarget(element)
  }

  watch([active, current, () => props.steps], resolveTarget, { flush: 'post' })

  onMounted(() => {
    mounted.value = true
    beaconPending.value = tourBeaconOnArrival(currentStep.value, !!props.beacon, false)
    resolveTarget()
    if (!active.value) return
    returnFocus = document.activeElement as HTMLElement | null
    void nextTick(() => {
      if (cardVisible.value) card.value?.$el.focus({ preventScroll: true })
    })
  })

  watch([active, current], ([isActive], [wasActive]) => {
    const focusInCard = !!card.value?.$el.contains(document.activeElement)
    beaconPending.value = tourBeaconOnArrival(
      currentStep.value,
      !!props.beacon,
      !!isActive && !!wasActive && navigated,
    )
    navigated = false
    if (!isActive) resolvedFor.value = null
    if (isActive && !wasActive) returnFocus = document.activeElement as HTMLElement | null
    if (!isActive && wasActive) void nextTick(restoreFocus)
    if (isActive && wasActive && focusInCard)
      void nextTick(() => {
        if (beaconVisible.value) beaconButton.value?.focus()
      })
  })

  watch(cardVisible, visible => {
    if (visible) void nextTick(() => card.value?.$el.focus({ preventScroll: true }))
  })

  watchEffect(onCleanup => {
    const element = target.value
    if (!mounted.value || !active.value) return
    const update = () => {
      viewport.value = { width: window.innerWidth, height: window.innerHeight }
      if (!element) {
        hole.value = null
        targetRect.value = null
        return
      }
      const rect = element.getBoundingClientRect()
      targetRect.value = spotlightRect(rect, 0)
      hole.value = spotlightRect(rect, padding.value)
    }
    if (!element) {
      update()
      window.addEventListener('resize', update)
      onCleanup(() => window.removeEventListener('resize', update))
      return
    }
    onCleanup(watchTourTarget(element, update))
  })

  watchEffect(
    onCleanup => {
      if (!cardVisible.value || !modal.value) return
      const layerElement = layer.value?.$el as HTMLElement | undefined
      if (!layerElement?.isConnected) return
      const reachable = !blocked.value
      const element = target.value
      onCleanup(hideOutsideTour([layerElement, element]))
      onCleanup(
        trapTourFocus(
          () => [card.value?.$el, reachable ? element : null],
          () => layer.value?.$el,
        ),
      )
    },
    { flush: 'post' },
  )

  function restoreFocus() {
    const focus = returnFocus
    returnFocus = null
    if (!focus?.isConnected) return
    const focused = document.activeElement
    if (!focused || focused === document.body || focused.closest('[data-hn-tour]'))
      focus.focus({ preventScroll: true })
  }

  async function goTo(value: number) {
    if (busy.value || !total.value) return
    const next = clampTourStep(value, total.value)
    if (next === current.value) return
    const allowed = await runTourChange(
      props.beforeChange,
      next,
      current.value,
      state => (busy.value = state),
    )
    if (!allowed) return
    navigated = true
    step.value = next
  }

  async function next() {
    if (busy.value) return
    if (isLast.value) {
      finish()
      return
    }
    await goTo(current.value + 1)
  }

  async function prev() {
    await goTo(current.value - 1)
  }

  function finish() {
    emit('finish')
    open.value = false
  }

  function skip() {
    if (busy.value) return
    emit('skip')
    open.value = false
  }

  function close() {
    open.value = false
  }

  function onEscape(event: KeyboardEvent) {
    if (props.locked || busy.value) event.preventDefault()
  }

  function preventDismiss(event: Event) {
    event.preventDefault()
  }

  function onKeydown(event: KeyboardEvent) {
    const action = tourKeyAction(event, direction.value)
    if (!action) return
    event.preventDefault()
    if (action === 'next') {
      if (!isLast.value) void next()
    } else if (current.value > 1) void prev()
  }

  const slotProps = computed<TourSlotProps>(() => ({
    step: currentStep.value,
    current: current.value,
    total: total.value,
    busy: busy.value,
    next: () => void next(),
    prev: () => void prev(),
    skip,
  }))

  const popperProps = computed(() =>
    target.value
      ? {
          asChild: true,
          reference: reference.value,
          side: currentStep.value.side ?? 'bottom',
          align: currentStep.value.align ?? 'center',
          sideOffset: TOUR_SIDE_OFFSET,
          collisionPadding: 16,
          arrowPadding: TOUR_ARROW_PADDING,
        }
      : {
          class: cn(tourCentered(), 'hn-anim-pop'),
          'data-state': cardVisible.value ? 'open' : 'closed',
        },
  )

  defineExpose<TourExpose>({ next, prev, goTo, close })
</script>

<template>
  <TeleportPrimitive v-if="total > 0">
    <div
      data-hn-tour-blocker
      aria-hidden="true"
      :hidden="!blocking"
      :class="tourBlocker()"
      :style="blocking ? holeStyle : undefined"
    />
    <Presence :present="maskVisible">
      <div
        data-hn-tour-mask
        aria-hidden="true"
        :data-state="maskVisible ? 'open' : 'closed'"
        :class="tourMask()"
        :style="{ clipPath }"
      />
    </Presence>
    <button
      v-if="beaconVisible"
      ref="beaconButton"
      type="button"
      data-hn-tour-beacon
      :aria-label="t.tour.beacon(current, currentStep.title ?? '')"
      :class="tourBeacon()"
      :style="beaconStyle"
      @click="beaconPending = false"
    >
      <span :class="tourBeaconPulse()" />
      <span :class="tourBeaconDot()" />
    </button>
    <PopperRoot>
      <Presence :present="cardVisible">
        <DismissableLayer
          ref="layer"
          as-child
          @escape-key-down="onEscape"
          @pointer-down-outside="preventDismiss"
          @focus-outside="preventDismiss"
          @dismiss="skip"
        >
          <component :is="target ? PopperContent : 'div'" v-bind="popperProps">
            <Card
              ref="card"
              data-hn-tour
              :data-step="current"
              :data-state="cardVisible ? 'open' : 'closed'"
              :padded="false"
              role="dialog"
              tabindex="-1"
              :dir="direction"
              :aria-modal="modal ? 'true' : undefined"
              :aria-labelledby="currentStep.title ? titleId : undefined"
              :aria-describedby="
                currentStep.description || $slots.content ? descriptionId : undefined
              "
              :aria-busy="busy || undefined"
              :class="cn(tourCard(), target && 'hn-anim-pop', props.class)"
              @keydown="onKeydown"
            >
              <div v-if="currentStep.title || !props.locked" :class="tourHeader()">
                <Text v-if="currentStep.title" :id="titleId" weight="medium" class="min-w-0 flex-1">
                  {{ currentStep.title }}
                </Text>
                <CloseButton
                  v-if="!props.locked"
                  data-hn-tour-skip
                  class="ms-auto -me-1.5 -mt-1.5"
                  :label="props.skipText ?? t.tour.skip"
                  :disabled="busy"
                  @click="skip"
                />
              </div>
              <div v-if="currentStep.description || $slots.content" :id="descriptionId">
                <slot name="content" v-bind="slotProps">
                  <Text tone="muted" size="sm">{{ currentStep.description }}</Text>
                </slot>
              </div>
              <PopperArrow
                v-if="target"
                data-hn-tour-arrow
                :width="TOUR_ARROW_WIDTH"
                :height="TOUR_ARROW_HEIGHT"
                class="overflow-visible"
              >
                <path :d="`${TOUR_ARROW_PATH}Z`" class="fill-surface" />
                <path
                  :d="TOUR_ARROW_PATH"
                  fill="none"
                  class="stroke-line"
                  vector-effect="non-scaling-stroke"
                />
              </PopperArrow>
              <slot name="footer" v-bind="slotProps">
                <div :class="tourFooter()">
                  <Text as="span" tone="muted" size="sm" class="tabular-nums">
                    {{ t.tour.progress(current, total) }}
                  </Text>
                  <div class="ms-auto flex gap-2">
                    <Button
                      v-if="current > 1"
                      data-hn-tour-prev
                      size="sm"
                      variant="soft"
                      tone="neutral"
                      :disabled="busy"
                      @click="prev"
                    >
                      {{ props.prevText ?? t.tour.prev }}
                    </Button>
                    <Button data-hn-tour-next size="sm" :loading="busy" @click="next">
                      {{
                        isLast
                          ? (props.finishText ?? t.tour.finish)
                          : (props.nextText ?? t.tour.next)
                      }}
                    </Button>
                  </div>
                </div>
              </slot>
            </Card>
          </component>
        </DismissableLayer>
      </Presence>
    </PopperRoot>
  </TeleportPrimitive>
</template>
