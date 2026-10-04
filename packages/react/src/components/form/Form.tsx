'use client'

import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type FormEvent,
  type FormHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import { same, snapshot } from '../../../../shared/src/lib/form/values'
import { focusFirstInvalid } from '../../../../shared/src/lib/form/focus'
import { useForm, type FormValidateOn } from './hooks/useForm'
import { FormProvider, type FormContext } from './context'
import { formRoot } from './form.variants'
import type { FormErrors, FormRules, FormValues } from './standard-schema'

export interface FormSlotProps {
  errors: FormErrors
  error: string | undefined
  invalid: boolean
  submitting: boolean
  submitted: boolean
}

export interface FormHandle {
  submit: () => Promise<void>
  validate: () => Promise<boolean>
  reset: () => void
  setErrors: (errors: FormErrors) => void
}

export interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> {
  values: FormValues
  rules?: FormRules
  validateOn?: FormValidateOn
  disabled?: boolean
  onSubmit?: (values: FormValues) => unknown
  children?: ReactNode | ((props: FormSlotProps) => ReactNode)
  ref?: Ref<FormHandle>
}

export function Form({
  values,
  rules,
  validateOn = 'submit',
  disabled,
  onSubmit,
  className,
  children,
  ref,
  ...attrs
}: FormProps) {
  const root = useRef<HTMLFormElement | null>(null)
  const form = useForm({ values, rules, validateOn })
  const seen = useRef<{ values: unknown } | null>(null)

  useEffect(() => {
    if (!seen.current) {
      seen.current = { values: snapshot(values) }
      return
    }
    if (same(seen.current.values, values)) return
    seen.current = { values: snapshot(values) }
    form.onChange()
  })

  const errors = form.errors()
  const submitting = form.submitting()
  const busy = !!disabled || submitting
  const context = useMemo<FormContext>(
    () => ({ errors, disabled: busy, touch: form.touch }),
    [errors, busy, form],
  )

  const latest = useRef({ disabled, onSubmit })
  latest.current = { disabled, onSubmit }

  async function submit() {
    if (latest.current.disabled || form.submitting()) return
    const ok = await form.submit(latest.current.onSubmit)
    if (!ok && root.current) focusFirstInvalid(root.current)
  }

  function setErrors(next: FormErrors) {
    form.setErrors(next)
  }

  useImperativeHandle(ref, () => ({
    submit,
    validate: form.validate,
    reset: form.reset,
    setErrors,
  }))

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit()
  }

  const slot: FormSlotProps = {
    errors,
    error: form.formError(),
    invalid: form.invalid(),
    submitting,
    submitted: form.submitted(),
  }

  return (
    <FormProvider value={context}>
      <form
        ref={root}
        data-hn-form=""
        noValidate
        aria-busy={submitting || undefined}
        {...attrs}
        className={cn(formRoot(), className)}
        onSubmit={onFormSubmit}
      >
        {typeof children === 'function' ? children(slot) : children}
      </form>
    </FormProvider>
  )
}
