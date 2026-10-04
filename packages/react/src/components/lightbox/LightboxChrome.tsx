'use client'

import { motion, type MotionValue } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DialogClose } from '../../primitives/dialog'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { CloseButton } from '../close-button/CloseButton'
import { IconButton } from '../icon-button/IconButton'
import { Spinner } from '../spinner/Spinner'
import { Tag } from '../tag/Tag'
import { LightboxToolbar } from './LightboxToolbar'
import type { LightboxItem } from './types'

const ChevronLeftIcon = lucide(ChevronLeft)
const ChevronRightIcon = lucide(ChevronRight)

export interface LightboxChromeProps {
  items: LightboxItem[]
  index: number
  zoomed: boolean
  canZoomIn: boolean
  atOriginal: boolean
  waiting: boolean
  loop: boolean
  presence: MotionValue<number>
  hint: { x: MotionValue<number>; y: MotionValue<number> }
  onPrev?: () => void
  onNext?: () => void
  onSelect?: (index: number) => void
  onZoomIn?: () => void
  onZoomOut?: () => void
  onReset?: () => void
  onOriginal?: () => void
  onRotate?: () => void
  onDownload?: () => void
}

export function LightboxChrome(props: LightboxChromeProps) {
  const t = useUiLocale()
  return (
    <>
      <Transition
        show={props.waiting}
        enterActiveClass="hn-transition-base"
        enterFromClass="opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="opacity-0"
      >
        <motion.div
          className="pointer-events-none absolute start-0 top-0 -translate-x-full p-3"
          style={{ x: props.hint.x, y: props.hint.y }}
        >
          <Tag variant="soft" tone="neutral" pill className="whitespace-nowrap">
            <Spinner size="sm" />
            {t.lightbox.loadingLarge}
          </Tag>
        </motion.div>
      </Transition>
      {props.items.length > 1 && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 start-0 hidden items-center ps-4 pointer-fine:flex"
          style={{ opacity: props.presence }}
        >
          <IconButton
            label={t.pagination.prev}
            variant="soft"
            size="lg"
            pill
            disabled={!props.loop && props.index <= 0}
            className="pointer-events-auto"
            onClick={() => props.onPrev?.()}
          >
            <ChevronLeftIcon />
          </IconButton>
        </motion.div>
      )}
      {props.items.length > 1 && (
        <motion.div
          className="pointer-events-none absolute inset-y-0 end-0 hidden items-center pe-4 pointer-fine:flex"
          style={{ opacity: props.presence }}
        >
          <IconButton
            label={t.pagination.next}
            variant="soft"
            size="lg"
            pill
            disabled={!props.loop && props.index >= props.items.length - 1}
            className="pointer-events-auto"
            onClick={() => props.onNext?.()}
          >
            <ChevronRightIcon />
          </IconButton>
        </motion.div>
      )}
      <motion.div
        data-hn-close=""
        className="absolute end-4 top-4"
        style={{ opacity: props.presence }}
      >
        <DialogClose asChild>
          <CloseButton size="md" />
        </DialogClose>
      </motion.div>
      <motion.div
        data-hn-chrome=""
        className="absolute inset-x-0 bottom-0 flex touch-pan-x justify-center"
        style={{ opacity: props.presence }}
      >
        <LightboxToolbar
          items={props.items}
          index={props.index}
          zoomed={props.zoomed}
          canZoomIn={props.canZoomIn}
          atOriginal={props.atOriginal}
          onSelect={index => props.onSelect?.(index)}
          onZoomIn={() => props.onZoomIn?.()}
          onZoomOut={() => props.onZoomOut?.()}
          onReset={() => props.onReset?.()}
          onOriginal={() => props.onOriginal?.()}
          onRotate={() => props.onRotate?.()}
          onDownload={() => props.onDownload?.()}
        />
      </motion.div>
    </>
  )
}
