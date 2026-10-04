'use client'

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { motion as Motion, type MotionStyle } from 'motion/react'
import { useControllableState } from 'radix-ui/internal'
import { DialogContent, DialogPortal, DialogRoot, DialogTitle } from '../../primitives/dialog'
import { useBodyScrollLock } from '../../primitives/body-scroll-lock'
import { cn } from '../../lib/cn'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'
import { LightboxStrip } from './LightboxStrip'
import { LightboxChrome } from './LightboxChrome'
import { useLightboxMotion } from './hooks/useLightboxMotion'
import { useLightboxZoom } from './hooks/useLightboxZoom'
import { useLightboxGesture } from './hooks/useLightboxGesture'
import { useLightboxPaging } from './hooks/useLightboxPaging'
import { useLightboxFrames } from './hooks/useLightboxFrames'
import { useLightboxLarge } from './hooks/useLightboxLarge'
import { createLightboxPose } from './hooks/useLightboxPose'
import { useLightboxPhase } from './hooks/useLightboxPhase'
import { useLightboxHint } from './hooks/useLightboxHint'
import { lightboxSlides } from './hooks/useLightboxSlides'
import { useLightboxLayout } from './hooks/useLightboxLayout'
import { createLightboxRotation } from './hooks/useLightboxRotation'
import { useLatest, useRerender } from './hooks/useLatest'
import { lightboxStage } from './lightbox.variants'
import { clampIndex } from '../../../../shared/src/lib/lightbox/paging'
import { saveImage } from '../../../../shared/src/lib/lightbox/download'
import type { LightboxItem } from './types'

export interface LightboxProps {
  items: LightboxItem[]
  loop?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
}

export function Lightbox({
  items,
  loop,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  index: indexProp,
  defaultIndex,
  onIndexChange,
}: LightboxProps) {
  const [open = false, setOpenState] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Lightbox',
  })
  const [index = 0, setIndexState] = useControllableState({
    prop: indexProp,
    defaultProp: defaultIndex ?? 0,
    onChange: onIndexChange,
    caller: 'Lightbox',
  })

  const rerender = useRerender()
  const live = useRef({ open, index, items, mounted: false })
  live.current.open = open
  live.current.index = index
  live.current.items = items

  const setOpen = useCallback(
    (value: boolean) => {
      live.current.open = value
      setOpenState(value)
    },
    [setOpenState],
  )
  const setIndex = useCallback(
    (value: number) => {
      live.current.index = value
      setIndexState(value)
    },
    [setIndexState],
  )

  const [mounted, setMountedState] = useState(false)
  const setMounted = useCallback((value: boolean) => {
    live.current.mounted = value
    setMountedState(value)
  }, [])
  const [locked, setLocked] = useState(false)
  useBodyScrollLock(locked)

  const stageEl = useRef<HTMLElement | null>(null)
  const [stage, setStage] = useState<HTMLElement | null>(null)
  const stageRef = useCallback((el: HTMLElement | null) => {
    stageEl.current = el
    setStage(el)
  }, [])

  const ticks = useRef<(() => void)[]>([])
  useLayoutEffect(() => {
    for (const resolve of ticks.current.splice(0)) resolve()
  })
  const nextTick = useCallback(
    () =>
      new Promise<void>(resolve => {
        ticks.current.push(resolve)
        rerender()
      }),
    [rerender],
  )

  const count = items.length
  const current = items[index]
  const currentOf = useCallback(() => live.current.items[live.current.index], [])

  const frames = useLightboxFrames(() => live.current.items)
  const [pose] = useState(() => createLightboxPose(frames, currentOf))
  const notify = useLatest(rerender)
  const [rotation] = useState(() =>
    createLightboxRotation(frames, currentOf, () => notify.current()),
  )

  const motion = useLightboxMotion(
    () => frames.stage.height,
    () => rotation.baseOf(currentOf()),
  )

  const zoom = useLightboxZoom(motion, rotation.geometry)

  const paging = useLightboxPaging({
    index: () => live.current.index,
    setIndex,
    count: () => live.current.items.length,
    width: () => frames.stage.width,
    loop: () => !!loop,
  })

  function measure(force = false) {
    const width = frames.stage.width
    frames.measure(stageEl.current)
    if (force || width !== frames.stage.width) paging.sync()
  }

  const phase = useLightboxPhase({
    open: () => live.current.open,
    setOpen,
    mounted: () => live.current.mounted,
    setMounted,
    setLocked,
    nextTick,
    motion,
    pose: pose.fromSource,
    prepare: () => {
      rotation.clear()
      return frames.read(currentOf)
    },
    layout: () => measure(true),
  })

  const close = phase.close

  const gesture = useLightboxGesture({
    stage: () => stageEl.current,
    motion,
    zoom,
    paging,
    enabled: () => phase.current() === 'open',
    interrupt: phase.interrupt,
    inside: target => target instanceof Element && !!target.closest('[data-hn-frame]'),
    dismiss: () => void close(),
    tapOutside: () => void close(),
  })

  const large = useLightboxLarge(current, mounted)

  const layout = useLightboxLayout({
    stage,
    current: currentOf,
    frames,
    large,
    phase,
    zoom,
    measure,
  })

  const hint = useLightboxHint({ motion, frames, paging, current: currentOf })

  const looping = !!loop && count > 1
  const slides = lightboxSlides(paging.range(), items, looping)

  function go(to: number) {
    if (zoom.isZoomed()) zoom.reset()
    paging.go(to)
  }

  function rotate() {
    if (phase.current() === 'open') motion.turn(rotation.advance())
  }

  function download() {
    const item = currentOf()
    if (item) void saveImage(item.preview || item.src)
  }

  useEffect(() => {
    if (open) void phase.show()
    else void close()
  }, [open])

  const previousIndex = useRef(index)
  useLayoutEffect(() => {
    const from = previousIndex.current
    previousIndex.current = index
    if (from === index) return
    rotation.drop(live.current.items[from])
    motion.reset(rotation.rotationOf(live.current.items[index]))
  }, [index])

  const previousCount = useRef(count)
  useEffect(() => {
    if (previousCount.current === count) return
    previousCount.current = count
    const clamped = clampIndex(live.current.index, count)
    if (clamped !== live.current.index) setIndex(clamped)
    if (live.current.mounted) paging.sync()
  }, [count])

  useEffect(() => {
    if (!stage) return
    stage.addEventListener('wheel', gesture.onWheel, { passive: false })
    return () => stage.removeEventListener('wheel', gesture.onWheel)
  }, [stage, gesture])

  function onEscape(event: Event) {
    event.preventDefault()
    void close()
  }

  function onKeydown(event: ReactKeyboardEvent) {
    if (phase.current() !== 'open') return
    if (event.key === 'ArrowLeft') go(live.current.index - 1)
    else if (event.key === 'ArrowRight') go(live.current.index + 1)
    else return
    event.preventDefault()
  }

  const frame = frames.frameOf(current)
  const currentStyle: MotionStyle = {
    left: `${frame.x}px`,
    top: `${frame.y}px`,
    width: `${frame.width}px`,
    height: `${frame.height}px`,
    x: motion.x,
    y: motion.y,
    scale: motion.scale,
    rotate: motion.rotate,
    clipPath: motion.clipPath,
    opacity: motion.opacity,
  }

  const currentClass = cn(
    'absolute will-change-transform',
    !zoom.zoomed && (zoom.canToggle ? 'cursor-zoom-in' : 'cursor-default'),
    zoom.zoomed && (gesture.mode() === 'pan' ? 'cursor-grabbing' : 'cursor-grab'),
  )

  return (
    <DialogRoot
      open={mounted}
      onOpenChange={value => {
        if (!value) void close()
      }}
    >
      <DialogPortal>
        <DialogContent
          asChild
          aria-describedby={undefined}
          onEscapeKeyDown={onEscape}
          onInteractOutside={event => event.preventDefault()}
        >
          <div
            ref={stageRef}
            data-hn-phase={phase.current()}
            className={cn(lightboxStage(), className)}
            onPointerDown={event => gesture.onPointerdown(event.nativeEvent)}
            onPointerMove={event => gesture.onPointermove(event.nativeEvent)}
            onPointerUp={event => gesture.onPointerup(event.nativeEvent)}
            onPointerCancel={event => gesture.onPointercancel(event.nativeEvent)}
            onKeyDown={onKeydown}
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate">
              <Motion.div className="hn-scrim" style={{ opacity: motion.presence }} />
            </div>
            <LightboxStrip
              slides={slides}
              index={paging.position}
              width={frames.stage.width}
              stripX={paging.stripX}
              currentClass={currentClass}
              currentStyle={currentStyle}
              frameOf={frames.frameOf}
              rotationOf={rotation.rotationOf}
              baseOf={rotation.baseOf}
              transition={motion.transition('base')}
              largeSrc={large.src}
              largeReady={large.ready}
              onLearn={layout.learn}
            />
            <DialogTitle asChild>
              <VisuallyHidden>{current?.alt}</VisuallyHidden>
            </DialogTitle>
            <LightboxChrome
              items={items}
              index={index}
              zoomed={zoom.zoomed}
              canZoomIn={zoom.canZoomIn}
              atOriginal={zoom.atOriginal}
              waiting={large.waiting}
              loop={looping}
              hint={hint}
              presence={motion.presence}
              onPrev={() => go(live.current.index - 1)}
              onNext={() => go(live.current.index + 1)}
              onSelect={go}
              onZoomIn={() => zoom.step(1)}
              onZoomOut={() => zoom.step(-1)}
              onReset={() => zoom.reset()}
              onOriginal={() => zoom.original()}
              onRotate={rotate}
              onDownload={download}
            />
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
