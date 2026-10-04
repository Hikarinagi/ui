'use client'

import { useTransform } from 'motion/react'
import type { LightboxMotion } from './useLightboxMotion'
import type { LightboxFrames } from './useLightboxFrames'
import type { LightboxPaging } from './useLightboxPaging'
import type { LightboxItem } from '../types'

export function useLightboxHint(options: {
  motion: LightboxMotion
  frames: LightboxFrames
  paging: LightboxPaging
  current: () => LightboxItem | undefined
}) {
  const { motion, frames, paging } = options

  function corner() {
    const frame = frames.frameOf(options.current())
    const stage = frames.stage
    const scale = motion.scale.get()
    const angle = (motion.rotate.get() * Math.PI) / 180
    const cos = Math.abs(Math.cos(angle))
    const sin = Math.abs(Math.sin(angle))
    const width = (frame.width * cos + frame.height * sin) * scale
    const height = (frame.width * sin + frame.height * cos) * scale
    const centerX = paging.stripX.get() + paging.position * stage.width + frame.x + frame.width / 2
    const centerY = frame.y + frame.height / 2 + motion.y.get()
    return {
      x: Math.min(centerX + motion.x.get() + width / 2, stage.width),
      y: Math.max(centerY - height / 2, 0),
    }
  }

  const x = useTransform(() => corner().x)
  const y = useTransform(() => corner().y)

  return { x, y }
}
