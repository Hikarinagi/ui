'use client'

import { useId, useMemo, type FieldsetHTMLAttributes, type ReactNode, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { FormProvider, useFormContext, type FormContext } from '../form/context'
import type { FormErrors } from '../form/standard-schema'
import type { FormFieldLayoutProps } from '../form-field/types'
import { FormLayoutProvider, useFormFieldLayout } from './context'
import {
  formLayoutDescription,
  formLayoutGrid,
  formLayoutLegend,
  formLayoutRoot,
  type FormLayoutVariants,
} from './form-layout.variants'

export interface FormLayoutProps
  extends FormFieldLayoutProps, Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'children'> {
  legend?: ReactNode
  description?: ReactNode
  columns?: FormLayoutVariants['columns']
  disabled?: boolean
  children?: ReactNode
  ref?: Ref<HTMLFieldSetElement>
}

const NO_ERRORS: FormErrors = {}
const noop = () => {}

function filled(node: ReactNode) {
  return hasContent(node) && node !== ''
}

export function FormLayout({
  legend,
  description,
  columns = 1,
  disabled: disabledProp,
  orientation,
  descriptionPlacement,
  labelWidth,
  className,
  children,
  ...attrs
}: FormLayoutProps) {
  const layout = useFormFieldLayout({ orientation, descriptionPlacement, labelWidth })
  const form = useFormContext()
  const descriptionId = useId()

  const headed = filled(legend)
  const described = filled(description)
  const disabled = !!disabledProp || !!form?.disabled
  const errors = form?.errors ?? NO_ERRORS
  const touch = form?.touch ?? noop

  const context = useMemo<FormContext>(
    () => ({ errors, disabled, touch }),
    [errors, disabled, touch],
  )

  return (
    <FormLayoutProvider value={layout}>
      <FormProvider value={context}>
        <fieldset
          data-hn-form-layout=""
          disabled={disabled || undefined}
          aria-describedby={described ? descriptionId : undefined}
          {...attrs}
          className={cn(formLayoutRoot(), className)}
        >
          {headed && <legend className={formLayoutLegend()}>{legend}</legend>}
          {described && (
            <p id={descriptionId} className={formLayoutDescription()}>
              {description}
            </p>
          )}
          <div className={formLayoutGrid({ columns, headed: headed || described })}>{children}</div>
        </fieldset>
      </FormProvider>
    </FormLayoutProvider>
  )
}
