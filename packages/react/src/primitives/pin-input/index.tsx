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
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { VisuallyHiddenInput, useServerRender } from '../utils/hidden-input'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'

export type PinInputType = 'text' | 'number'
export type PinInputValue = Array<string | number | undefined>

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
    (Array.isArray(values) ? values : []).filter(item => !!item || (isNumericMode && item === 0))
      .length === inputElements.length
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

function getActiveElement() {
  let active = document.activeElement
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement
  return active
}

function findNextFocusableElement(
  elements: HTMLElement[],
  current: HTMLElement,
  goForward: boolean,
  loop: boolean,
  iterations = !elements.includes(current) ? elements.length + 1 : elements.length,
): HTMLElement | null {
  if (--iterations === 0) return null
  const index = elements.indexOf(current)
  const next =
    index === -1 ? (goForward ? 0 : elements.length - 1) : goForward ? index + 1 : index - 1
  if (!loop && (next < 0 || next >= elements.length)) return null
  const candidate = elements[(next + elements.length) % elements.length]
  if (!candidate) return null
  if (candidate.hasAttribute('disabled') && candidate.getAttribute('disabled') !== 'false')
    return findNextFocusableElement(elements, candidate, goForward, loop, iterations)
  return candidate
}

function arrowNavigation(
  event: KeyboardEvent<HTMLInputElement>,
  current: Element | null,
  items: HTMLElement[],
  dir: Direction,
) {
  if (!current) return
  const right = event.key === 'ArrowRight'
  const left = event.key === 'ArrowLeft'
  const up = event.key === 'ArrowUp'
  const down = event.key === 'ArrowDown'
  const home = event.key === 'Home'
  const end = event.key === 'End'
  const vertical = up || down
  const horizontal = right || left
  if (!home && !end && (!horizontal || vertical)) return
  if (!items.length) return
  event.preventDefault()
  let item: HTMLElement | null = null
  if (horizontal) {
    const goForward = dir === 'ltr' ? right : left
    item = findNextFocusableElement(items, current as HTMLElement, goForward, false)
  } else if (home) item = items.at(0) ?? null
  else if (end) item = items.at(-1) ?? null
  item?.focus()
}

const NUMBER_REG = /^\d*$/
const NON_NUMBER_REG = /\D/g
const NAVIGATION_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End']

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
      if (!target.value && target === getActiveElement()) target.placeholder = ''
      else target.placeholder = latest.current.placeholder
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

  function removeTrailingEmptyStrings(input: PinInputValue) {
    let i = input.length - 1
    while (i >= 0 && input[i] === '') {
      input.pop()
      i--
    }
    return input
  }

  function updateModelValueAt(at: number, value: string) {
    const next = [...latest.current.getModelValue()]
    if (latest.current.isNumericMode) {
      const num = +value
      if (value === '' || Number.isNaN(num)) delete next[at]
      else next[at] = num
    } else next[at] = value
    latest.current.setModelValue(removeTrailingEmptyStrings(next))
  }

  function handleMultipleCharacter(values: string) {
    const items = latest.current.inputElements
    const next = [...latest.current.getModelValue()]
    const initialIndex = values.length >= items.length ? 0 : index
    const lastIndex = Math.min(initialIndex + values.length, items.length)
    for (let i = initialIndex; i < lastIndex; i++) {
      const input = items[i]!
      const value = values[i - initialIndex]!
      if (latest.current.isNumericMode) {
        const num = Number.parseInt(value)
        if (Number.isNaN(num)) continue
        next[i] = num
      } else next[i] = value
      input.focus()
    }
    latest.current.setModelValue(next)
    items[lastIndex]?.focus()
  }

  function handleCompositionEnd(event: CompositionEvent<HTMLInputElement>) {
    const target = event.currentTarget
    const data = event.data
    void Promise.resolve().then(() => {
      composing.current = false
      const value = data || target.value
      const items = latest.current.inputElements
      if (latest.current.isNumericMode) {
        const filtered = value.replace(NON_NUMBER_REG, '')
        if (!filtered) {
          target.value = ''
          return
        }
        if (filtered.length > 1) {
          handleMultipleCharacter(filtered)
          return
        }
        target.value = filtered
        updateModelValueAt(index, filtered)
        items[index + 1]?.focus()
        return
      }
      if (value.length > 1) {
        handleMultipleCharacter(value)
        return
      }
      target.value = value
      updateModelValueAt(index, value)
      items[index + 1]?.focus()
    })
  }

  function handleInput(event: FormEvent<HTMLInputElement>) {
    const native = event.nativeEvent as InputEvent
    if (composing.current || native.isComposing) return
    const target = event.currentTarget
    if ((native.data?.length ?? 0) > 1) {
      handleMultipleCharacter(target.value)
      return
    }
    if (latest.current.isNumericMode && !NUMBER_REG.test(target.value)) {
      target.value = target.value.replace(NON_NUMBER_REG, '')
      return
    }
    target.value = native.data || target.value.slice(-1)
    updateModelValueAt(index, target.value)
    latest.current.inputElements[index + 1]?.focus()
  }

  function handleKeydown(event: KeyboardEvent<HTMLInputElement>) {
    if (composing.current || event.nativeEvent.isComposing) return
    if (NAVIGATION_KEYS.includes(event.key)) {
      arrowNavigation(event, getActiveElement(), latest.current.inputElements, latest.current.dir)
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
      const firstEmpty = items.findIndex(
        (_, at) =>
          latest.current.getModelValue()[at] === '' ||
          latest.current.getModelValue()[at] === undefined,
      )
      if (firstEmpty !== -1 && firstEmpty < index) {
        items[firstEmpty]!.focus()
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
    const raw = clipboardData.getData('text')
    handleMultipleCharacter(latest.current.isNumericMode ? raw.replace(NON_NUMBER_REG, '') : raw)
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
      aria-label={`pin input ${index + 1} of ${inputElements.length}`}
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
