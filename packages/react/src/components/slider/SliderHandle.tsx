'use client'

import type { CSSProperties, HTMLAttributes } from 'react'
import { radixSliderThumbStyle } from '../../lib/radix/styles'
import { SliderThumb } from '../../primitives/slider'
import { Tooltip } from '../tooltip/Tooltip'
import { useTooltipProviderPresence } from '../tooltip/context'
import { sliderThumb } from './slider.variants'

export interface SliderHandleProps extends HTMLAttributes<HTMLElement> {
  text: string
  open: boolean
  ring: boolean
  tooltip: boolean
  [attribute: `data-${string}`]: string | undefined
}

export function SliderHandle({ text, open, ring, tooltip, style, ...attrs }: SliderHandleProps) {
  const tooltips = useTooltipProviderPresence()
  const thumb = (
    <SliderThumb
      {...attrs}
      data-focus-ring={ring ? '' : undefined}
      className={sliderThumb()}
      style={{ ...style, ...(radixSliderThumbStyle as CSSProperties) }}
    />
  )
  if (tooltip && tooltips)
    return (
      <Tooltip open={open} content={text}>
        {thumb}
      </Tooltip>
    )
  return thumb
}
