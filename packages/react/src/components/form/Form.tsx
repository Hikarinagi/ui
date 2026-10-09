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
import {
  FORM_BINDING,
  type FormController,
  type FormHandle,
  type FormSlotProps,
} from './hooks/useFormHandle'
import { useFormScopeReport } from './scope'
import { useLayoutEffect } from '../../primitives/utils/layout-effect'
import { FormProvider, type FormContext } from './context'
import { formRoot } from './form.variants'
import type { FormErrors, FormRules, FormValues } from './standard-schema'

export type { FormController, FormHandle, FormSlotProps } from './hooks/useFormHandle'

export interface FormProps extends Omit<
  FormHTMLAttributes<HTMLFormElement>,
  'onSubmit' | 'children'
> {
  values: FormValues
  rules?: FormRules
  validateOn?: FormValidateOn
  disabled?: boolean
  form?: FormController
  onSubmit?: (values: FormValues) => unknown
  children?: ReactNode | ((props: FormSlotProps) => ReactNode)
  ref?: Ref<FormHandle>
}

export function Form({
  values,
  rules,
  validateOn = 'submit',
  disabled,
  form: controller,
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

  const submitNow = useRef(submit)
  submitNow.current = submit
  const handle = useMemo<FormHandle>(
    () => ({
      submit: () => submitNow.current(),
      validate: form.validate,
      reset: form.reset,
      setErrors: next => form.setErrors(next),
      get errors() {
        return form.errors()
      },
      get error() {
        return form.formError()
      },
      get invalid() {
        return form.invalid()
      },
      get submitting() {
        return form.submitting()
      },
      get submitted() {
        return form.submitted()
      },
    }),
    [form],
  )

  useImperativeHandle(ref, () => handle, [handle])

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

  const binding = controller?.[FORM_BINDING]
  useLayoutEffect(() => {
    if (!binding) return
    binding.attach(handle)
    return () => binding.attach(null)
  }, [binding, handle])
  useLayoutEffect(() => {
    binding?.report(slot)
  })
  useFormScopeReport(submitting)

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
