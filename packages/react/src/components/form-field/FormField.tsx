'use client'

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react'
import { useComposedRefs } from 'radix-ui/internal'
import { cn } from '../../lib/cn'
import { collapseHooks, writeCollapseGap } from '../../lib/collapse'
import { hasContent } from '../../lib/content'
import { Transition } from '../../lib/transition/Transition'
import { useUiLocale } from '../../locale'
import { VisuallyHidden } from '../visually-hidden/VisuallyHidden'
import { useFormContext } from '../form/context'
import { useFormFieldLayout } from '../form-layout/context'
import { FormFieldProvider, type FormFieldContext } from './context'
import type { FormFieldLayoutProps } from './types'
import {
  formFieldContent,
  formFieldControl,
  formFieldDescription,
  formFieldLabel,
  formFieldLayout,
  formFieldMark,
  formFieldMessage,
  formFieldRoot,
} from './form-field.variants'

export interface FormFieldProps
  extends FormFieldLayoutProps, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  name?: string
  label?: ReactNode
  description?: ReactNode
  error?: string
  required?: boolean
  disabled?: boolean
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}

function filled(node: ReactNode) {
  return hasContent(node) && node !== ''
}

export function FormField({
  name,
  label,
  description,
  error,
  required,
  disabled: disabledProp,
  orientation,
  descriptionPlacement,
  labelWidth,
  className,
  style,
  children,
  onBlur,
  ref,
  ...attrs
}: FormFieldProps) {
  const layout = useFormFieldLayout({ orientation, descriptionPlacement, labelWidth })
  const t = useUiLocale()
  const form = useFormContext()

  const root = useRef<HTMLDivElement | null>(null)
  const body = useRef<HTMLDivElement | null>(null)
  const composedRef = useComposedRefs(ref, root)
  const hooks = useMemo(() => {
    const base = collapseHooks('y', () => body.current)
    return {
      ...base,
      beforeEnter(el: HTMLElement) {
        writeCollapseGap(el, body.current, 'y')
      },
    }
  }, [])

  const id = useId()
  const labelId = useId()
  const descriptionId = useId()
  const messageId = useId()
  const [controlId, setControlIdState] = useState(id)
  const order = useRef(0)
  const best = useRef(-1)

  const claim = useCallback(() => ++order.current, [])
  const setControlId = useCallback((next: string, priority: number) => {
    if (priority < best.current) return
    best.current = priority
    setControlIdState(next)
  }, [])

  const message = error || (name ? form?.errors[name] : undefined)
  const invalid = !!message
  const disabled = !!disabledProp || !!form?.disabled
  const described = filled(description)
  const headed = filled(label)
  const descriptionWithLabel = described && layout.descriptionPlacement === 'label'
  const contentOrientation = headed || descriptionWithLabel ? layout.orientation : 'vertical'
  const layoutStyle = {
    '--hn-form-label-width':
      typeof layout.labelWidth === 'number' ? `${layout.labelWidth}px` : layout.labelWidth,
  } as CSSProperties
  const describedIds = []
  if (described) describedIds.push(descriptionId)
  if (invalid) describedIds.push(messageId)
  const describedBy = describedIds.length ? describedIds.join(' ') : undefined

  const context = useMemo<FormFieldContext>(
    () => ({
      id,
      labelId,
      controlId,
      setControlId,
      claim,
      name,
      invalid,
      disabled,
      describedBy,
    }),
    [id, labelId, controlId, setControlId, claim, name, invalid, disabled, describedBy],
  )

  function onFocusOut(event: FocusEvent<HTMLDivElement>) {
    onBlur?.(event)
    if (name) form?.touch(name)
  }

  const descriptionNode = (
    <p id={descriptionId} className={formFieldDescription()}>
      {description}
    </p>
  )

  return (
    <FormFieldProvider value={context}>
      <div
        ref={composedRef}
        data-hn-form-field=""
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-orientation={layout.orientation}
        {...attrs}
        className={cn(formFieldRoot({ orientation: layout.orientation }), className)}
        style={{ ...style, ...layoutStyle }}
        onBlur={onFocusOut}
      >
        <div
          data-hn-form-field-layout=""
          className={formFieldLayout({ orientation: contentOrientation })}
        >
          {(headed || descriptionWithLabel) && (
            <div data-hn-form-field-header="" className={formFieldContent()}>
              {headed && (
                <label
                  id={labelId}
                  htmlFor={controlId}
                  className={formFieldLabel({ disabled, orientation: contentOrientation })}
                >
                  {label}
                  {required && (
                    <span className={formFieldMark()} aria-hidden="true">
                      *
                    </span>
                  )}
                  {required && <VisuallyHidden>{t.form.required}</VisuallyHidden>}
                </label>
              )}
              {descriptionWithLabel && descriptionNode}
            </div>
          )}
          <div ref={body} data-hn-form-field-body="" className={formFieldContent()}>
            <div
              data-hn-form-field-control=""
              className={formFieldControl({ orientation: contentOrientation })}
            >
              {children}
            </div>
            {described && !descriptionWithLabel && descriptionNode}
            <Transition
              show={!!message}
              enterFromClass="hn-collapse-closed"
              enterToClass="hn-collapse-open"
              leaveFromClass="hn-collapse-open"
              leaveToClass="hn-collapse-closed"
              onBeforeEnter={hooks.beforeEnter}
              onAfterEnter={hooks.afterEnter}
              onBeforeLeave={hooks.beforeLeave}
            >
              <div
                data-hn-form-field-message=""
                className="hn-collapse [--hn-collapse-out:var(--hn-duration-fast)]"
              >
                <div className="hn-collapse-body">
                  <p id={messageId} className={formFieldMessage()} aria-live="polite">
                    {message}
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </FormFieldProvider>
  )
}
