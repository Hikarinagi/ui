'use client'

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import {
  beaconPoint,
  clampTourStep,
  hideOutsideTour,
  resolveTourTarget,
  revealTourTarget,
  runTourChange,
  spotlightPath,
  spotlightRect,
  TOUR_PADDING,
  TOUR_RADIUS,
  TOUR_SIDE_OFFSET,
  tourKeyAction,
  tourReference,
  trapTourFocus,
  watchTourTarget,
  type TourAlign,
  type TourBeforeChange,
  type TourRect,
  type TourSide,
  type TourStepBase,
  type TourTarget,
} from '../../../../shared/src/lib/tour'
import { cn } from '../../lib/cn'
import { usePortalContainer, useConfig } from '../../lib/config'
import { devWarn } from '../../lib/dev'
import { useUiLocale } from '../../locale'
import { DismissableLayer } from '../../primitives/dismissable-layer'
import { PopperContent, PopperRoot } from '../../primitives/popper'
import { Portal } from '../../primitives/portal'
import { Presence } from '../../primitives/presence'
import { useControllableState } from '../../primitives/utils/controllable-state'
import { Button } from '../button/Button'
import { Card } from '../card/Card'
import { CloseButton } from '../close-button/CloseButton'
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
  tourMask,
} from './tour.variants'

export type { TourAlign, TourBeforeChange, TourSide, TourTarget }

export type TourStep = TourStepBase

export interface TourSlotProps {
  step: TourStep
  current: number
  total: number
  busy: boolean
  next: () => void
  prev: () => void
  skip: () => void
}

export interface TourHandle {
  next: () => Promise<void>
  prev: () => Promise<void>
  goTo: (step: number) => Promise<void>
  close: () => void
}

export interface TourProps {
  steps: TourStep[]
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  step?: number
  defaultStep?: number
  onStepChange?: (step: number) => void
  mask?: boolean
  locked?: boolean
  beacon?: boolean
  nextText?: string
  prevText?: string
  finishText?: string
  skipText?: string
  beforeChange?: TourBeforeChange
  dir?: 'ltr' | 'rtl'
  className?: string
  onFinish?: () => void
  onSkip?: () => void
  renderContent?: (props: TourSlotProps) => ReactNode
  renderFooter?: (props: TourSlotProps) => ReactNode
  ref?: Ref<TourHandle>
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
  nextText,
  prevText,
  finishText,
  skipText,
  beforeChange,
  dir,
  className,
  onFinish,
  onSkip,
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
  const [beaconOpened, setBeaconOpened] = useState(false)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [inherited, setInherited] = useState<'ltr' | 'rtl'>('ltr')
  const [hole, setHole] = useState<TourRect | null>(null)
  const [targetRect, setTargetRect] = useState<TourRect | null>(null)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const direction = dir ?? config?.dir ?? inherited

  const padding = currentStep.padding ?? TOUR_PADDING
  const beaconMode = !!target && (currentStep.beacon ?? beacon) === true
  const active = open && total > 0
  const cardVisible = active && (!beaconMode || beaconOpened)
  const beaconVisible = active && beaconMode && !beaconOpened
  const maskVisible = cardVisible && mask
  const modal = mask
  const blocking = maskVisible && !!hole && !currentStep.interactive

  const cardRef = useRef<HTMLElement | null>(null)
  const layerRef = useRef<HTMLElement | null>(null)
  const [cardElement, setCardElement] = useState<HTMLElement | null>(null)
  const [layerElement, setLayerElement] = useState<HTMLElement | null>(null)
  const attachCard = useCallback((node: HTMLElement | null) => {
    cardRef.current = node
    setCardElement(node)
  }, [])
  const attachBeacon = useCallback((node: HTMLButtonElement | null) => {
    beaconRef.current = node
    if (!node || !refocusBeacon.current) return
    refocusBeacon.current = false
    node.focus()
  }, [])
  const attachLayer = useCallback((node: HTMLElement | null) => {
    layerRef.current = node
    setLayerElement(node)
  }, [])
  const beaconRef = useRef<HTMLButtonElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const refocusBeacon = useRef(false)
  const wasActive = useRef(false)

  useLayoutEffect(() => {
    if (!active) return
    const definition = currentStep.target
    const element = resolveTourTarget(definition)
    if (definition && !element)
      devWarn('Tour', `the target of step ${current} was not found; the card is centered`)
    setTarget(element)
    setInherited(
      getComputedStyle(element ?? document.documentElement).direction === 'rtl' ? 'rtl' : 'ltr',
    )
    if (element && currentStep.scroll !== false) revealTourTarget(element)
  }, [active, current, steps, currentStep.target, currentStep.scroll])

  useLayoutEffect(() => {
    setBeaconOpened(false)
  }, [active, current])

  useLayoutEffect(() => {
    if (active && !wasActive.current)
      returnFocus.current = document.activeElement as HTMLElement | null
    wasActive.current = active
  }, [active])

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
    if (!active) return
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      if (!target) {
        setHole(null)
        setTargetRect(null)
        return
      }
      const rect = target.getBoundingClientRect()
      setTargetRect(spotlightRect(rect, 0))
      setHole(spotlightRect(rect, padding))
    }
    if (!target) {
      update()
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    return watchTourTarget(target, update)
  }, [active, target, padding])

  const interactive = !!currentStep.interactive
  useEffect(() => {
    if (!cardVisible || !modal) return
    const layer = layerElement
    if (!layer?.isConnected) return
    const restore = hideOutsideTour([layer, target])
    const release = trapTourFocus(
      () => [cardRef.current, interactive ? target : null],
      () => layerRef.current,
    )
    return () => {
      release()
      restore()
    }
  }, [cardVisible, modal, target, interactive, layerElement])

  const goTo = useCallback(
    async (value: number) => {
      if (busyRef.current || !total) return
      const next = clampTourStep(value, total)
      if (next === current) return
      const allowed = await runTourChange(beforeChange, next, current, setBusy)
      if (!allowed) return
      refocusBeacon.current = !!cardRef.current?.contains(document.activeElement)
      setStep(next)
    },
    [beforeChange, current, setBusy, setStep, total],
  )

  const finish = useCallback(() => {
    onFinish?.()
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

  const skip = useCallback(() => {
    if (busyRef.current) return
    onSkip?.()
    setOpen(false)
  }, [onSkip, setOpen])

  const close = useCallback(() => setOpen(false), [setOpen])

  useImperativeHandle(ref, () => ({ next, prev, goTo, close }), [next, prev, goTo, close])

  function onKeyDown(event: ReactKeyboardEvent<HTMLElement>) {
    const action = tourKeyAction(event.nativeEvent, direction)
    if (!action) return
    event.preventDefault()
    if (action === 'next') {
      if (!isLast) void next()
    } else if (current > 1) void prev()
  }

  const slotProps: TourSlotProps = {
    step: currentStep,
    current,
    total,
    busy,
    next: () => void next(),
    prev: () => void prev(),
    skip,
  }

  const reference = useMemo(
    () => (target ? tourReference(target, padding) : undefined),
    [target, padding],
  )
  const clipPath = spotlightPath(viewport, hole, currentStep.radius ?? TOUR_RADIUS)
  const point = targetRect ? beaconPoint(targetRect, direction) : null
  const hasBody = !!currentStep.description || !!renderContent

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
      className={cn(tourCard(), target && 'hn-anim-pop', className)}
      onKeyDown={onKeyDown}
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
              onClick={skip}
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
      {renderFooter ? (
        renderFooter(slotProps)
      ) : (
        <div className={tourFooter()}>
          <Text as="span" tone="muted" size="sm" className="tabular-nums">
            {t.tour.progress(current, total)}
          </Text>
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
          data-hn-tour-blocker=""
          aria-hidden="true"
          hidden={!blocking}
          className={tourBlocker()}
          style={
            blocking && hole
              ? {
                  left: `${hole.x}px`,
                  top: `${hole.y}px`,
                  width: `${hole.width}px`,
                  height: `${hole.height}px`,
                }
              : undefined
          }
        />
      </Portal>
      <Portal asChild container={container}>
        <Presence present={maskVisible}>
          <div
            data-hn-tour-mask=""
            aria-hidden="true"
            data-state={maskVisible ? 'open' : 'closed'}
            className={tourMask()}
            style={{ clipPath }}
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
            onClick={() => setBeaconOpened(true)}
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
              onEscapeKeyDown={event => {
                if (locked || busyRef.current) event.preventDefault()
              }}
              onPointerDownOutside={event => event.preventDefault()}
              onFocusOutside={event => event.preventDefault()}
              onDismiss={skip}
            >
              {target ? (
                <PopperContent
                  asChild
                  reference={reference}
                  side={currentStep.side ?? 'bottom'}
                  align={currentStep.align ?? 'center'}
                  sideOffset={TOUR_SIDE_OFFSET}
                  collisionPadding={16}
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
