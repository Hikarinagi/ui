'use client'

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  use,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { useComposedRefs } from './compose-refs'

type AnyProps = Record<string, unknown>

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

const LAZY = Symbol.for('react.lazy')

function lazyPayload(node: unknown): PromiseLike<ReactNode> | undefined {
  if (node == null || typeof node !== 'object') return undefined
  const lazy = node as { $$typeof?: symbol; _payload?: unknown }
  if (lazy.$$typeof !== LAZY) return undefined
  const payload = lazy._payload
  return payload != null && typeof payload === 'object' && 'then' in payload
    ? (payload as PromiseLike<ReactNode>)
    : undefined
}

function elementRef(element: ReactElement): Ref<unknown> | undefined {
  const props = element.props as { ref?: Ref<unknown> }
  return props.ref ?? (element as unknown as { ref?: Ref<unknown> }).ref
}

function mergeProps(slot: AnyProps, child: AnyProps) {
  const overrides: AnyProps = { ...child }
  for (const name in child) {
    const slotValue = slot[name]
    const childValue = child[name]
    if (/^on[A-Z]/.test(name)) {
      if (typeof slotValue === 'function' && typeof childValue === 'function')
        overrides[name] = (...args: unknown[]) => {
          const result = childValue(...args)
          slotValue(...args)
          return result
        }
      else if (slotValue) overrides[name] = slotValue
    } else if (name === 'style') {
      overrides[name] = { ...(slotValue as object), ...(childValue as object) }
    } else if (name === 'className') {
      overrides[name] = [slotValue, childValue].filter(Boolean).join(' ')
    }
  }
  return { ...slot, ...overrides }
}

export function Slot({ children, ref, ...slotProps }: SlotProps) {
  const payload = lazyPayload(children)
  const resolved = payload ? use(payload) : children
  const element =
    Children.count(resolved) === 1 && isValidElement(resolved)
      ? (resolved as ReactElement<AnyProps>)
      : null
  const composed = useComposedRefs(ref, element ? elementRef(element) : undefined)
  if (!element) {
    if (resolved || resolved === 0)
      throw new Error(
        'Slot failed to slot onto its children. Expected a single React element child.',
      )
    return resolved
  }
  const merged = mergeProps(slotProps as AnyProps, element.props ?? {})
  if (element.type !== Fragment) merged.ref = ref ? composed : elementRef(element)
  return cloneElement(element, merged)
}
