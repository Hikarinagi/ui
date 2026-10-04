import type { ReactNode } from 'react'
import { Transition } from '../../lib/transition/Transition'
import { Spinner } from '../spinner/Spinner'

export interface IconSlotProps {
  boxClass: string
  swapped: boolean
  spinnerSize: 'sm' | 'md'
  children?: ReactNode
}

export function IconSlot({ boxClass, swapped, spinnerSize, children }: IconSlotProps) {
  return (
    <span className={boxClass}>
      <span
        className={`hn-transition inline-flex items-center justify-center ${swapped ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
      >
        {children}
      </span>
      <Transition
        show={swapped}
        enterActiveClass="hn-transition-base"
        enterFromClass="scale-90 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-90 opacity-0"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          <Spinner size={spinnerSize} />
        </span>
      </Transition>
    </span>
  )
}
