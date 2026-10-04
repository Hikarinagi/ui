'use client'

import {
  createContext,
  createElement,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export interface FormFieldContext {
  id: string
  labelId: string
  controlId: string
  setControlId: (id: string, order: number) => void
  claim: () => number
  name: string | undefined
  invalid: boolean
  disabled: boolean
  describedBy: string | undefined
}

const FormFieldReactContext = createContext<FormFieldContext | null>(null)

export function FormFieldProvider({
  value,
  children,
}: {
  value: FormFieldContext
  children?: ReactNode
}) {
  return createElement(FormFieldReactContext, { value }, children)
}

export function FormFieldShield({ children }: { children?: ReactNode }) {
  return createElement(FormFieldReactContext, { value: null }, children)
}

export function useFormField() {
  return useContext(FormFieldReactContext)
}

export interface FieldControlOwn {
  invalid?: boolean
  disabled?: boolean
}

export interface FieldControlAttrs {
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
}

export function useFieldControl(own: FieldControlOwn = {}, attrs: FieldControlAttrs = {}) {
  const field = useFormField()
  const id = attrs.id ?? field?.id
  const labelledBy = attrs['aria-labelledby'] ?? (attrs['aria-label'] ? undefined : field?.labelId)
  const invalid = !!own.invalid || !!field?.invalid
  const disabled = !!own.disabled || !!field?.disabled
  const parts = [attrs['aria-describedby'], field?.describedBy].filter(Boolean)
  const describedBy = parts.length ? parts.join(' ') : undefined
  const [order] = useState(() => field?.claim() ?? 0)
  const written = useRef<string | undefined>(undefined)
  const setControlId = field?.setControlId
  const claim = field?.claim
  const fieldId = field?.id

  useLayoutEffect(() => {
    if (!setControlId || !claim || fieldId === undefined) return
    const next = id ?? fieldId
    const priority = written.current === undefined || written.current === next ? order : claim()
    written.current = next
    setControlId(next, priority)
  }, [setControlId, claim, fieldId, id, order])

  return { field, id, labelledBy, invalid, disabled, describedBy }
}
