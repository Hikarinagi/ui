'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
  type RefObject,
} from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from '../collapsible'
import { arrowNavigation } from './arrow-navigation'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type AccordionType = 'single' | 'multiple'
type AccordionValue = string | string[] | undefined

interface AccordionRootContextValue {
  disabled: boolean
  direction: 'ltr' | 'rtl'
  orientation: 'vertical' | 'horizontal'
  parentElement: RefObject<HTMLElement | null>
  isSingle: boolean
  collapsible: boolean
  modelValue: AccordionValue
  changeModelValue: (value: string) => void
  unmountOnHide: boolean
}

const AccordionRootContext = createContext<AccordionRootContextValue | null>(null)

function useAccordionRootContext(consumer: string) {
  const context = useContext(AccordionRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`AccordionRoot\``)
  return context
}

function defaultType(
  type: AccordionType | undefined,
  value: AccordionValue,
  defaultValue: AccordionValue,
) {
  if (type) return type
  const current = value || defaultValue
  if (value !== undefined || defaultValue !== undefined)
    return Array.isArray(current) ? 'multiple' : 'single'
  return 'single'
}

function defaultModelValue(type: AccordionType | undefined, defaultValue: AccordionValue) {
  if (defaultValue !== undefined) return defaultValue
  return type === 'single' ? undefined : []
}

export interface AccordionRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'>,
    DataAttributes {
  collapsible?: boolean
  disabled?: boolean
  dir?: 'ltr' | 'rtl'
  orientation?: 'vertical' | 'horizontal'
  unmountOnHide?: boolean
  type?: AccordionType
  value?: AccordionValue
  defaultValue?: AccordionValue
  onValueChange?: (value: AccordionValue) => void
  ref?: Ref<HTMLElement>
}

export function AccordionRoot({
  collapsible = false,
  disabled = false,
  dir,
  orientation = 'vertical',
  unmountOnHide = true,
  type,
  value,
  defaultValue,
  onValueChange,
  ref,
  ...attrs
}: AccordionRootProps) {
  const direction = useDirection(dir)
  const parentElement = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parentElement)
  const resolvedType = defaultType(type, value, defaultValue)
  const [modelValue, setModelValue] = useControllableState<AccordionValue>({
    prop: value,
    defaultProp: defaultModelValue(type, defaultValue),
    onChange: onValueChange,
    caller: 'AccordionRoot',
  })

  const changeModelValue = useCallback(
    (next: string) => {
      if (resolvedType === 'single') {
        setModelValue(next === modelValue ? undefined : next)
        return
      }
      const list = Array.isArray(modelValue)
        ? [...(modelValue || [])]
        : [modelValue].filter((entry): entry is string => !!entry)
      const index = list.findIndex(entry => entry === next)
      if (index !== -1) list.splice(index, 1)
      else list.push(next)
      setModelValue(list)
    },
    [resolvedType, modelValue, setModelValue],
  )

  return (
    <AccordionRootContext
      value={{
        disabled,
        direction,
        orientation,
        parentElement,
        isSingle: resolvedType === 'single',
        collapsible,
        modelValue,
        changeModelValue,
        unmountOnHide,
      }}
    >
      <Primitive {...attrs} ref={composedRef} />
    </AccordionRootContext>
  )
}

interface AccordionItemContextValue {
  open: boolean
  dataState: 'open' | 'closed'
  disabled: boolean
  dataDisabled: '' | undefined
  triggerId: RefObject<string>
  value: string
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null)

function useAccordionItemContext(consumer: string) {
  const context = useContext(AccordionItemContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`AccordionItem\``)
  return context
}

const NAVIGATION_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']

export interface AccordionItemProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  value: string
  disabled?: boolean
  unmountOnHide?: boolean
  ref?: Ref<HTMLElement>
}

export function AccordionItem({
  value,
  disabled: disabledProp,
  unmountOnHide,
  onKeyDown,
  ...attrs
}: AccordionItemProps) {
  const root = useAccordionRootContext('AccordionItem')
  const triggerId = useRef('')
  const open = root.isSingle
    ? value === root.modelValue
    : Array.isArray(root.modelValue) && root.modelValue.includes(value)
  const disabled = root.disabled || !!disabledProp
  const dataDisabled = disabled ? '' : undefined
  const dataState = open ? 'open' : 'closed'

  function handleArrowKey(event: KeyboardEvent<HTMLElement>) {
    if (!NAVIGATION_KEYS.includes(event.key)) return
    const target = event.target as HTMLElement
    const items = Array.from(
      root.parentElement.current?.querySelectorAll('[data-radix-collection-item]') ?? [],
    )
    if (items.findIndex(item => item === target) === -1) return
    arrowNavigation(event.nativeEvent, target, root.parentElement.current, {
      arrowKeyOptions: root.orientation,
      dir: root.direction,
      focus: true,
    })
  }

  return (
    <AccordionItemContext value={{ open, dataState, disabled, dataDisabled, triggerId, value }}>
      <CollapsibleRoot
        data-orientation={root.orientation}
        data-disabled={dataDisabled}
        data-state={dataState}
        disabled={disabled}
        open={open}
        unmountOnHide={unmountOnHide ?? root.unmountOnHide}
        {...attrs}
        onKeyDown={composeEventHandlers(onKeyDown, handleArrowKey)}
      />
    </AccordionItemContext>
  )
}

export interface AccordionHeaderProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function AccordionHeader({ as = 'h3', ...attrs }: AccordionHeaderProps) {
  const root = useAccordionRootContext('AccordionHeader')
  const item = useAccordionItemContext('AccordionHeader')
  return (
    <Primitive
      as={as}
      data-orientation={root.orientation}
      data-state={item.dataState}
      data-disabled={item.dataDisabled}
      {...attrs}
    />
  )
}

export interface AccordionTriggerProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function AccordionTrigger({ onClick, ...attrs }: AccordionTriggerProps) {
  const root = useAccordionRootContext('AccordionTrigger')
  const item = useAccordionItemContext('AccordionTrigger')
  const id = useId()
  if (!item.triggerId.current) item.triggerId.current = id

  function changeItem() {
    const triggerDisabled = root.isSingle && item.open && !root.collapsible
    if (item.disabled || triggerDisabled) return
    root.changeModelValue(item.value)
  }

  return (
    <CollapsibleTrigger
      id={item.triggerId.current}
      data-radix-collection-item=""
      aria-disabled={item.disabled || undefined}
      aria-expanded={item.open || false}
      data-disabled={item.dataDisabled}
      data-orientation={root.orientation}
      data-state={item.dataState}
      {...({ disabled: item.disabled } as HTMLAttributes<HTMLElement>)}
      {...attrs}
      onClick={composeEventHandlers(onClick, changeItem)}
    />
  )
}

export interface AccordionContentProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  forceMount?: boolean
  ref?: Ref<HTMLElement>
}

export function AccordionContent({ style, ...attrs }: AccordionContentProps) {
  const root = useAccordionRootContext('AccordionContent')
  const item = useAccordionItemContext('AccordionContent')
  return (
    <CollapsibleContent
      role="region"
      aria-labelledby={item.triggerId.current}
      data-state={item.dataState}
      data-disabled={item.dataDisabled}
      data-orientation={root.orientation}
      {...attrs}
      style={
        {
          '--radix-accordion-content-width': 'var(--radix-collapsible-content-width)',
          '--radix-accordion-content-height': 'var(--radix-collapsible-content-height)',
          ...style,
        } as CSSProperties
      }
      onContentFound={() => root.changeModelValue(item.value)}
    />
  )
}
