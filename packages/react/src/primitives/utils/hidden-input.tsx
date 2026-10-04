'use client'

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type InputHTMLAttributes,
  type Ref,
} from 'react'
import { PrimitiveVisuallyHidden } from '../visually-hidden'
import { useComposedRefs } from './compose-refs'

const subscribe = () => () => {}

export function useServerRender() {
  return useSyncExternalStore(
    subscribe,
    () => false,
    () => true,
  )
}

export function useCurrentElement<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null)
  const ref = useCallback((node: T | null) => setElement(node), [])
  return [element, ref] as const
}

export function useFormControl(element: HTMLElement | null) {
  return element ? !!element.closest('form') : true
}

type Feature = 'focusable' | 'fully-hidden'

export interface VisuallyHiddenInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'value' | 'checked' | 'defaultValue' | 'defaultChecked'
> {
  name: string
  value: unknown
  checked?: boolean
  required?: boolean
  disabled?: boolean
  feature?: Feature
  ref?: Ref<HTMLInputElement>
}

function expand(name: string, value: unknown): Array<{ name: string; value: unknown }> {
  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null ||
    value === undefined
  )
    return [{ name, value }]
  if (Array.isArray(value))
    return value.flatMap((item, index) =>
      typeof item === 'object' && item !== null
        ? Object.entries(item).map(([key, entry]) => ({
            name: `${name}[${index}][${key}]`,
            value: entry,
          }))
        : [{ name: `${name}[${index}]`, value: item }],
    )
  if (typeof value === 'object')
    return Object.entries(value as Record<string, unknown>).map(([key, entry]) => ({
      name: `${name}[${key}]`,
      value: entry,
    }))
  return []
}

export function VisuallyHiddenInput({ name, value, required, ...props }: VisuallyHiddenInputProps) {
  const emptyAndRequired = Array.isArray(value) && value.length === 0 && !!required
  const entries = emptyAndRequired ? [{ name, value }] : expand(name, value)
  return (
    <>
      {entries.map(entry => (
        <VisuallyHiddenInputBubble
          key={entry.name}
          {...props}
          required={required}
          name={entry.name}
          value={entry.value}
        />
      ))}
    </>
  )
}

const valueSetter = () =>
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set

function domValue(input: HTMLInputElement, value: unknown) {
  if (value === null || value === undefined) return input.type === 'checkbox' ? 'on' : ''
  return String(value)
}

export function VisuallyHiddenInputBubble({
  name,
  value,
  checked,
  feature = 'fully-hidden',
  ref,
  ...attrs
}: VisuallyHiddenInputProps) {
  const node = useRef<HTMLInputElement | null>(null)
  const composedRef = useComposedRefs(ref, node)
  const server = useServerRender()
  const state = checked ?? value
  const last = useRef<{ state: unknown } | null>(null)

  useLayoutEffect(() => {
    const input = node.current
    if (!input) return
    const previous = last.current
    last.current = { state }
    if (previous && previous.state !== state) {
      valueSetter()?.call(input, state)
      input.dispatchEvent(new Event('input', { bubbles: true }))
      input.dispatchEvent(new Event('change', { bubbles: true }))
    }
    const next = domValue(input, value)
    if (input.value !== next) input.value = next
    if (value === null || value === undefined) input.removeAttribute('value')
    else input.setAttribute('value', String(value))
    if (checked !== undefined) {
      input.checked = checked
      if (checked) input.setAttribute('checked', '')
      else input.removeAttribute('checked')
    }
  })

  const serverValue =
    server && value !== null && value !== undefined
      ? { defaultValue: String(value), defaultChecked: checked }
      : server
        ? { defaultChecked: checked }
        : {}

  return (
    <PrimitiveVisuallyHidden
      as="input"
      feature={feature}
      {...(attrs as object)}
      {...serverValue}
      {...({ name } as object)}
      ref={composedRef as Ref<HTMLElement>}
    />
  )
}
