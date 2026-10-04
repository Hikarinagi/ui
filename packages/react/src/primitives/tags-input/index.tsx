'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type CompositionEvent as ReactCompositionEvent,
  type FocusEvent as ReactFocusEvent,
  type FormEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
} from 'react'
import { Direction as RadixDirection } from 'radix-ui'
import { useComposedRefs } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { COLLECTION_ITEM, createCollection, isEqual, type Collection } from '../listbox/utils'
import { useVModel } from '../listbox/useVModel'
import { VisuallyHiddenInput, useFormControl } from '../utils/hidden-input'
import { useComposing } from '../utils/composing'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'

export type AcceptableInputValue = string | number | bigint | Record<string, unknown>

export interface TagsInputRootContextValue {
  modelValue: AcceptableInputValue[]
  onAddValue: (payload: string) => boolean
  onRemoveValue: (index: number) => void
  onInputKeydown: (event: KeyboardEvent) => void
  selectedElement: HTMLElement | undefined
  isInvalidInput: boolean
  setInvalidInput: (invalid: boolean) => void
  setSelectedElement: (element: HTMLElement | undefined) => void
  addOnPaste: boolean
  addOnTab: boolean
  addOnBlur: boolean
  disabled: boolean
  delimiter: string | RegExp
  dir: Direction
  max: number
  id: string | undefined
  displayValue: (value: AcceptableInputValue) => string
  collection: Collection<AcceptableInputValue>
}

const TagsInputRootContext = createContext<TagsInputRootContextValue | null>(null)

export function useTagsInputRootContext(consumer = 'TagsInputRoot') {
  const context = useContext(TagsInputRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TagsInputRoot\``)
  return context
}

export interface TagsInputRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'dir' | 'defaultValue' | 'onChange' | 'onInvalid'>,
    DataAttributes {
  value?: AcceptableInputValue[] | null
  defaultValue?: AcceptableInputValue[]
  onValueChange?: (value: AcceptableInputValue[]) => void
  addOnPaste?: boolean
  addOnTab?: boolean
  addOnBlur?: boolean
  duplicate?: boolean
  disabled?: boolean
  delimiter?: string | RegExp
  dir?: Direction
  max?: number
  id?: string
  name?: string
  required?: boolean
  convertValue?: (value: string) => AcceptableInputValue
  displayValue?: (value: AcceptableInputValue) => string
  onInvalid?: (payload: AcceptableInputValue) => void
  onAddTag?: (payload: AcceptableInputValue) => void
  onRemoveTag?: (payload: AcceptableInputValue) => void
  ref?: Ref<HTMLElement>
}

const EMPTY: AcceptableInputValue[] = []
const toText = (value: AcceptableInputValue) => value.toString()

function arrowTarget(
  event: KeyboardEvent,
  current: HTMLElement,
  items: HTMLElement[],
  dir: Direction,
) {
  const index = items.indexOf(current)
  if (index < 0) return null
  const right = dir === 'rtl' ? -1 : 1
  let next = index
  if (event.key === 'ArrowRight') next = index + right
  else if (event.key === 'ArrowLeft') next = index - right
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = items.length - 1
  else return null
  return items[next] ?? null
}

export function TagsInputRoot({
  value: valueProp,
  defaultValue = EMPTY,
  onValueChange,
  addOnPaste = false,
  addOnTab = false,
  addOnBlur = false,
  duplicate = false,
  disabled = false,
  delimiter = ',',
  dir: dirProp,
  max = 0,
  id,
  name,
  required,
  convertValue,
  displayValue = toText,
  onInvalid,
  onAddTag,
  onRemoveTag,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: TagsInputRootProps) {
  const dir = RadixDirection.useDirection(dirProp)
  const [modelValue, setModelState] = useVModel<AcceptableInputValue[] | null>(
    valueProp,
    defaultValue,
    onValueChange as ((value: AcceptableInputValue[] | null) => void) | undefined,
  )
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const [focused, setFocused] = useState(false)
  const isFormControl = useFormControl(element)
  const [collection] = useState(() => createCollection<AcceptableInputValue>())
  const [selectedElement, setSelectedState] = useState<HTMLElement | undefined>(undefined)
  const [isInvalidInput, setInvalidState] = useState(false)
  const selectedRef = useRef<HTMLElement | undefined>(undefined)
  const modelRef = useRef(modelValue)
  modelRef.current = modelValue
  const latest = useRef({
    setModelState,
    duplicate,
    max,
    convertValue,
    defaultValue,
    dir,
    onInvalid,
    onAddTag,
    onRemoveTag,
  })
  latest.current = {
    setModelState,
    duplicate,
    max,
    convertValue,
    defaultValue,
    dir,
    onInvalid,
    onAddTag,
    onRemoveTag,
  }

  useLayoutEffect(() => {
    collection.setRoot(element)
  }, [element, collection])

  useEffect(() => {
    if (!element) return
    const enter = () => setFocused(true)
    const leave = () => setFocused(element.matches(':focus-within'))
    element.addEventListener('focusin', enter, { passive: true })
    element.addEventListener('focusout', leave, { passive: true })
    return () => {
      element.removeEventListener('focusin', enter)
      element.removeEventListener('focusout', leave)
    }
  }, [element])

  const api = useMemo(() => {
    function setModel(next: AcceptableInputValue[]) {
      modelRef.current = next
      latest.current.setModelState(next)
    }
    function setSelectedElement(next: HTMLElement | undefined) {
      selectedRef.current = next
      setSelectedState(next)
    }
    function current() {
      return Array.isArray(modelRef.current) ? [...modelRef.current] : []
    }
    function handleRemoveTag(index: number) {
      if (index === -1) return
      const model = modelRef.current ?? []
      const removed = model[index]!
      setModel(model.filter((_, i) => i !== index))
      latest.current.onRemoveTag?.(removed)
    }
    return {
      setSelectedElement,
      setInvalidInput: setInvalidState,
      onRemoveValue: handleRemoveTag,
      onAddValue(text: string) {
        const { duplicate, max, convertValue, defaultValue, onInvalid, onAddTag } = latest.current
        const array = current()
        const modelIsObject = array.length > 0 && typeof array[0] === 'object'
        const defaultIsObject = array.length > 0 && typeof defaultValue[0] === 'object'
        if ((modelIsObject || defaultIsObject) && typeof convertValue !== 'function')
          throw new Error(
            'You must provide a `convertValue` function when using objects as values.',
          )
        const payload = convertValue ? convertValue(text) : text
        if (array.length >= max && !!max) {
          onInvalid?.(payload)
          return false
        }
        if (duplicate) {
          setModel([...array, payload])
          onAddTag?.(payload)
          return true
        }
        if (!array.includes(payload)) {
          setModel([...array, payload])
          onAddTag?.(payload)
          return true
        }
        setInvalidState(true)
        onInvalid?.(payload)
        return false
      },
      onInputKeydown(event: KeyboardEvent) {
        if (event.isComposing) return
        const target = event.target as HTMLInputElement
        const items = collection
          .getItems(true)
          .map(item => item.ref)
          .filter(item => item.dataset.disabled !== '')
        if (!items.length) return
        const lastTag = items.at(-1)
        const selected = selectedRef.current
        switch (event.key) {
          case 'Delete':
          case 'Backspace': {
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break
            if (selected) {
              const index = items.findIndex(item => item === selected)
              const selectedItem = collection.getItems(true).find(item => item.ref === selected)
              const model = modelRef.current ?? []
              const modelIndex = selectedItem
                ? model.findIndex(value => isEqual(value, selectedItem.value))
                : -1
              handleRemoveTag(modelIndex)
              setSelectedElement(selected === lastTag ? items.at(index - 1) : items.at(index + 1))
              event.preventDefault()
            } else if (event.key === 'Backspace') {
              setSelectedElement(lastTag)
              event.preventDefault()
            }
            break
          }
          case 'Home':
          case 'End':
          case 'ArrowRight':
          case 'ArrowLeft': {
            const dir = latest.current.dir
            const isArrowRight =
              (event.key === 'ArrowRight' && dir === 'ltr') ||
              (event.key === 'ArrowLeft' && dir === 'rtl')
            const isArrowLeft = !isArrowRight
            if (target.selectionStart !== 0 || target.selectionEnd !== 0) break
            if (isArrowLeft && !selected) {
              setSelectedElement(lastTag)
              event.preventDefault()
            } else if (isArrowRight && lastTag && selected === lastTag) {
              setSelectedElement(undefined)
              event.preventDefault()
            } else if (selected) {
              const next = arrowTarget(event, selected, items, dir)
              if (next) setSelectedElement(next)
              event.preventDefault()
            }
            break
          }
          case 'ArrowUp':
          case 'ArrowDown': {
            if (selected) event.preventDefault()
            break
          }
          default:
            setSelectedElement(undefined)
        }
      },
    }
  }, [collection])

  const context = useMemo<TagsInputRootContextValue>(
    () => ({
      ...api,
      modelValue: modelValue ?? EMPTY,
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnTab,
      addOnBlur,
      disabled,
      delimiter,
      dir,
      max,
      id,
      displayValue,
      collection,
    }),
    [
      api,
      modelValue,
      selectedElement,
      isInvalidInput,
      addOnPaste,
      addOnTab,
      addOnBlur,
      disabled,
      delimiter,
      dir,
      max,
      id,
      displayValue,
      collection,
    ],
  )

  return (
    <TagsInputRootContext value={context}>
      <Primitive
        {...attrs}
        ref={composedRef}
        dir={dir}
        as={as}
        asChild={asChild}
        data-invalid={isInvalidInput ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
        data-focused={focused ? '' : undefined}
      >
        {children}
        {isFormControl && name ? (
          <VisuallyHiddenInput
            name={name}
            value={modelValue}
            required={required}
            disabled={disabled}
          />
        ) : null}
      </Primitive>
    </TagsInputRootContext>
  )
}

interface TagsInputItemContextValue {
  value: AcceptableInputValue
  displayValue: string
  isSelected: boolean
  disabled: boolean
  text: { id: string }
}

const TagsInputItemContext = createContext<TagsInputItemContextValue | null>(null)

export function useTagsInputItemContext(consumer = 'TagsInputItem') {
  const context = useContext(TagsInputItemContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TagsInputItem\``)
  return context
}

export interface TagsInputItemProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  value: AcceptableInputValue
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function TagsInputItem({
  value,
  disabled: disabledProp,
  as,
  asChild,
  ref,
  ...attrs
}: TagsInputItemProps) {
  const root = useTagsInputRootContext('TagsInputItem')
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const isSelected = element != null && root.selectedElement === element
  const disabled = !!disabledProp || root.disabled
  const [text] = useState(() => ({ id: '' }))

  useLayoutEffect(
    () => (element ? root.collection.register(element, value) : undefined),
    [element, value, root.collection],
  )

  const context = useMemo<TagsInputItemContextValue>(
    () => ({ value, displayValue: root.displayValue(value), isSelected, disabled, text }),
    [value, root.displayValue, isSelected, disabled, text],
  )

  return (
    <TagsInputItemContext value={context}>
      <Primitive
        {...{ [COLLECTION_ITEM]: '' }}
        as={as}
        asChild={asChild}
        aria-labelledby={text.id}
        aria-current={isSelected}
        data-disabled={disabled ? '' : undefined}
        data-state={isSelected ? 'active' : 'inactive'}
        {...attrs}
        ref={composedRef}
      />
    </TagsInputItemContext>
  )
}

export interface TagsInputItemTextProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function TagsInputItemText({ as = 'span', children, ...props }: TagsInputItemTextProps) {
  const item = useTagsInputItemContext('TagsInputItemText')
  const generated = useId()
  if (!item.text.id) item.text.id = generated
  return (
    <Primitive as={as} {...props} id={item.text.id}>
      {children ?? item.displayValue}
    </Primitive>
  )
}

export interface TagsInputItemDeleteProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function TagsInputItemDelete({
  as = 'button',
  onClick,
  ...props
}: TagsInputItemDeleteProps) {
  const root = useTagsInputRootContext('TagsInputItemDelete')
  const item = useTagsInputItemContext('TagsInputItemDelete')
  const disabled = item.disabled || root.disabled
  return (
    <Primitive
      tabIndex={-1}
      as={as}
      {...props}
      aria-labelledby={item.text.id}
      aria-current={item.isSelected}
      data-state={item.isSelected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      {...({ type: as === 'button' ? 'button' : undefined } as object)}
      onClick={event => {
        onClick?.(event)
        if (disabled) return
        const index = root.modelValue.findIndex(value => isEqual(value, item.value))
        root.onRemoveValue(index)
      }}
    />
  )
}

export interface TagsInputInputProps
  extends
    PrimitiveProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'autoFocus' | 'maxLength'>,
    DataAttributes {
  autoFocus?: boolean
  maxLength?: number
  ref?: Ref<HTMLInputElement>
}

export function TagsInputInput({
  autoFocus,
  maxLength,
  placeholder,
  as = 'input',
  asChild,
  onInput,
  onKeyDown,
  onBlur,
  onPaste,
  onCompositionStart,
  onCompositionEnd,
  ref,
  ...attrs
}: TagsInputInputProps) {
  const context = useTagsInputRootContext('TagsInputInput')
  const element = useRef<HTMLInputElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const composing = useComposing()
  const latest = useRef({ autoFocus, context })
  latest.current = { autoFocus, context }

  useEffect(() => {
    const node = element.current
    const input = node?.nodeName === 'INPUT' ? node : node?.querySelector('input')
    if (!input) return
    const timer = setTimeout(() => {
      if (latest.current.autoFocus) input.focus()
    }, 1)
    return () => clearTimeout(timer)
  }, [])

  async function handleCustomKeydown(event: KeyboardEvent) {
    if (composing.isComposing) return
    await Promise.resolve()
    if (event.defaultPrevented) return
    const target = event.target as HTMLInputElement
    if (!target.value) return
    const added = latest.current.context.onAddValue(target.value)
    if (added) target.value = ''
    event.preventDefault()
  }

  return (
    <Primitive
      id={context.id}
      {...({
        type: 'text',
        autoComplete: 'off',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        maxLength,
        placeholder,
        disabled: context.disabled || undefined,
      } as object)}
      as={as}
      asChild={asChild}
      data-invalid={context.isInvalidInput ? '' : undefined}
      {...(attrs as HTMLAttributes<HTMLElement>)}
      ref={composedRef as Ref<HTMLElement>}
      onInput={(event: FormEvent<HTMLElement>) => {
        if (!composing.isComposing) {
          context.setInvalidInput(false)
          const data = (event.nativeEvent as InputEvent).data
          if (data !== null) {
            const delimiter = context.delimiter
            const matches =
              delimiter === data || (delimiter instanceof RegExp && delimiter.test(data))
            if (matches) {
              const target = event.target as HTMLInputElement
              target.value = target.value.replace(delimiter, '')
              if (target.value.trim() === '') target.value = ''
              else if (context.onAddValue(target.value)) target.value = ''
            }
          }
        }
        onInput?.(event as unknown as Parameters<NonNullable<typeof onInput>>[0])
      }}
      onKeyDown={(event: ReactKeyboardEvent<HTMLElement>) => {
        if (event.key === 'Enter') void handleCustomKeydown(event.nativeEvent)
        if (event.key === 'Tab' && context.addOnTab) void handleCustomKeydown(event.nativeEvent)
        if (!composing.isComposing) context.onInputKeydown(event.nativeEvent)
        onKeyDown?.(event as ReactKeyboardEvent<HTMLInputElement>)
      }}
      onBlur={(event: ReactFocusEvent<HTMLElement>) => {
        context.setSelectedElement(undefined)
        if (context.addOnBlur) {
          const target = event.target as HTMLInputElement
          const relatedTarget = event.relatedTarget as HTMLElement | null
          const controlledId = target.getAttribute('aria-controls')
          const inside = !!controlledId && !!relatedTarget?.closest(`#${CSS.escape(controlledId)}`)
          if (!inside && target.value && context.onAddValue(target.value)) target.value = ''
        }
        onBlur?.(event as ReactFocusEvent<HTMLInputElement>)
      }}
      onCompositionStart={(event: ReactCompositionEvent<HTMLElement>) => {
        composing.handleCompositionStart()
        onCompositionStart?.(event as ReactCompositionEvent<HTMLInputElement>)
      }}
      onCompositionEnd={(event: ReactCompositionEvent<HTMLElement>) => {
        composing.handleCompositionEnd(event.nativeEvent)
        onCompositionEnd?.(event as ReactCompositionEvent<HTMLInputElement>)
      }}
      onPaste={(event: ReactClipboardEvent<HTMLElement>) => {
        if (context.addOnPaste) {
          event.preventDefault()
          const clipboardData = event.clipboardData
          if (clipboardData) {
            const value = clipboardData.getData('text')
            if (context.delimiter)
              value.split(context.delimiter).forEach(part => context.onAddValue(part))
            else context.onAddValue(value)
          }
        }
        onPaste?.(event as ReactClipboardEvent<HTMLInputElement>)
      }}
    />
  )
}
