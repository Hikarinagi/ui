'use client'

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from 'react'
import { RotateCcw } from 'lucide-react'
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
  type TourAlign,
  type TourBeforeChange,
  type TourCloseReason,
  type TourPlay,
  type TourPlayContext,
  type TourPoint,
  type TourPointer,
  type TourPointerKind,
  type TourRectLike,
  type TourSide,
  type TourSpotlight,
  type TourSpotlightOptions,
  type TourStepBase,
  type TourTarget,
  type TourTargetItem,
  type TourVirtualElement,
} from '../../../../shared/src/lib/tour'
import { createTourEngine } from '../../../../shared/src/lib/tour-engine'
import { addBranch } from '../../../../shared/src/primitives/dismissable-layer'
import { cn } from '../../lib/cn'
import { usePortalContainer, useConfig } from '../../lib/config'
import { devWarn } from '../../lib/dev'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { DismissableLayer } from '../../primitives/dismissable-layer'
import { PopperArrow, PopperContent, PopperRoot } from '../../primitives/popper'
import { Portal } from '../../primitives/portal'
import { Presence } from '../../primitives/presence'
import { useControllableState } from '../../primitives/utils/controllable-state'
import { Button } from '../button/Button'
import { Card } from '../card/Card'
import { CloseButton } from '../close-button/CloseButton'
import { IconButton } from '../icon-button/IconButton'
import { Text } from '../text/Text'
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

export type {
  TourAlign,
  TourBeforeChange,
  TourCloseReason,
  TourPlay,
  TourPlayContext,
  TourPoint,
  TourPointer,
  TourPointerKind,
  TourRectLike,
  TourSide,
  TourSpotlightOptions,
  TourTarget,
  TourTargetItem,
  TourVirtualElement,
}

export type TourStep = TourStepBase

const ReplayIcon = lucide(RotateCcw)

export interface TourSlotProps {
  step: TourStep
  current: number
  total: number
  busy: boolean
  playing: boolean
  next: () => void
  prev: () => void
  skip: () => void
  replay: () => void
}

export interface TourHandle {
  next: () => Promise<void>
  prev: () => Promise<void>
  goTo: (step: number) => Promise<void>
  close: () => void
  replay: () => void
}

export interface TourProps {
  steps: TourStep[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  mask?: boolean | 'dim'
  locked?: boolean
  beacon?: boolean
  blockTarget?: boolean
  blockPage?: boolean
  pointer?: 'auto' | TourPointerKind
  nextText?: string
  prevText?: string
  finishText?: string
  skipText?: string
  replayText?: string
  beforeChange?: TourBeforeChange
  dir?: 'ltr' | 'rtl'
  className?: string
  onFinish?: () => void
  onSkip?: () => void
  onClose?: (reason: TourCloseReason) => void
  onStepEnter?: (step: number) => void
  onStepLeave?: (step: number) => void
  renderContent?: (props: TourSlotProps) => ReactNode
  renderFooter?: (props: TourSlotProps) => ReactNode
  ref?: Ref<TourHandle>
}

function useBranch(element: HTMLElement | null) {
  useEffect(() => (element ? addBranch(element) : undefined), [element])
}

export function Tour({
  steps,
  open: openProp,
  defaultOpen,
  onOpenChange,
  step: stepProp,
  defaultStep,
  onStepChange,
  mask = true,
  locked = false,
  beacon = false,
  blockTarget = false,
  blockPage = false,
  pointer = 'auto',
  nextText,
  prevText,
  finishText,
  skipText,
  replayText,
  beforeChange,
  dir,
  className,
  onFinish,
  onSkip,
  onClose,
  onStepEnter,
  onStepLeave,
  renderContent,
  renderFooter,
  ref,
}: TourProps) {
  const [open = false, setOpen] = useControllableState<boolean | undefined>({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: value => {
      if (value !== undefined) onOpenChange?.(value)
    },
    caller: 'Tour',
  })
  const [step = 1, setStep] = useControllableState<number | undefined>({
    prop: stepProp,
    defaultProp: defaultStep ?? 1,
    onChange: value => {
      if (value !== undefined) onStepChange?.(value)
    },
    caller: 'Tour',
  })
  const t = useUiLocale()
  const config = useConfig()
  const container = usePortalContainer()
  const titleId = useId()
  const descriptionId = useId()

  const total = steps.length
  const current = clampTourStep(step, total)
  const currentStep: TourStep = steps[current - 1] ?? {}
  const isLast = current >= total
  const [busy, setBusyState] = useState(false)
  const busyRef = useRef(false)
  const setBusy = useCallback((value: boolean) => {
    busyRef.current = value
    setBusyState(value)
  }, [])
  const [beaconPending, setBeaconPending] = useState(false)
  const [entered, setEntered] = useState<number | null>(null)
  const [coarse, setCoarse] = useState(false)
  const [inherited, setInherited] = useState<'ltr' | 'rtl'>('ltr')
  const [lastSpotlight, setLastSpotlight] = useState<TourSpotlight | null>(null)
  const direction = dir ?? config?.dir ?? inherited
  const pointerKind: TourPointerKind = pointer === 'auto' ? (coarse ? 'touch' : 'mouse') : pointer

  const pointerRef = useRef<HTMLDivElement | null>(null)
  const keyRef = useRef<HTMLDivElement | null>(null)
  const kindRef = useRef(pointerKind)
  kindRef.current = pointerKind
  const [engine] = useState(() =>
    createTourEngine({
      pointer: () => pointerRef.current,
      keyBadge: () => keyRef.current,
      pointerKind: () => kindRef.current,
    }),
  )
  const tour = useSyncExternalStore(engine.subscribe, engine.getState, engine.getState)

  const active = open && total > 0
  const engaged = active && entered !== null
  const live = engaged && entered === current
  const status = engaged ? tour.status : 'idle'
  const beaconVisible = live && status === 'ready' && !!tour.hole && beaconPending
  const cardVisible =
    live && (status === 'ready' || status === 'missing') && tour.settled && !beaconVisible
  const maskVisible =
    !!mask && status !== 'idle' && !beaconVisible && !(beaconPending && status === 'waiting')
  const modal = !!mask
  const scripted = !!currentStep.play
  const blocked = tourTargetBlocked(currentStep, blockTarget)
  const pageBlocked = engaged && tourPageBlocked(currentStep, blockPage)
  const blocking = cardVisible && !!tour.hole && blocked
  const targetElements = tour.elements
  const anchoredRef = useRef(false)
  if (cardVisible) anchoredRef.current = status === 'ready' && !!tour.hole
  const anchored = anchoredRef.current

  const cardRef = useRef<HTMLElement | null>(null)
  const layerRef = useRef<HTMLElement | null>(null)
  const [cardElement, setCardElement] = useState<HTMLElement | null>(null)
  const [layerElement, setLayerElement] = useState<HTMLElement | null>(null)
  const [maskElement, setMaskElement] = useState<HTMLElement | null>(null)
  const [blockerElement, setBlockerElement] = useState<HTMLElement | null>(null)
  const [beaconElement, setBeaconElement] = useState<HTMLElement | null>(null)
  const beaconRef = useRef<HTMLButtonElement | null>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const refocusBeacon = useRef(false)
  const navigated = useRef(false)
  const enteredRef = useRef<number | null>(null)
  const closeReason = useRef<TourCloseReason | null>(null)
  const latest = useRef({ currentStep, beacon, onStepEnter, onStepLeave, onClose })
  latest.current = { currentStep, beacon, onStepEnter, onStepLeave, onClose }

  const attachCard = useCallback((node: HTMLElement | null) => {
    cardRef.current = node
    setCardElement(node)
  }, [])
  const attachBeacon = useCallback((node: HTMLButtonElement | null) => {
    beaconRef.current = node
    setBeaconElement(node)
    if (!node || !refocusBeacon.current) return
    refocusBeacon.current = false
    node.focus()
  }, [])
  const attachLayer = useCallback((node: HTMLElement | null) => {
    layerRef.current = node
    setLayerElement(node)
  }, [])

  useBranch(layerElement)
  useBranch(maskElement)
  useBranch(blockerElement)
  useBranch(beaconElement)

  useEffect(() => {
    setCoarse(!!window.matchMedia?.('(pointer: coarse)').matches)
  }, [])

  useEffect(() => () => engine.close(), [engine])

  useLayoutEffect(() => {
    const previous = enteredRef.current
    const { currentStep: definition, onStepEnter, onStepLeave, onClose } = latest.current
    if (!active) {
      if (previous === null) return
      enteredRef.current = null
      setEntered(null)
      engine.close()
      setLastSpotlight(null)
      onStepLeave?.(previous)
      onClose?.(closeReason.current ?? 'close')
      closeReason.current = null
      return
    }
    if (previous === current) return
    refocusBeacon.current = !!cardRef.current?.contains(document.activeElement)
    if (previous !== null) {
      engine.leave()
      onStepLeave?.(previous)
    } else {
      returnFocus.current = document.activeElement as HTMLElement | null
      closeReason.current = null
    }
    const pending = tourBeaconOnArrival(
      definition,
      latest.current.beacon,
      previous !== null && navigated.current,
    )
    navigated.current = false
    setBeaconPending(pending)
    enteredRef.current = current
    setEntered(current)
    onStepEnter?.(current)
    void engine.enter(definition, current).then(result => {
      if (result === 'missing' && enteredRef.current === current)
        devWarn('Tour', `the target of step ${current} was not found; the card is centered`)
    })
    if (!pending) engine.play()
  }, [active, current, engine])

  useEffect(() => {
    if (active) return
    const focus = returnFocus.current
    returnFocus.current = null
    if (!focus?.isConnected) return
    const focused = document.activeElement
    if (!focused || focused === document.body || focused.closest('[data-hn-tour]'))
      focus.focus({ preventScroll: true })
  }, [active])

  useEffect(() => {
    if (!cardVisible || !cardElement) return
    refocusBeacon.current = false
    cardElement.focus({ preventScroll: true })
  }, [cardVisible, cardElement])

  useLayoutEffect(() => {
    const [first] = targetElements
    setInherited(
      getComputedStyle(first ?? document.documentElement).direction === 'rtl' ? 'rtl' : 'ltr',
    )
  }, [targetElements])

  const radius = tour.radius
  const spotlight = tour.hole ? spotlightShape(tour.viewport, tour.hole, radius) : null
  const shape = spotlight?.shape
  useLayoutEffect(() => {
    if (spotlight && maskVisible) setLastSpotlight(spotlight)
  }, [shape, maskVisible])
  const spotlightState = spotlightMask(spotlight, lastSpotlight)

  const owns = useRef<() => boolean>(() => false)
  owns.current = () => tourOwnsInput(layerRef.current, scripted || pageBlocked)

  const reachable = !blocked && !pageBlocked
  useEffect(() => {
    if (!cardVisible || !modal) return
    const layer = layerElement
    if (!layer?.isConnected) return
    const restore = hideOutsideTour([layer, ...targetElements])
    const release = trapTourFocus(
      () => [cardRef.current, ...(reachable ? targetElements : [])],
      () => owns.current(),
    )
    return () => {
      release()
      restore()
    }
  }, [cardVisible, modal, targetElements, reachable, layerElement])

  const goTo = useCallback(
    async (value: number) => {
      if (busyRef.current || !total) return
      const next = clampTourStep(value, total)
      if (next === current) return
      const allowed = await runTourChange(beforeChange, next, current, setBusy)
      if (!allowed) return
      navigated.current = true
      setStep(next)
    },
    [beforeChange, current, setBusy, setStep, total],
  )

  const finish = useCallback(() => {
    onFinish?.()
    closeReason.current = 'finish'
    setOpen(false)
  }, [onFinish, setOpen])

  const next = useCallback(async () => {
    if (busyRef.current) return
    if (isLast) {
      finish()
      return
    }
    await goTo(current + 1)
  }, [current, finish, goTo, isLast])

  const prev = useCallback(() => goTo(current - 1), [current, goTo])

  const skip = useCallback(
    (reason: 'skip' | 'escape' = 'skip') => {
      if (busyRef.current) return
      onSkip?.()
      closeReason.current = reason
      setOpen(false)
    },
    [onSkip, setOpen],
  )

  const close = useCallback(() => {
    closeReason.current = 'close'
    setOpen(false)
  }, [setOpen])

  const replayable = useRef(false)
  replayable.current = live && !beaconPending
  const replay = useCallback(() => {
    if (replayable.current) engine.replay()
  }, [engine])

  useImperativeHandle(ref, () => ({ next, prev, goTo, close, replay }), [
    next,
    prev,
    goTo,
    close,
    replay,
  ])

  const keyHandler = useRef<(event: KeyboardEvent) => void>(() => {})
  keyHandler.current = (event: KeyboardEvent) => {
    if (event.defaultPrevented || !owns.current()) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      if (!locked) skip('escape')
      return
    }
    const action = tourKeyAction(event, direction)
    if (!action) return
    event.preventDefault()
    if (action === 'next') {
      if (!isLast) void next()
    } else if (current > 1) void prev()
  }

  useEffect(() => {
    if (!engaged || beaconVisible) return
    return listenTourKeys(event => keyHandler.current(event))
  }, [engaged, beaconVisible])

  const slotProps: TourSlotProps = {
    step: currentStep,
    current,
    total,
    busy,
    playing: tour.playing,
    next: () => void next(),
    prev: () => void prev(),
    skip: () => skip(),
    replay,
  }

  const [reference] = useState(() => tourReference(() => engine.getState().hole))
  const point = tour.targetRect ? beaconPoint(tour.targetRect, direction) : null
  const hasBody = !!currentStep.description || !!renderContent
  const hole = tour.hole
  const blockerStyle: CSSProperties | undefined = pageBlocked
    ? { left: '0px', top: '0px', width: '100%', height: '100%' }
    : blocking && hole
      ? {
          left: `${hole.x}px`,
          top: `${hole.y}px`,
          width: `${hole.width}px`,
          height: `${hole.height}px`,
        }
      : undefined

  if (total === 0) return null

  const card = (
    <Card
      ref={attachCard}
      data-hn-tour=""
      data-step={current}
      data-state={cardVisible ? 'open' : 'closed'}
      padded={false}
      role="dialog"
      tabIndex={-1}
      dir={direction}
      aria-modal={modal ? 'true' : undefined}
      aria-labelledby={currentStep.title ? titleId : undefined}
      aria-describedby={hasBody ? descriptionId : undefined}
      aria-busy={busy || undefined}
      className={cn(tourCard(), anchored && 'hn-anim-pop', className)}
    >
      {(currentStep.title || !locked) && (
        <div className={tourHeader()}>
          {currentStep.title && (
            <Text id={titleId} weight="medium" className="min-w-0 flex-1">
              {currentStep.title}
            </Text>
          )}
          {!locked && (
            <CloseButton
              data-hn-tour-skip=""
              className="ms-auto -me-1.5 -mt-1.5"
              label={skipText ?? t.tour.skip}
              disabled={busy}
              onClick={() => skip()}
            />
          )}
        </div>
      )}
      {hasBody && (
        <div id={descriptionId}>
          {renderContent ? (
            renderContent(slotProps)
          ) : (
            <Text tone="muted" size="sm">
              {currentStep.description}
            </Text>
          )}
        </div>
      )}
      {anchored ? (
        <PopperArrow
          data-hn-tour-arrow=""
          width={TOUR_ARROW_WIDTH}
          height={TOUR_ARROW_HEIGHT}
          className="overflow-visible"
        >
          <path d={`${TOUR_ARROW_PATH}Z`} className="fill-surface" />
          <path
            d={TOUR_ARROW_PATH}
            fill="none"
            className="stroke-line"
            vectorEffect="non-scaling-stroke"
          />
        </PopperArrow>
      ) : null}
      {renderFooter ? (
        renderFooter(slotProps)
      ) : (
        <div className={tourFooter()}>
          <Text as="span" tone="muted" size="sm" className="tabular-nums">
            {t.tour.progress(current, total)}
          </Text>
          {scripted && (
            <IconButton
              data-hn-tour-replay=""
              label={replayText ?? t.tour.replay}
              tooltip={false}
              size="sm"
              variant="ghost"
              tone="neutral"
              pill
              onClick={replay}
            >
              <ReplayIcon />
            </IconButton>
          )}
          <div className="ms-auto flex gap-2">
            {current > 1 && (
              <Button
                data-hn-tour-prev=""
                size="sm"
                variant="soft"
                tone="neutral"
                disabled={busy}
                onClick={() => void prev()}
              >
                {prevText ?? t.tour.prev}
              </Button>
            )}
            <Button data-hn-tour-next="" size="sm" loading={busy} onClick={() => void next()}>
              {isLast ? (finishText ?? t.tour.finish) : (nextText ?? t.tour.next)}
            </Button>
          </div>
        </div>
      )}
    </Card>
  )

  return (
    <>
      <Portal asChild container={container}>
        <div
          ref={setBlockerElement}
          data-hn-tour-blocker=""
          aria-hidden="true"
          hidden={!blockerStyle}
          className={tourBlocker()}
          style={blockerStyle}
        />
      </Portal>
      <Portal asChild container={container}>
        <div
          ref={pointerRef}
          data-hn-tour-pointer=""
          data-kind={pointerKind}
          data-state="hidden"
          aria-hidden="true"
          className={tourPointer()}
        >
          <span data-hn-tour-pointer-ring="" />
          <span data-hn-tour-pointer-ripples="" />
          {pointerKind === 'mouse' ? (
            <svg
              data-hn-tour-pointer-glyph=""
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              strokeLinejoin="round"
              className={tourPointerArrow()}
            >
              <path d="M4 2.5v16.2l4.1-3.9 2.8 6.6 2.9-1.2-2.8-6.5h5.8z" />
            </svg>
          ) : (
            <span data-hn-tour-pointer-glyph="" className={tourPointerTouch()} />
          )}
        </div>
      </Portal>
      <Portal asChild container={container}>
        <div
          ref={keyRef}
          data-hn-tour-key=""
          data-state="hidden"
          aria-hidden="true"
          className={tourKey()}
        >
          <kbd data-hn-tour-key-label="" className={tourKeyCap()} />
        </div>
      </Portal>
      <Portal asChild container={container}>
        <Presence present={maskVisible}>
          <div
            ref={setMaskElement}
            data-hn-tour-mask=""
            aria-hidden="true"
            data-state={maskVisible ? 'open' : 'closed'}
            data-mask={mask === 'dim' ? 'dim' : undefined}
            data-hn-tour-hole={spotlightState.hole}
            className={tourMask()}
            style={spotlightState.style as CSSProperties | undefined}
          />
        </Presence>
      </Portal>
      {beaconVisible && (
        <Portal asChild container={container}>
          <button
            ref={attachBeacon}
            type="button"
            data-hn-tour-beacon=""
            aria-label={t.tour.beacon(current, currentStep.title ?? '')}
            className={tourBeacon()}
            style={point ? { left: `${point.x}px`, top: `${point.y}px` } : undefined}
            onClick={() => {
              setBeaconPending(false)
              engine.play()
            }}
          >
            <span className={tourBeaconPulse()} />
            <span className={tourBeaconDot()} />
          </button>
        </Portal>
      )}
      <PopperRoot>
        <Portal asChild container={container}>
          <Presence present={cardVisible}>
            <DismissableLayer
              ref={attachLayer}
              asChild
              onEscapeKeyDown={event => event.preventDefault()}
              onPointerDownOutside={event => event.preventDefault()}
              onFocusOutside={event => event.preventDefault()}
            >
              {anchored ? (
                <PopperContent
                  asChild
                  reference={reference}
                  side={currentStep.side ?? 'bottom'}
                  align={currentStep.align ?? 'center'}
                  sideOffset={TOUR_SIDE_OFFSET}
                  collisionPadding={16}
                  arrowPadding={TOUR_ARROW_PADDING}
                  prioritizePosition
                  sticky="always"
                  updatePositionStrategy="always"
                >
                  {card}
                </PopperContent>
              ) : (
                <div
                  className={cn(tourCentered(), 'hn-anim-pop')}
                  data-state={cardVisible ? 'open' : 'closed'}
                >
                  {card}
                </div>
              )}
            </DismissableLayer>
          </Presence>
        </Portal>
      </PopperRoot>
    </>
  )
}
