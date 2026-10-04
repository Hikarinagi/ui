'use client'

import { Check, Minus } from 'lucide-react'
import { lucide } from '../../lib/icon'
import clsx from 'clsx'
import { Transition } from '../../lib/transition/Transition'
import { checkboxBox } from '../checkbox/checkbox.variants'

const CheckIcon = lucide(Check)
const MinusIcon = lucide(Minus)

export interface TreeCheckProps {
  selected: boolean
  indeterminate: boolean
}

export function TreeCheck({ selected, indeterminate }: TreeCheckProps) {
  return (
    <span
      aria-hidden="true"
      data-state={indeterminate ? 'indeterminate' : selected ? 'checked' : 'unchecked'}
      className={clsx(checkboxBox(), 'pointer-events-none')}
    >
      <Transition
        show={selected}
        enterActiveClass="hn-transition-press"
        enterFromClass="scale-50 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-50 opacity-0"
      >
        <CheckIcon />
      </Transition>
      <Transition
        show={indeterminate}
        enterActiveClass="hn-transition-press"
        enterFromClass="scale-50 opacity-0"
        leaveActiveClass="hn-transition"
        leaveToClass="scale-50 opacity-0"
      >
        <MinusIcon />
      </Transition>
    </span>
  )
}
