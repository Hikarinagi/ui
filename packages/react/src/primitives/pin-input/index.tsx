'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type CompositionEvent,
  type FocusEvent,
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { getActiveElement } from '../../../../shared/src/primitives/focus-scope'
import {
  isPinInputComplete,
  isPinNavigationKey,
  navigatePin,
  pinFocusRedirect,
  pinInputLabel,
  pinPlaceholder,
  resolvePinComposition,
  resolvePinInput,
  resolvePinPaste,
  setPinValueAt,
  spreadPinValue,
  type PinInputValue,
  type PinTextAction,
} from '../../../../shared/src/primitives/pin-input'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { VisuallyHiddenInput, useServerRender } from '../utils/hidden-input'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'

export type PinInputType = 'text' | 'number'
export type { PinInputValue }

const both = { checkForDefaultPrevented: false }

interface PinInputRootContextValue {
  modelValue: PinInputValue
  getModelValue: () => PinInputValue
  setModelValue: (value: PinInputValue) => void
  mask: boolean
  otp: boolean
  placeholder: string
  type: PinInputType
  dir: Direction
  disabled: boolean
  isCompleted: boolean
  inputElements: HTMLInputElement[]
  register: (element: HTMLInputElement) => () => void
  isNumericMode: boolean
}

const PinInputRootContext = createContext<PinInputRootContextValue | null>(null)

function usePinInputRootContext(consumer: string) {
  const context = useContext(PinInputRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`PinInputRoot\``)
  return context
}

export interface PinInputRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir' | 'onChange' | 'placeholder'>,
    DataAttributes {
  value?: PinInputValue
  defaultValue?: PinInputValue
  onValueChange?: (value: PinInputValue) => void
  onComplete?: (value: PinInputValue) => void
  placeholder?: string
  mask?: boolean
  otp?: boolean
  type?: PinInputType
  dir?: Direction
  disabled?: boolean
  id?: string
  name?: string
  required?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function PinInputRoot({
  value,
  defaultValue,
  onValueChange,
  onComplete,
  placeholder = '',
  mask = false,
  otp = false,
  type = 'text',
  dir: dirProp,
  disabled = false,
  id,
  name,
  required,
  as,
  asChild,
  children,
  ref,
  ...attrs
}: PinInputRootProps) {
  const dir = useDirection(dirProp)
  const [local, setLocal] = useState<PinInputValue | undefined>(() => {
    const initial = value ?? defaultValue ?? []
    return [...initial]
  })
  const [synced, setSynced] = useState(value)
  const [echo, setEcho] = useState(0)
  let modelValue = local
  if (value !== synced) {
    setSynced(value)
    modelValue = value === undefined ? undefined : [...value]
    setLocal(modelValue)
    setEcho(echo + 1)
  }
  const currentModelValue = Array.isArray(modelValue) ? [...modelValue] : []
  const current = useRef(currentModelValue)
  current.current = currentModelValue
  const getModelValue = useCallback(() => current.current, [])
  const elements = useRef(new Set<HTMLInputElement>())
  const [inputElements, setInputElements] = useState<HTMLInputElement[]>([])
  const isNumericMode = type === 'number'
  const completed = (values: PinInputValue | undefined) =>
    isPinInputComplete(Array.isArray(values) ? values : [], inputElements.length, isNumericMode)
  const isCompleted = completed(modelValue)

  const latest = useRef({ onValueChange, onComplete, completed })
  latest.current = { onValueChange, onComplete, completed }

  const setModelValue = useCallback((next: PinInputValue) => {
    current.current = [...next]
    setLocal(next)
    latest.current.onValueChange?.([...next])
    if (latest.current.completed(next)) latest.current.onComplete?.(next)
  }, [])

  const register = useCallback((element: HTMLInputElement) => {
    elements.current.add(element)
    setInputElements([...elements.current])
    return () => {
      elements.current.delete(element)
      setInputElements([...elements.current])
    }
  }, [])

  const echoed = useRef(echo)
  useEffect(() => {
    if (echoed.current === echo) return
    echoed.current = echo
    latest.current.onValueChange?.(modelValue === undefined ? [] : [...modelValue])
    if (isCompleted) latest.current.onComplete?.(modelValue ?? [])
  }, [echo])

  return (
    <PinInputRootContext
      value={{
        modelValue: currentModelValue,
        getModelValue,
        setModelValue,
        mask,
        otp,
        placeholder,
        type,
        dir,
        disabled,
        isCompleted,
        inputElements,
        register,
        isNumericMode,
      }}
    >
      <Primitive
        {...attrs}
        ref={ref}
        as={as}
        asChild={asChild}
        dir={dir}
        data-complete={isCompleted ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
      >
        {children}
        <VisuallyHiddenInput
          id={id}
          feature="focusable"
          tabIndex={-1}
          value={currentModelValue.join('')}
          name={name ?? ''}
          disabled={disabled}
          required={required}
          onFocus={() => inputElements[0]?.focus()}
        />
      </Primitive>
    </PinInputRootContext>
  )
}

export interface PinInputInputProps
  extends
    PrimitiveProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'type'>,
    DataAttributes {
  index: number
  disabled?: boolean
  ref?: Ref<HTMLInputElement>
}

export function PinInputInput({
  index,
  disabled: disabledProp,
  as = 'input',
  asChild,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  onPaste,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...attrs
}: PinInputInputProps) {
  const context = usePinInputRootContext('PinInputInput')
  const server = useServerRender()
  const node = useRef<HTMLInputElement | null>(null)
  const composedRef = useComposedRefs(ref, node)
  const inputElements = context.inputElements
  const currentValue = context.modelValue[index]
  const disabled = !!disabledProp || context.disabled
  const composing = useRef(false)
  const latest = useRef(context)
  latest.current = context

  const { register } = context
  useEffect(() => {
    const element = node.current
    if (!element) return
    return register(element)
  }, [register])

  useLayoutEffect(() => {
    const element = node.current
    if (!element) return
    const next = currentValue === undefined || currentValue === null ? '' : String(currentValue)
    if (element.value !== next) element.value = next
    if (currentValue === undefined || currentValue === null) element.removeAttribute('value')
    else element.setAttribute('value', String(currentValue))
  })

  function updatePlaceholder() {
    void Promise.resolve().then(() => {
      const target = node.current
      if (!target) return
      pinPlaceholder(target, getActiveElement(), latest.current.placeholder)
    })
  }

  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    updatePlaceholder()
  }, [currentValue])

  function updateModelValueAt(at: number, value: string) {
    latest.current.setModelValue(
      setPinValueAt(latest.current.getModelValue(), at, value, latest.current.isNumericMode),
    )
  }

  function handleMultipleCharacter(characters: string) {
    const items = latest.current.inputElements
    const { values, filled, end } = spreadPinValue(
      latest.current.getModelValue(),
      characters,
      index,
      items.length,
      latest.current.isNumericMode,
    )
    for (const at of filled) items[at]!.focus()
    latest.current.setModelValue(values)
    items[end]?.focus()
  }

  function apply(target: HTMLInputElement, action: PinTextAction) {
    if (action.kind === 'clear') target.value = ''
    else if (action.kind === 'filter') target.value = action.value
    else if (action.kind === 'spread') handleMultipleCharacter(action.characters)
    else {
      target.value = action.character
      updateModelValueAt(index, target.value)
      latest.current.inputElements[index + 1]?.focus()
    }
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    const target = event.currentTarget
    const data = event.data
    void Promise.resolve().then(() => {
      composing.current = false
      apply(target, resolvePinComposition(data || target.value, latest.current.isNumericMode))
    })
  }

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const native = event.nativeEvent as InputEvent
    if (composing.current || native.isComposing) return
    const target = event.currentTarget
    apply(target, resolvePinInput(native.data, target.value, latest.current.isNumericMode))
  }

  function handleKeydown(event: KeyboardEvent<HTMLInputElement>) {
    if (composing.current || event.nativeEvent.isComposing) return
    if (isPinNavigationKey(event.key)) {
      navigatePin(
        event.nativeEvent,
        getActiveElement() as HTMLElement | null,
        latest.current.inputElements,
        latest.current.dir,
      )
      return
    }
    if (event.key === 'Backspace') {
      event.preventDefault()
      const target = event.currentTarget
      if (target.value) updateModelValueAt(index, '')
      else {
        const previous = latest.current.inputElements[index - 1]
        if (previous) {
          previous.focus()
          updateModelValueAt(index - 1, '')
        }
      }
      return
    }
    if (event.key === 'Delete') {
      event.preventDefault()
      updateModelValueAt(index, '')
    }
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    if (latest.current.otp) {
      const items = latest.current.inputElements
      const redirect = pinFocusRedirect(latest.current.getModelValue(), items.length, index)
      if (redirect !== -1) {
        items[redirect]!.focus()
        return
      }
    }
    event.currentTarget.setSelectionRange(1, 1)
    updatePlaceholder()
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault()
    const clipboardData = event.clipboardData
    if (!clipboardData) return
    handleMultipleCharacter(
      resolvePinPaste(clipboardData.getData('text'), latest.current.isNumericMode),
    )
  }

  return (
    <Primitive
      {...({
        autoCapitalize: 'none',
        autoComplete: context.otp ? 'one-time-code' : 'false',
        type: context.mask ? 'password' : 'text',
        inputMode: context.isNumericMode ? 'numeric' : 'text',
        pattern: context.isNumericMode ? '[0-9]*' : undefined,
        placeholder: context.placeholder,
        defaultValue: server
          ? currentValue === undefined || currentValue === null
            ? undefined
            : String(currentValue)
          : undefined,
        disabled,
      } as HTMLAttributes<HTMLElement>)}
      ref={composedRef as Ref<HTMLElement>}
      as={as}
      asChild={asChild}
      data-disabled={disabled ? '' : undefined}
      data-complete={context.isCompleted ? '' : undefined}
      aria-label={pinInputLabel(index, inputElements.length)}
      {...(attrs as HTMLAttributes<HTMLElement>)}
      onInput={composeEventHandlers(onInput, handleInput, both)}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeydown, both)}
      onFocus={composeEventHandlers(onFocus, handleFocus, both)}
      onBlur={composeEventHandlers(onBlur, () => updatePlaceholder(), both)}
      onPaste={composeEventHandlers(onPaste, handlePaste, both)}
      onCompositionStart={composeEventHandlers(
        onCompositionStart,
        () => {
          composing.current = true
        },
        both,
      )}
      onCompositionEnd={composeEventHandlers(onCompositionEnd, handleCompositionEnd, both)}
    />
  )
}
