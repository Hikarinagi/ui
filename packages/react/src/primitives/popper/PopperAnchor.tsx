'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from 'react'
import type { ReferenceElement } from '@floating-ui/react-dom'
import { useComposedRefs } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { usePopperRootContext } from './PopperRoot'

export interface PopperAnchorProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  reference?: ReferenceElement
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function PopperAnchor({ reference, ref, ...props }: PopperAnchorProps) {
  const { onAnchorChange } = usePopperRootContext('PopperAnchor')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)

  useLayoutEffect(() => {
    onAnchorChange(reference ?? element ?? undefined)
  }, [reference, element, onAnchorChange])

  return <Primitive {...props} ref={composedRef} />
}

export interface PopperVirtualAnchorProps {
  anchor: RefObject<ReferenceElement | null | undefined>
}

export function PopperVirtualAnchor({ anchor }: PopperVirtualAnchorProps) {
  const { onAnchorChange } = usePopperRootContext('PopperAnchor')
  const previous = useRef<ReferenceElement | null | undefined>(undefined)
  const sync = () => {
    if (Object.is(previous.current, anchor.current)) return
    previous.current = anchor.current
    onAnchorChange(anchor.current ?? undefined)
  }
  useLayoutEffect(sync)
  useEffect(sync)
  return null
}
