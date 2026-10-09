'use client'

import { useMemo, useRef, useState } from 'react'
import type { FormErrors } from '../standard-schema'

export interface FormSlotProps {
  errors: FormErrors
  error: string | undefined
  invalid: boolean
  submitting: boolean
  submitted: boolean
}

export interface FormHandle extends Readonly<FormSlotProps> {
  submit: () => Promise<void>
  validate: () => Promise<boolean>
  reset: () => void
  setErrors: (errors: FormErrors) => void
}

export const FORM_BINDING = Symbol('hn-form-binding')

export interface FormBinding {
  attach: (handle: FormHandle | null) => void
  report: (state: FormSlotProps) => void
}

export interface FormController extends FormHandle {
  [FORM_BINDING]: FormBinding
}

const IDLE: FormSlotProps = {
  errors: {},
  error: undefined,
  invalid: false,
  submitting: false,
  submitted: false,
}

function sameErrors(a: FormErrors, b: FormErrors) {
  const keys = Object.keys(a)
  return keys.length === Object.keys(b).length && keys.every(key => a[key] === b[key])
}

function sameState(a: FormSlotProps, b: FormSlotProps) {
  return (
    a.error === b.error &&
    a.invalid === b.invalid &&
    a.submitting === b.submitting &&
    a.submitted === b.submitted &&
    sameErrors(a.errors, b.errors)
  )
}

export function useFormHandle(): FormController {
  const [state, setState] = useState(IDLE)
  const handle = useRef<FormHandle | null>(null)
  const stable = useMemo(
    () => ({
      submit: () => handle.current?.submit() ?? Promise.resolve(),
      validate: () => handle.current?.validate() ?? Promise.resolve(false),
      reset: () => handle.current?.reset(),
      setErrors: (errors: FormErrors) => handle.current?.setErrors(errors),
      [FORM_BINDING]: {
        attach(next: FormHandle | null) {
          handle.current = next
          if (!next) setState(IDLE)
        },
        report(next: FormSlotProps) {
          setState(previous => (sameState(previous, next) ? previous : next))
        },
      },
    }),
    [],
  )
  return useMemo(() => ({ ...stable, ...state }), [stable, state])
}
