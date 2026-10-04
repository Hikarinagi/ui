'use client'

import { useState } from 'react'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import { lucide, type IconComponent } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { Spinner } from '../spinner/Spinner'
import type { ToastTone } from './store'

type IconTone = Exclude<ToastTone, 'neutral'>

const TONES: IconTone[] = ['loading', 'success', 'danger', 'warning', 'info']

const icons: Record<Exclude<IconTone, 'loading'>, IconComponent> = {
  success: lucide(CircleCheck),
  danger: lucide(CircleX),
  warning: lucide(TriangleAlert),
  info: lucide(Info),
}

const iconColor: Record<Exclude<IconTone, 'loading'>, string> = {
  success: 'text-success-text',
  danger: 'text-danger-text',
  warning: 'text-warning-text',
  info: 'text-info-text',
}

export interface ToastIconProps {
  tone: IconTone
}

export function ToastIcon({ tone }: ToastIconProps) {
  const [order, setOrder] = useState(() => [...TONES.filter(key => key !== tone), tone])
  let current = order
  if (order[order.length - 1] !== tone) {
    current = [...order.filter(key => key !== tone), tone]
    setOrder(current)
  }

  return (
    <div className="relative mt-0.5 size-5 shrink-0">
      {current.map(key => (
        <Transition
          key={key}
          show={key === tone}
          enterActiveClass="hn-transition-base"
          enterFromClass="scale-90 opacity-0"
          leaveActiveClass="hn-transition"
          leaveToClass="scale-90 opacity-0"
        >
          {glyph(key)}
        </Transition>
      ))}
    </div>
  )
}

function glyph(key: IconTone) {
  if (key === 'loading')
    return (
      <span className="absolute inset-0 inline-flex items-center justify-center">
        <Spinner size="md" className="text-muted" />
      </span>
    )
  const Icon = icons[key]
  return <Icon className={`absolute inset-0 size-5 ${iconColor[key]}`} aria-hidden="true" />
}
