'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { HTMLAttributes, ReactNode, Ref } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { stepBetween, type SlideDirection } from '../../../../shared/src/lib/banner'
import { cn } from '../../lib/cn'
import { useCollapseHooks } from '../../lib/collapse'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { CloseButton } from '../close-button/CloseButton'
import { IconButton } from '../icon-button/IconButton'
import {
  banner,
  bannerActions,
  bannerContent,
  bannerControls,
  bannerCounter,
  bannerIcon,
  bannerItem,
  bannerSlide,
  type BannerVariants,
} from './banner.variants'
import { useAutoplay } from './hooks/useAutoplay'
import { bannerIcons } from './icons'
import type { BannerNotice } from './types'
import { useControllableState } from '../../primitives/utils/controllable-state'

const ChevronLeftIcon = lucide(ChevronLeft)
const ChevronRightIcon = lucide(ChevronRight)

export interface BannerItemSlot<T> {
  item: T
  index: number
}

export interface BannerProps<T = unknown> extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  tone?: BannerVariants['tone']
  icon?: ReactNode
  closable?: boolean
  items?: T[]
  autoplay?: number
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  onClose?: () => void
  actions?: ReactNode
  renderItem?: (props: BannerItemSlot<T>) => ReactNode
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
  [attribute: `data-${string}`]: string | undefined
}

interface Motion {
  index: number
  direction: SlideDirection
  pending?: SlideDirection
}

export function Banner<T = unknown>({
  tone: toneProp = 'accent',
  icon: iconProp = true,
  closable,
  items,
  autoplay: interval,
  open: openProp,
  defaultOpen = true,
  onOpenChange,
  index: indexProp,
  defaultIndex = 0,
  onIndexChange,
  onClose,
  actions,
  renderItem,
  className,
  children,
  ...attrs
}: BannerProps<T>) {
  const t = useUiLocale()
  const hooks = useCollapseHooks()
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'Banner',
  })
  const [index, setIndex] = useControllableState({
    prop: indexProp,
    defaultProp: defaultIndex,
    onChange: onIndexChange,
    caller: 'Banner',
  })

  const count = items?.length ?? 0
  const multiple = count > 1
  const at = count ? ((index % count) + count) % count : 0
  const current = items?.[at]
  const notice = current as BannerNotice | undefined
  const tone = notice?.tone ?? toneProp
  const Icon = notice?.icon ?? bannerIcons[tone]

  const [motion, setMotion] = useState<Motion>({ index, direction: 1 })
  let direction = motion.direction
  if (motion.index !== index) {
    direction = motion.pending ?? stepBetween(motion.index, index, count)
    setMotion({ index, direction })
  }
  const slide = bannerSlide[direction > 0 ? 'forward' : 'backward']

  const [shown, setShown] = useState(at)
  const latestAt = useRef(at)
  const enterNext = useRef(false)

  useEffect(() => {
    latestAt.current = at
  })

  useLayoutEffect(() => {
    enterNext.current = false
  }, [shown])

  function go(step: SlideDirection) {
    setMotion(value => ({ ...value, pending: step }))
    setIndex((at + step + count) % count)
  }

  const autoplay = useAutoplay(interval, multiple && open, () => go(1))

  function close() {
    setOpen(false)
    onClose?.()
  }

  const iconNode =
    iconProp === true ? <Icon className={bannerIcon()} aria-hidden="true" /> : iconProp

  return (
    <Transition
      show={open}
      enterFromClass="hn-collapse-closed"
      enterToClass="hn-collapse-open"
      leaveFromClass="hn-collapse-open"
      leaveToClass="hn-collapse-closed"
      {...hooks}
    >
      <div data-hn-banner="" className="hn-collapse w-full" {...attrs}>
        <div className="hn-collapse-body">
          <div
            data-tone={tone}
            className={cn(banner({ tone }), className)}
            onPointerEnter={() => autoplay.setHovered(true)}
            onPointerLeave={() => autoplay.setHovered(false)}
            onFocus={() => autoplay.setFocused(true)}
            onBlur={() => autoplay.setFocused(false)}
          >
            <div className={bannerContent()}>
              {items ? (
                <span
                  aria-live={multiple && !interval ? 'polite' : undefined}
                  className="flex min-w-0 items-center"
                >
                  <Transition
                    key={shown}
                    show={shown === at}
                    appear={enterNext.current}
                    enterActiveClass="hn-transition-base"
                    enterFromClass={slide.enterFrom}
                    leaveActiveClass="hn-transition"
                    leaveToClass={slide.leaveTo}
                    onAfterLeave={() => {
                      enterNext.current = true
                      setShown(latestAt.current)
                    }}
                  >
                    <span className={bannerItem()}>
                      {iconNode}
                      {renderItem?.({ item: current as T, index: at })}
                    </span>
                  </Transition>
                </span>
              ) : (
                <>
                  {iconNode}
                  {children}
                </>
              )}
              {hasContent(actions) && <div className={bannerActions()}>{actions}</div>}
            </div>
            {(multiple || closable) && (
              <div className={bannerControls()}>
                {multiple && (
                  <>
                    <IconButton
                      size="sm"
                      pill
                      variant="ghost"
                      tone="neutral"
                      tooltip={false}
                      label={t.banner.prev}
                      className="text-current"
                      onClick={() => go(-1)}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <span className={bannerCounter()}>
                      {at + 1} / {count}
                    </span>
                    <IconButton
                      size="sm"
                      pill
                      variant="ghost"
                      tone="neutral"
                      tooltip={false}
                      label={t.banner.next}
                      className="text-current"
                      onClick={() => go(1)}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </>
                )}
                {closable && <CloseButton size="sm" className="text-current" onClick={close} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </Transition>
  )
}
