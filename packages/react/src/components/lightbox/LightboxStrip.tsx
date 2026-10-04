'use client'

import {
  motion,
  type MotionStyle,
  type MotionValue,
  type ValueAnimationTransition,
} from 'motion/react'
import { Transition } from '../../lib/transition/Transition'
import type { Rect } from '../../../../shared/src/lib/lightbox/pose'
import type { LightboxSlide } from './hooks/useLightboxSlides'
import type { LightboxItem } from './types'

export interface LightboxStripProps {
  slides: LightboxSlide[]
  index: number
  width: number
  stripX: MotionValue<number>
  currentClass: string
  currentStyle: MotionStyle
  frameOf: (item: LightboxItem) => Rect
  rotationOf: (item: LightboxItem) => number
  baseOf: (item: LightboxItem) => number
  transition: ValueAnimationTransition
  largeSrc?: string
  largeReady: boolean
  onLearn?: (id: string, image: HTMLImageElement) => void
}

function px(rect: Rect) {
  return {
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
  }
}

export function LightboxStrip(props: LightboxStripProps) {
  return (
    <motion.div className="absolute inset-0" style={{ x: props.stripX }}>
      {props.slides.map(slide => (
        <div
          key={slide.key}
          className="absolute inset-y-0"
          style={{ left: `${slide.at * props.width}px`, width: `${props.width}px` }}
        >
          {slide.at === props.index ? (
            <motion.div
              key="current"
              data-hn-frame=""
              className={props.currentClass}
              style={props.currentStyle}
            >
              <img
                src={slide.item.src}
                alt={slide.item.alt}
                draggable="false"
                className="block size-full object-contain"
                onLoad={event => props.onLearn?.(slide.item.id, event.target as HTMLImageElement)}
              />
              <Transition
                show={props.largeReady}
                enterActiveClass="hn-transition-base"
                enterFromClass="opacity-0"
                leaveActiveClass="hn-transition"
                leaveToClass="opacity-0"
              >
                <img
                  src={props.largeSrc}
                  alt=""
                  aria-hidden="true"
                  draggable="false"
                  className="absolute inset-0 size-full object-contain"
                />
              </Transition>
            </motion.div>
          ) : (
            <motion.div
              key="other"
              data-hn-frame=""
              className="absolute"
              style={px(props.frameOf(slide.item))}
              initial={false}
              animate={{ rotate: props.rotationOf(slide.item), scale: props.baseOf(slide.item) }}
              transition={props.transition}
            >
              <img
                src={slide.item.src}
                alt={slide.item.alt}
                draggable="false"
                className="block size-full object-contain"
                onLoad={event => props.onLearn?.(slide.item.id, event.target as HTMLImageElement)}
              />
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  )
}
