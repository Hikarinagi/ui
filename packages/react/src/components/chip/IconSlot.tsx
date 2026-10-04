import { Check } from 'lucide-react'
import type { ReactNode } from 'react'
import { lucide } from '../../lib/icon'
import { Transition } from '../../lib/transition/Transition'
import { chipIcon, type ChipVariants } from './chip.variants'

const CheckIcon = lucide(Check)

export interface IconSlotProps {
  size?: ChipVariants['size']
  checked: boolean
  icon: boolean
  children?: ReactNode
}

export function IconSlot({ size, checked, icon, children }: IconSlotProps) {
  return (
    <span
      data-hn-icon=""
      className={`hn-collapse-x ${icon || checked ? 'hn-collapse-open' : 'hn-collapse-closed'}`}
    >
      <span className="hn-collapse-body">
        <span className={chipIcon({ size })}>
          {icon && (
            <span
              className={`hn-transition inline-flex items-center justify-center ${checked ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}
            >
              {children}
            </span>
          )}
          <Transition
            show={checked}
            enterActiveClass="hn-transition-base"
            enterFromClass="scale-90 opacity-0"
            leaveActiveClass="hn-transition"
            leaveToClass="scale-90 opacity-0"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 inline-flex items-center justify-center"
            >
              <CheckIcon />
            </span>
          </Transition>
        </span>
      </span>
    </span>
  )
}
