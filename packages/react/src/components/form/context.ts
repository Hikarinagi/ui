'use client'

import { createContext, createElement, useContext, type ReactNode } from 'react'
import type { FormErrors } from './standard-schema'

export interface FormContext {
  errors: FormErrors
  disabled: boolean
  touch: (name: string) => void
}

const FormReactContext = createContext<FormContext | null>(null)

export function FormProvider({ value, children }: { value: FormContext; children?: ReactNode }) {
  return createElement(FormReactContext, { value }, children)
}

export function useFormContext() {
  return useContext(FormReactContext)
}
