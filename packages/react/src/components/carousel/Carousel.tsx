'use client'

import { useId, useImperativeHandle, type CSSProperties, type FocusEvent } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Pause, Play } from 'lucide-react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { useUiLocale } from '../../locale'
import { Button } from '../button/Button'
import { IconButton } from '../icon-button/IconButton'
import { useCarousel } from './hooks/useCarousel'
import {
  carousel,
  carouselControls,
  carouselDot,
  carouselIndicator,
  carouselIndicators,
  carouselItem,
  carouselStatus,
  carouselTrack,
  carouselViewport,
} from './carousel.variants'
import type { CarouselProps } from './types'
import { useControllableState } from '../../primitives/utils/controllable-state'

const ChevronDownIcon = lucide(ChevronDown)
const ChevronLeftIcon = lucide(ChevronLeft)
const ChevronRightIcon = lucide(ChevronRight)
const ChevronUpIcon = lucide(ChevronUp)
const PauseIcon = lucide(Pause)
const PlayIcon = lucide(Play)

export function Carousel<T>({
  items,
  getKey,
  index,
  defaultIndex,
  onIndexChange,
  label,
  dir,
  orientation = 'horizontal',
  align = 'start',
  containScroll = 'trimSnaps',
  slidesToScroll = 1,
  loop = false,
  draggable = true,
  dragFree = false,
  autoplay = false,
  arrows = true,
  indicators = false,
  gap = 'md',
  viewportClass,
  itemClass,
  onSelect,
  onReady,
  children,
  renderControls,
  renderIndicators,
  renderIndicator,
  pending: pendingContent,
  empty,
  className,
  onFocus,
  ref,
  ...attrs
}: CarouselProps<T>) {
  const t = useUiLocale()
  const id = useId()
  const [model, setModel] = useControllableState<number | undefined>({
    prop: index,
    defaultProp: defaultIndex,
    onChange: value => {
      if (value !== undefined) onIndexChange?.(value)
    },
    caller: 'Carousel',
  })
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
    keydown,
    focusIn,
    rotationPointerDown,
    toggleRotation,
    refresh,
    controller,
  } = useCarousel<T>(
    {
      items,
      getKey,
      dir,
      orientation,
      align,
      containScroll,
      slidesToScroll,
      loop,
      draggable,
      dragFree,
      autoplay,
      itemClass,
    },
    model,
    value => setModel(value),
    (event, value) => {
      if (event === 'ready') onReady?.(value)
      else onSelect?.(value)
    },
  )
  const pending = hasContent(pendingContent) && items.length > 0 && !ready
  const showIndicators = indicators || !!renderIndicators || !!renderIndicator
  const inView = (position: number) => !visibilityKnown || state.visibleItems.includes(position)

  useImperativeHandle(
    ref,
    () => ({
      get element() {
        return element.current ?? undefined
      },
      get viewport() {
        return viewport.current ?? undefined
      },
      get state() {
        return controller.state()
      },
      prev: () => controller.prev(),
      next: () => controller.next(),
      scrollTo: (value: number, instant?: boolean) => controller.scrollTo(value, instant),
      play: () => controller.play(),
      pause: () => controller.pause(),
      refresh,
    }),
    [controller, element, viewport, refresh],
  )

  function handleFocus(event: FocusEvent<HTMLDivElement>) {
    focusIn()
    onFocus?.(event)
  }

  return (
    <div
      ref={element}
      role="region"
      aria-label={label ?? t.carousel.label}
      aria-roledescription={t.carousel.role}
      aria-busy={pending}
      dir={rootDirection}
      data-hn-carousel=""
      data-ready={ready ? '' : undefined}
      data-initial-index={initialIndex}
      data-orientation={orientation}
      {...attrs}
      className={cn(carousel({ gap }), className)}
      onFocus={handleFocus}
    >
      {autoplay && items.length > 1 ? (
        <div className="mb-2 flex justify-end">
          <Button
            size="sm"
            variant="ghost"
            tone="neutral"
            disabled={!ready || state.snapCount < 2}
            data-hn-carousel-rotation=""
            aria-controls={id}
            icon={requested ? <PauseIcon /> : <PlayIcon />}
            onPointerDown={rotationPointerDown}
            onClick={toggleRotation}
          >
            {requested ? t.carousel.pause : t.carousel.play}
          </Button>
        </div>
      ) : null}
      <div className="hn-carousel-stage relative min-w-0">
        <div
          id={id}
          ref={viewport}
          tabIndex={0}
          data-hn-carousel-viewport=""
          data-pending={pending ? '' : undefined}
          aria-hidden={pending || undefined}
          inert={pending || undefined}
          className={cn(carouselViewport(), viewportClass)}
          style={items.length ? undefined : { display: 'none' }}
          onKeyDown={keydown}
        >
          <div
            className={carouselTrack()}
            style={{ '--hn-carousel-initial-index': initialIndex } as CSSProperties}
          >
            {items.map((item, position) => (
              <div
                key={getKey(item, position)}
                role="group"
                aria-roledescription={t.carousel.slide}
                aria-label={t.carousel.position(position + 1, items.length)}
                aria-hidden={!inView(position) || undefined}
                inert={!inView(position) || undefined}
                data-visible={inView(position) ? '' : undefined}
                data-hn-carousel-item=""
                className={cn(
                  carouselItem(),
                  typeof itemClass === 'function' ? itemClass(item, position) : itemClass,
                )}
              >
                {typeof children === 'function'
                  ? children({ item, index: position, isVisible: inView(position), ready })
                  : children}
              </div>
            ))}
          </div>
        </div>
        {pending ? (
          <div data-hn-carousel-pending="" role="status" aria-label={t.common.loading}>
            {pendingContent}
          </div>
        ) : null}
      </div>
      {!items.length ? (
        <div className={carouselStatus()}>{hasContent(empty) ? empty : t.carousel.empty}</div>
      ) : arrows || showIndicators || renderControls ? (
        <div className={carouselControls()}>
          {renderControls ? (
            renderControls(controls)
          ) : (
            <>
              {arrows ? (
                <IconButton
                  variant="soft"
                  size="sm"
                  pill
                  label={t.carousel.prev}
                  disabled={!state.canPrev}
                  aria-controls={id}
                  onClick={controls.prev}
                >
                  {orientation === 'vertical' ? (
                    <ChevronUpIcon />
                  ) : (
                    <ChevronLeftIcon className="rtl:rotate-180" />
                  )}
                </IconButton>
              ) : null}
              {showIndicators ? (
                <div
                  data-hn-carousel-indicators=""
                  role="group"
                  aria-label={t.carousel.choose}
                  className={carouselIndicators({
                    custom: !!renderIndicator || !!renderIndicators,
                  })}
                >
                  {renderIndicators
                    ? renderIndicators({ ...controls, viewportId: id })
                    : Array.from({ length: state.snapCount }, (_, position) => (
                        <button
                          key={position}
                          type="button"
                          data-hn-carousel-indicator=""
                          data-active={position === state.index ? '' : undefined}
                          aria-label={t.carousel.goTo(position + 1)}
                          aria-controls={id}
                          aria-disabled={position === state.index || undefined}
                          className={carouselIndicator({ custom: !!renderIndicator })}
                          onClick={() => {
                            if (position !== state.index) controls.scrollTo(position)
                          }}
                        >
                          {renderIndicator ? (
                            renderIndicator({
                              index: position,
                              active: position === state.index,
                              snapCount: state.snapCount,
                            })
                          ) : (
                            <span
                              aria-hidden="true"
                              data-current={position === state.index ? '' : undefined}
                              className={carouselDot()}
                            />
                          )}
                        </button>
                      ))}
                </div>
              ) : null}
              {arrows ? (
                <IconButton
                  variant="soft"
                  size="sm"
                  pill
                  label={t.carousel.next}
                  disabled={!state.canNext}
                  aria-controls={id}
                  onClick={controls.next}
                >
                  {orientation === 'vertical' ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon className="rtl:rotate-180" />
                  )}
                </IconButton>
              ) : null}
            </>
          )}
        </div>
      ) : null}
      <span className="sr-only" aria-live={state.playing ? 'off' : 'polite'} aria-atomic="true">
        {state.snapCount ? t.carousel.position(state.index + 1, state.snapCount) : ''}
      </span>
    </div>
  )
}
