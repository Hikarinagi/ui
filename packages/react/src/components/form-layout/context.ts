'use client'

import { createContext, createElement, useContext, useMemo, type ReactNode } from 'react'
import type { FormFieldLayoutProps } from '../form-field/types'

type FieldLayout = Required<FormFieldLayoutProps>

const FormLayoutReactContext = createContext<FieldLayout | null>(null)

export function useFormFieldLayout(props: FormFieldLayoutProps): FieldLayout {
  const parent = useContext(FormLayoutReactContext)
  const orientation = props.orientation ?? parent?.orientation ?? 'vertical'
  const descriptionPlacement =
    props.descriptionPlacement ?? parent?.descriptionPlacement ?? 'control'
  const labelWidth = props.labelWidth ?? parent?.labelWidth ?? '10rem'
  return useMemo(
    () => ({ orientation, descriptionPlacement, labelWidth }),
    [orientation, descriptionPlacement, labelWidth],
  )
}

export function FormLayoutProvider({
  value,
  children,
}: {
  value: FieldLayout
  children?: ReactNode
}) {
  return createElement(FormLayoutReactContext, { value }, children)
}
