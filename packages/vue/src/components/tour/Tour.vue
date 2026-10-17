<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    shallowRef,
    useId,
    watch,
    watchEffect,
  } from 'vue'
  import { RotateCcw } from '@lucide/vue'
  import {
    beaconPoint,
    clampTourStep,
    hideOutsideTour,
    listenTourKeys,
    runTourChange,
    spotlightMask,
    spotlightShape,
    TOUR_ARROW_HEIGHT,
    TOUR_ARROW_PADDING,
    TOUR_ARROW_PATH,
    TOUR_ARROW_WIDTH,
    TOUR_SIDE_OFFSET,
    tourBeaconOnArrival,
    tourKeyAction,
    tourOwnsInput,
    tourPageBlocked,
    tourReference,
    tourTargetBlocked,
    trapTourFocus,
    type TourCloseReason,
    type TourPointerKind,
    type TourSpotlight,
  } from '../../../../shared/src/lib/tour'
  import { createTourEngine } from '../../../../shared/src/lib/tour-engine'
  import { addBranch } from '../../../../shared/src/primitives/dismissable-layer'
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
  import IconButton from '../icon-button/IconButton.vue'
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
    tourKey,
    tourKeyCap,
    tourMask,
    tourPointer,
    tourPointerArrow,
    tourPointerTouch,
  } from './tour.variants'
  import type { TourExpose, TourProps, TourSlotProps, TourStep } from './types'

  defineOptions({ name: 'HnTour' })

  const props = withDefaults(defineProps<TourProps>(), {
    mask: true,
    blockTarget: false,
    blockPage: false,
    pointer: 'auto',
  })
  const emit = defineEmits<{
    finish: []
    skip: []
    close: [reason: TourCloseReason]
    stepEnter: [step: number]
    stepLeave: [step: number]
  }>()
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
  const entered = ref<number | null>(null)
  const coarse = ref(false)

  const pointerKind = computed<TourPointerKind>(() =>
    props.pointer === 'auto' ? (coarse.value ? 'touch' : 'mouse') : props.pointer,
  )

  const card = shallowRef<{ $el: HTMLElement } | null>(null)
  const layer = shallowRef<{ $el: HTMLElement } | null>(null)
  const beaconButton = shallowRef<HTMLButtonElement | null>(null)
  const maskElement = shallowRef<HTMLElement | null>(null)
  const blockerElement = shallowRef<HTMLElement | null>(null)
  const pointerElement = shallowRef<HTMLElement | null>(null)
  const keyElement = shallowRef<HTMLElement | null>(null)

  const engine = createTourEngine({
    pointer: () => pointerElement.value,
    keyBadge: () => keyElement.value,
    pointerKind: () => pointerKind.value,
  })
  const tour = shallowRef(engine.getState())
  const unsubscribe = engine.subscribe(() => (tour.value = engine.getState()))

  const active = computed(() => open.value && total.value > 0)
  const engaged = computed(() => active.value && entered.value !== null)
  const live = computed(() => engaged.value && entered.value === current.value)
  const status = computed(() => (engaged.value ? tour.value.status : 'idle'))
  const beaconVisible = computed(
    () => live.value && status.value === 'ready' && !!tour.value.hole && beaconPending.value,
  )
  const cardVisible = computed(
    () =>
      live.value &&
      (status.value === 'ready' || status.value === 'missing') &&
      tour.value.settled &&
      !beaconVisible.value,
  )
  let anchoredWhenShown = false
  const anchored = computed(() => {
    if (!cardVisible.value) return anchoredWhenShown
    anchoredWhenShown = status.value === 'ready' && !!tour.value.hole
    return anchoredWhenShown
  })
  const maskVisible = computed(
    () =>
      !!props.mask &&
      status.value !== 'idle' &&
      !beaconVisible.value &&
      !(beaconPending.value && status.value === 'waiting'),
  )
  const modal = computed(() => !!props.mask)
  const scripted = computed(() => !!currentStep.value.play)
  const blocked = computed(() => tourTargetBlocked(currentStep.value, props.blockTarget))
  const pageBlocked = computed(
    () => engaged.value && tourPageBlocked(currentStep.value, props.blockPage),
  )
  const blocking = computed(() => cardVisible.value && !!tour.value.hole && blocked.value)
  const targetElements = computed(() => tour.value.elements)

  const spotlight = computed(() =>
    tour.value.hole
      ? spotlightShape(tour.value.viewport, tour.value.hole, tour.value.radius)
      : null,
  )
  const lastSpotlight = shallowRef<TourSpotlight | null>(null)
  const spotlightState = computed(() => spotlightMask(spotlight.value, lastSpotlight.value))
  const blockerStyle = computed(() => {
    if (pageBlocked.value) return { left: '0px', top: '0px', width: '100%', height: '100%' }
    const hole = tour.value.hole
    if (!blocking.value || !hole) return undefined
    return {
      left: `${hole.x}px`,
      top: `${hole.y}px`,
      width: `${hole.width}px`,
      height: `${hole.height}px`,
    }
  })
  const beaconStyle = computed(() => {
    if (!tour.value.targetRect) return undefined
    const point = beaconPoint(tour.value.targetRect, direction.value)
    return { left: `${point.x}px`, top: `${point.y}px` }
  })
  const reference = tourReference(() => engine.getState().hole)

  let returnFocus: HTMLElement | null = null
  let closeReason: TourCloseReason | null = null
  let navigated = false
  let refocusBeacon = false
  const mounted = ref(false)

  function enterStep() {
    if (!mounted.value) return
    if (!active.value) {
      if (entered.value !== null) exitTour()
      return
    }
    if (entered.value === current.value) return
    const previous = entered.value
    refocusBeacon = !!card.value?.$el.contains(document.activeElement)
    if (previous !== null) {
      engine.leave()
      emit('stepLeave', previous)
    } else {
      returnFocus = document.activeElement as HTMLElement | null
      closeReason = null
    }
    beaconPending.value = tourBeaconOnArrival(
      currentStep.value,
      !!props.beacon,
      previous !== null && navigated,
    )
    navigated = false
    const number = current.value
    entered.value = number
    emit('stepEnter', number)
    void engine.enter(currentStep.value, number).then(result => {
      if (result === 'missing' && entered.value === number)
        devWarn('Tour', `the target of step ${number} was not found; the card is centered`)
    })
    if (!beaconPending.value) engine.play()
  }

  function exitTour() {
    const previous = entered.value
    entered.value = null
    engine.close()
    lastSpotlight.value = null
    if (previous !== null) emit('stepLeave', previous)
    emit('close', closeReason ?? 'close')
    closeReason = null
    void nextTick(restoreFocus)
  }

  watch([active, current], enterStep, { flush: 'post' })

  onMounted(() => {
    mounted.value = true
    coarse.value = !!window.matchMedia?.('(pointer: coarse)').matches
    enterStep()
  })

  onBeforeUnmount(() => {
    unsubscribe()
    engine.close()
  })

  watch([spotlight, maskVisible], ([value, visible]) => {
    if (value && visible) lastSpotlight.value = value
  })

  watch(targetElements, elements => {
    root.value = elements[0] ?? document.documentElement
  })

  watch(cardVisible, visible => {
    if (visible) void nextTick(() => card.value?.$el.focus({ preventScroll: true }))
  })

  watch(beaconVisible, visible => {
    if (!visible || !refocusBeacon) return
    refocusBeacon = false
    void nextTick(() => beaconButton.value?.focus())
  })

  function useBranch(element: () => HTMLElement | null | undefined) {
    watch(
      element,
      (node, _, onCleanup) => {
        if (node) onCleanup(addBranch(node))
      },
      { immediate: true, flush: 'post' },
    )
  }

  useBranch(() => layer.value?.$el)
  useBranch(() => maskElement.value)
  useBranch(() => blockerElement.value)
  useBranch(() => beaconButton.value)

  const owns = () => tourOwnsInput(layer.value?.$el, scripted.value || pageBlocked.value)

  watchEffect(
    onCleanup => {
      if (!cardVisible.value || !modal.value) return
      const layerElement = layer.value?.$el as HTMLElement | undefined
      if (!layerElement?.isConnected) return
      const reachable = !blocked.value && !pageBlocked.value
      const elements = targetElements.value
      onCleanup(hideOutsideTour([layerElement, ...elements]))
      onCleanup(trapTourFocus(() => [card.value?.$el, ...(reachable ? elements : [])], owns))
    },
    { flush: 'post' },
  )

  watchEffect(onCleanup => {
    if (!engaged.value || beaconVisible.value) return
    onCleanup(listenTourKeys(onKeydown))
  })

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
    closeReason = 'finish'
    open.value = false
  }

  function skip(reason: 'skip' | 'escape' = 'skip') {
    if (busy.value) return
    emit('skip')
    closeReason = reason
    open.value = false
  }

  function close() {
    closeReason = 'close'
    open.value = false
  }

  function replay() {
    if (live.value && !beaconPending.value) engine.replay()
  }

  function openBeacon() {
    beaconPending.value = false
    engine.play()
  }

  function preventDismiss(event: Event) {
    event.preventDefault()
  }

  function onKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || !owns()) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      if (!props.locked) skip('escape')
      return
    }
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
    playing: tour.value.playing,
    next: () => void next(),
    prev: () => void prev(),
    skip: () => skip(),
    replay,
  }))

  const popperProps = computed(() =>
    anchored.value
      ? {
          asChild: true,
          reference,
          side: currentStep.value.side ?? 'bottom',
          align: currentStep.value.align ?? 'center',
          sideOffset: TOUR_SIDE_OFFSET,
          collisionPadding: 16,
          arrowPadding: TOUR_ARROW_PADDING,
          prioritizePosition: true,
          sticky: 'always' as const,
          updatePositionStrategy: 'always' as const,
        }
      : {
          class: cn(tourCentered(), 'hn-anim-pop'),
          'data-state': cardVisible.value ? 'open' : 'closed',
        },
  )

  defineExpose<TourExpose>({ next, prev, goTo, close, replay })
</script>

<template>
  <TeleportPrimitive v-if="total > 0">
    <div
      ref="blockerElement"
      data-hn-tour-blocker
      aria-hidden="true"
      :hidden="!blockerStyle"
      :class="tourBlocker()"
      :style="blockerStyle"
    />
    <div
      ref="pointerElement"
      data-hn-tour-pointer
      :data-kind="pointerKind"
      data-state="hidden"
      aria-hidden="true"
      :class="tourPointer()"
    >
      <span data-hn-tour-pointer-ring />
      <span data-hn-tour-pointer-ripples />
      <svg
        v-if="pointerKind === 'mouse'"
        data-hn-tour-pointer-glyph
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke-linejoin="round"
        :class="tourPointerArrow()"
      >
        <path d="M4 2.5v16.2l4.1-3.9 2.8 6.6 2.9-1.2-2.8-6.5h5.8z" />
      </svg>
      <span v-else data-hn-tour-pointer-glyph :class="tourPointerTouch()" />
    </div>
    <div
      ref="keyElement"
      data-hn-tour-key
      data-state="hidden"
      aria-hidden="true"
      :class="tourKey()"
    >
      <kbd data-hn-tour-key-label :class="tourKeyCap()" />
    </div>
    <Presence :present="maskVisible">
      <div
        ref="maskElement"
        data-hn-tour-mask
        aria-hidden="true"
        :data-state="maskVisible ? 'open' : 'closed'"
        :data-mask="props.mask === 'dim' ? 'dim' : undefined"
        :data-hn-tour-hole="spotlightState.hole"
        :class="tourMask()"
        :style="spotlightState.style"
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
      @click="openBeacon"
    >
      <span :class="tourBeaconPulse()" />
      <span :class="tourBeaconDot()" />
    </button>
    <PopperRoot>
      <Presence :present="cardVisible">
        <DismissableLayer
          ref="layer"
          as-child
          @escape-key-down="preventDismiss"
          @pointer-down-outside="preventDismiss"
          @focus-outside="preventDismiss"
        >
          <component :is="anchored ? PopperContent : 'div'" v-bind="popperProps">
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
              :class="cn(tourCard(), anchored && 'hn-anim-pop', props.class)"
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
                  @click="skip()"
                />
              </div>
              <div v-if="currentStep.description || $slots.content" :id="descriptionId">
                <slot name="content" v-bind="slotProps">
                  <Text tone="muted" size="sm">{{ currentStep.description }}</Text>
                </slot>
              </div>
              <PopperArrow
                v-if="anchored"
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
                  <IconButton
                    v-if="scripted"
                    data-hn-tour-replay
                    :label="props.replayText ?? t.tour.replay"
                    :tooltip="false"
                    size="sm"
                    variant="ghost"
                    tone="neutral"
                    pill
                    @click="replay"
                  >
                    <RotateCcw />
                  </IconButton>
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
