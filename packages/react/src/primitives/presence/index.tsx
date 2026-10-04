'use client'

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactElement,
  type Ref,
} from 'react'
import { createPresence, type PresenceController } from '../../../../shared/src/primitives/presence'
import { useComposedRefs } from '../utils/compose-refs'
import { useLayoutEffect } from '../utils/layout-effect'

type PresenceChild = ReactElement

export interface PresenceProps {
  present: boolean
  children: PresenceChild | ((props: { present: boolean }) => PresenceChild)
}

function childRef(child: PresenceChild | null) {
  const props = child?.props as { ref?: Ref<HTMLElement> } | undefined
  return props?.ref ?? (child as unknown as { ref?: Ref<HTMLElement> } | null)?.ref
}

export function Presence({ present, children }: PresenceProps) {
  const [node, setNode] = useState<HTMLElement | null>(null)
  const [, rerender] = useReducer((count: number) => count + 1, 0)
  const controller = useRef<PresenceController | null>(null)
  controller.current ??= createPresence(present, rerender)
  const previous = useRef<boolean | undefined>(undefined)

  useLayoutEffect(() => {
    controller.current!.setNode(node)
  }, [node])

  useLayoutEffect(() => {
    controller.current!.update(present, previous.current)
    previous.current = present
  }, [present])

  useEffect(() => () => controller.current!.dispose(), [])

  const isPresent = controller.current.present
  const forceMount = typeof children === 'function'
  const child = forceMount
    ? children({ present: isPresent })
    : (Children.only(children) as PresenceChild)
  const ref = useComposedRefs(childRef(isValidElement(child) ? child : null), setNode)
  if (!forceMount && !isPresent) return null
  return isValidElement(child)
    ? cloneElement(child as ReactElement<{ ref?: Ref<HTMLElement> }>, { ref })
    : null
}
