'use client'

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type CompositionEvent as ReactCompositionEvent,
  type Ref,
} from 'react'
import { Direction as RadixDirection, Portal as RadixPortal } from 'radix-ui'
import {
  DismissableLayer,
  FocusGuards,
  FocusScope,
  Presence,
  useComposedRefs,
} from 'radix-ui/internal'
import { usePortalContainer } from '../../lib/config'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { useRenderTick } from '../../lib/virtual/useRenderTick'
import { useBodyScrollLock } from '../body-scroll-lock'
import { useComposing } from '../utils/composing'
import { PopperContent, PopperRoot, PopperVirtualAnchor, type PopperContentProps } from '../popper'
import {
  ListboxContent,
  ListboxFilter,
  ListboxGroup,
  ListboxHighlightScrollProvider,
  ListboxItem,
  ListboxItemIndicator,
  ListboxRoot,
  ListboxVirtualizer,
  createEventHook,
  useListboxRootContext,
  type Comparator,
  type ListboxFilterProps,
  type ListboxHighlightScrollContextValue,
  type ListboxItemIndicatorProps,
  type ListboxSelectEvent,
  type ListboxVirtualizerProps,
} from '../listbox'
import { useVModel } from '../listbox/useVModel'
import { createCollatorFilter } from '../../../../shared/src/lib/virtual/filter'
import {
  guardLayer,
  type FocusOutsideEvent,
  type PointerDownOutsideEvent,
} from '../utils/dismissable'

export type { FocusOutsideEvent, PointerDownOutsideEvent } from '../utils/dismissable'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type Direction = 'ltr' | 'rtl'
type ContentPosition = 'inline' | 'popper'

export interface ComboboxFilterState {
  count: number
  items: Map<string, number>
  groups: Set<string>
}

export interface ComboboxRootContextValue {
  modelValue: unknown
  getModelValue: () => unknown
  setModelValue: (value: unknown) => void
  multiple: boolean
  disabled: boolean
  dir: Direction
  open: boolean
  getOpen: () => boolean
  onOpenChange: (open: boolean) => void
  onContentPositionChange: (content: symbol, position: ContentPosition) => void
  onContentPlaced: (content: symbol) => void
  onContentUnmount: (content: symbol) => void
  isUserInputted: { current: boolean }
  isVirtual: { current: boolean }
  contentId: { current: string }
  getInputElement: () => HTMLInputElement | null
  onInputElementChange: (element: HTMLInputElement | null) => void
  getTriggerElement: () => HTMLElement | null
  onTriggerElementChange: (element: HTMLElement | null) => void
  getParentElement: () => HTMLElement | null
  resetSearchTermOnSelect: boolean
  onResetSearchTerm: (listener: () => void) => { off: () => void }
  itemCount: number
  registerItem: (id: string, text: string, group?: string) => void
  unregisterItem: (id: string) => void
  registerGroup: (id: string) => void
  unregisterGroup: (id: string) => void
  filterSearch: string
  getFilterSearch: () => string
  setFilterSearch: (value: string) => void
  filterState: ComboboxFilterState
  ignoreFilter: boolean
  openOnFocus: boolean
  openOnClick: boolean
  resetModelValueOnClear: boolean
  tick: () => Promise<void>
}

const ComboboxRootContext = createContext<ComboboxRootContextValue | null>(null)

export function useComboboxRootContext(consumer = 'ComboboxRoot') {
  const context = useContext(ComboboxRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ComboboxRoot\``)
  return context
}

export function useOptionalComboboxRootContext() {
  return useContext(ComboboxRootContext)
}

export interface ComboboxHighlightPayload {
  ref: HTMLElement
  value: unknown
}

export interface ComboboxRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'dir' | 'defaultValue' | 'onChange'>,
    DataAttributes {
  value?: unknown
  defaultValue?: unknown
  onValueChange?: (value: unknown) => void
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  multiple?: boolean
  disabled?: boolean
  dir?: Direction
  by?: Comparator
  name?: string
  required?: boolean
  highlightOnHover?: boolean
  resetSearchTermOnBlur?: boolean
  resetSearchTermOnSelect?: boolean
  openOnFocus?: boolean
  openOnClick?: boolean
  ignoreFilter?: boolean
  resetModelValueOnClear?: boolean
  onHighlight?: (payload: ComboboxHighlightPayload | undefined) => void
  ref?: Ref<HTMLElement>
}

function createPositioning(open: { current: boolean }) {
  const state = {
    position: 'inline' as ContentPosition,
    placed: false,
    current: undefined as symbol | undefined,
    pending: undefined as (() => void) | undefined,
  }
  const scroll: ListboxHighlightScrollContextValue = {
    get suppressHighlightScroll() {
      return state.position === 'popper' && !state.placed
    },
    onHighlightScrollRequest(request) {
      state.pending = request
    },
  }
  return {
    scroll,
    onContentPositionChange(content: symbol, position: ContentPosition) {
      if (state.current !== content || state.position !== position) {
        state.placed = false
        state.pending = undefined
      }
      state.current = content
      state.position = position
    },
    onContentPlaced(content: symbol) {
      if (state.current !== content || state.position !== 'popper' || state.placed) return
      state.placed = true
      const request = state.pending
      state.pending = undefined
      if (open.current) request?.()
    },
    onContentUnmount(content: symbol) {
      if (state.current !== content) return
      state.current = undefined
      state.position = 'inline'
      state.placed = false
      state.pending = undefined
    },
  }
}

export function ComboboxRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  multiple = false,
  disabled = false,
  dir: dirProp,
  by,
  name,
  required,
  highlightOnHover = true,
  resetSearchTermOnBlur = true,
  resetSearchTermOnSelect = true,
  openOnFocus = false,
  openOnClick = false,
  ignoreFilter = false,
  resetModelValueOnClear = false,
  onHighlight,
  style,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: ComboboxRootProps) {
  const dir = RadixDirection.useDirection(dirProp)
  const [modelValue, setModel] = useVModel<unknown>(
    valueProp,
    defaultValue ?? (multiple ? [] : undefined),
    onValueChange,
  )
  const [openValue, setOpenValue] = useVModel<boolean>(openProp, defaultOpen, onOpenChange)
  const open = !!openValue
  const openRef = useRef(open)
  openRef.current = open
  const parent = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, parent)
  const [positioning] = useState(() => createPositioning(openRef))

  return (
    <PopperRoot>
      <ListboxHighlightScrollProvider value={positioning.scroll}>
        <ListboxRoot
          {...attrs}
          ref={composedRef}
          value={modelValue}
          onValueChange={setModel}
          style={{ ...style, pointerEvents: open ? 'auto' : undefined }}
          as={as}
          asChild={asChild}
          dir={dir}
          multiple={multiple}
          name={name}
          required={required}
          disabled={disabled}
          highlightOnHover={highlightOnHover}
          by={by}
          onHighlight={item =>
            onHighlight?.(item ? { ref: item.ref, value: item.value } : (item as undefined))
          }
        >
          <ComboboxRootProvider
            modelValue={modelValue}
            setModel={setModel}
            open={open}
            openRef={openRef}
            setOpen={setOpenValue}
            multiple={multiple}
            disabled={disabled}
            dir={dir}
            parent={parent}
            positioning={positioning}
            resetSearchTermOnBlur={resetSearchTermOnBlur}
            resetSearchTermOnSelect={resetSearchTermOnSelect}
            openOnFocus={openOnFocus}
            openOnClick={openOnClick}
            ignoreFilter={ignoreFilter}
            resetModelValueOnClear={resetModelValueOnClear}
          >
            {children}
          </ComboboxRootProvider>
        </ListboxRoot>
      </ListboxHighlightScrollProvider>
    </PopperRoot>
  )
}

interface ComboboxRootProviderProps {
  modelValue: unknown
  setModel: (value: unknown) => void
  open: boolean
  openRef: { current: boolean }
  setOpen: (open: boolean) => void
  multiple: boolean
  disabled: boolean
  dir: Direction
  parent: { current: HTMLElement | null }
  positioning: ReturnType<typeof createPositioning>
  resetSearchTermOnBlur: boolean
  resetSearchTermOnSelect: boolean
  openOnFocus: boolean
  openOnClick: boolean
  ignoreFilter: boolean
  resetModelValueOnClear: boolean
  children?: ReactNode
}

function ComboboxRootProvider({
  modelValue,
  setModel,
  open,
  openRef,
  setOpen,
  multiple,
  disabled,
  dir,
  parent,
  positioning,
  resetSearchTermOnBlur,
  resetSearchTermOnSelect,
  openOnFocus,
  openOnClick,
  ignoreFilter,
  resetModelValueOnClear,
  children,
}: ComboboxRootProviderProps) {
  const listbox = useListboxRootContext('ComboboxRoot')
  const tick = useRenderTick()
  const [filterSearch, setFilterSearchState] = useState('')
  const [virtual, setVirtual] = useState(false)
  const [itemsVersion, bumpItems] = useReducer((count: number) => count + 1, 0)
  const [groupsVersion, bumpGroups] = useReducer((count: number) => count + 1, 0)
  const [store] = useState(() => ({
    items: new Map<string, string>(),
    groups: new Map<string, Set<string>>(),
    filter: createCollatorFilter({ sensitivity: 'base' }),
    resetSearchTerm: createEventHook<void>(),
    input: null as HTMLInputElement | null,
    trigger: null as HTMLElement | null,
    search: '',
    model: undefined as unknown,
    previous: null as ComboboxFilterState | null,
    virtualSetter: (_: boolean) => {},
  }))
  store.virtualSetter = setVirtual
  store.model = modelValue
  const [refs] = useState(() => {
    let isVirtual = false
    return {
      isUserInputted: { current: false },
      contentId: { current: '' },
      isVirtual: {
        get current() {
          return isVirtual
        },
        set current(next: boolean) {
          if (isVirtual === next) return
          isVirtual = next
          store.virtualSetter(next)
        },
      },
    }
  })
  const latest = useRef({ setModel, setOpen, resetSearchTermOnBlur, listbox })
  latest.current = { setModel, setOpen, resetSearchTermOnBlur, listbox }

  const itemCount = store.items.size
  const filtering = !!filterSearch && !ignoreFilter && !virtual
  const filterState = useMemo<ComboboxFilterState>(() => {
    const old = store.previous
    if (!filtering)
      return {
        count: store.items.size,
        items: old?.items ?? new Map(),
        groups: old?.groups ?? new Set(store.groups.keys()),
      }
    let count = 0
    const items = new Map<string, number>()
    const groups = new Set<string>()
    for (const [id, text] of store.items) {
      const score = store.filter.contains(text, filterSearch)
      items.set(id, score ? 1 : 0)
      if (score) count++
    }
    for (const [groupId, group] of store.groups)
      for (const itemId of group)
        if (items.get(itemId)! > 0) {
          groups.add(groupId)
          break
        }
    return { count, items, groups }
  }, [
    filterSearch,
    filterSearch ? ignoreFilter : null,
    filterSearch && !ignoreFilter ? virtual : null,
    filtering ? itemsVersion : itemCount,
    filtering ? groupsVersion : null,
  ])
  store.previous = filterState

  const api = useMemo(() => {
    function setFilterSearch(value: string) {
      store.search = value
      setFilterSearchState(value)
    }
    function onOpenChange(value: boolean) {
      openRef.current = value
      latest.current.setOpen(value)
      setFilterSearch('')
      if (value) {
        void tick().then(() => {
          void latest.current.listbox.highlightSelected()
          refs.isUserInputted.current = true
          store.input?.focus()
        })
      } else {
        refs.isUserInputted.current = false
        setTimeout(() => {
          if (latest.current.resetSearchTermOnBlur) store.resetSearchTerm.trigger()
        }, 1)
      }
    }
    return {
      getModelValue: () => store.model,
      setModelValue: (value: unknown) => {
        store.model = value
        latest.current.setModel(value)
      },
      getOpen: () => openRef.current,
      onOpenChange,
      onContentPositionChange: positioning.onContentPositionChange,
      onContentPlaced: positioning.onContentPlaced,
      onContentUnmount: positioning.onContentUnmount,
      getInputElement: () => store.input,
      onInputElementChange: (element: HTMLInputElement | null) => {
        store.input = element
      },
      getTriggerElement: () => store.trigger,
      onTriggerElementChange: (element: HTMLElement | null) => {
        store.trigger = element
      },
      getParentElement: () => parent.current,
      onResetSearchTerm: (listener: () => void) => store.resetSearchTerm.on(listener),
      registerItem(id: string, text: string, group?: string) {
        store.items.set(id, text)
        if (group) {
          const set = store.groups.get(group)
          if (set) set.add(id)
          else store.groups.set(group, new Set([id]))
          bumpGroups()
        }
        bumpItems()
      },
      unregisterItem(id: string) {
        if (store.items.delete(id)) bumpItems()
      },
      registerGroup(id: string) {
        if (store.groups.has(id)) return
        store.groups.set(id, new Set())
        bumpGroups()
      },
      unregisterGroup(id: string) {
        if (store.groups.delete(id)) bumpGroups()
      },
      getFilterSearch: () => store.search,
      setFilterSearch,
      tick,
    }
  }, [store, refs, openRef, parent, positioning, tick])

  const value = useMemo<ComboboxRootContextValue>(
    () => ({
      ...api,
      ...refs,
      modelValue,
      multiple,
      disabled,
      dir,
      open,
      resetSearchTermOnSelect,
      itemCount,
      filterSearch,
      filterState,
      ignoreFilter,
      openOnFocus,
      openOnClick,
      resetModelValueOnClear,
    }),
    [
      api,
      refs,
      modelValue,
      multiple,
      disabled,
      dir,
      open,
      resetSearchTermOnSelect,
      itemCount,
      filterSearch,
      filterState,
      ignoreFilter,
      openOnFocus,
      openOnClick,
      resetModelValueOnClear,
    ],
  )

  return <ComboboxRootContext value={value}>{children}</ComboboxRootContext>
}

export interface ComboboxAnchorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  reference?: HTMLElement | null
  ref?: Ref<HTMLElement>
}

export function ComboboxAnchor({ reference, ref, ...props }: ComboboxAnchorProps) {
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const anchor = useRef<HTMLElement | null>(null)
  anchor.current = reference ?? element.current
  useLayoutEffect(() => {
    anchor.current = reference ?? element.current
  })
  return (
    <>
      <PopperVirtualAnchor anchor={anchor} />
      <Primitive {...props} ref={composedRef} />
    </>
  )
}

export interface ComboboxInputProps extends ListboxFilterProps {
  displayValue?: (value: unknown) => string
}

function renderedSnapshot(props: object, extra: unknown[]) {
  return [
    ...extra,
    ...Object.entries(props)
      .filter(([, value]) => typeof value !== 'function')
      .flat(),
  ]
}

function useRenderedValue<T>(value: T, deps: unknown[]): T {
  const state = useRef<{ deps: unknown[]; value: T } | null>(null)
  const previous = state.current
  if (
    !previous ||
    previous.deps.length !== deps.length ||
    previous.deps.some((dep, index) => !Object.is(dep, deps[index]))
  )
    state.current = { deps, value }
  return state.current!.value
}

function chain<E>(own: (event: E) => void, user?: (event: E) => void) {
  return (event: E) => {
    own(event)
    user?.(event)
  }
}

export function ComboboxInput({
  displayValue,
  value,
  defaultValue,
  onValueChange,
  as = 'input',
  onClick,
  onInput,
  onKeyDown,
  onFocus,
  onBlur,
  onCompositionStart,
  onCompositionUpdate,
  onCompositionEnd,
  ref,
  ...props
}: ComboboxInputProps) {
  const root = useComboboxRootContext('ComboboxInput')
  const listbox = useListboxRootContext('ComboboxInput')
  const [model, setModel] = useVModel<string | undefined>(
    value,
    defaultValue,
    onValueChange as ((value: string | undefined) => void) | undefined,
  )
  const element = useRef<HTMLInputElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const latest = useRef({ displayValue, setModel, model, root, listbox })
  latest.current = { displayValue, setModel, model, root, listbox }

  useLayoutEffect(() => {
    root.onInputElementChange(element.current)
  }, [])

  const [reset] = useState(() => () => {
    const { displayValue, setModel, root } = latest.current
    const rootModelValue = root.getModelValue()
    let next: string
    if (displayValue) next = displayValue(rootModelValue)
    else if (!root.multiple && rootModelValue && !Array.isArray(rootModelValue))
      next = typeof rootModelValue !== 'object' ? String(rootModelValue) : ''
    else next = ''
    latest.current.model = next
    setModel(next)
    void Promise.resolve().then(() => latest.current.setModel(latest.current.model as string))
  })

  useEffect(() => root.onResetSearchTerm(reset).off, [root.onResetSearchTerm, reset])

  useLayoutEffect(() => {
    if (!root.isUserInputted.current && root.resetSearchTermOnSelect) reset()
  }, [root.modelValue])

  const previousFilter = useRef(root.filterState)
  useLayoutEffect(() => {
    const old = previousFilter.current
    previousFilter.current = root.filterState
    if (old === root.filterState) return
    if (!root.isVirtual.current && old.count === 0) listbox.highlightFirstItem()
  }, [root.filterState])

  const composing = useComposing(event => {
    const target = event.target as HTMLInputElement | null
    if (target) processInputValue(target.value)
  })

  const controls = useRenderedValue(
    root.contentId.current,
    renderedSnapshot(props, [root.open, model, as, displayValue]),
  )

  function processInputValue(value: string) {
    if (!root.getOpen()) {
      root.onOpenChange(true)
      void root.tick().then(() => {
        if (value) {
          root.setFilterSearch(value)
          listbox.highlightFirstItem()
        }
      })
    } else root.setFilterSearch(value)
  }

  return (
    <ListboxFilter
      as={as}
      aria-expanded={root.open}
      aria-controls={controls}
      aria-autocomplete="list"
      role="combobox"
      autoComplete="off"
      {...props}
      ref={composedRef}
      value={model}
      onValueChange={next => {
        latest.current.model = next
        setModel(next)
      }}
      onClick={chain(() => {
        if (root.openOnClick && !root.getOpen()) root.onOpenChange(true)
      }, onClick)}
      onInput={chain((event: Parameters<NonNullable<typeof onInput>>[0]) => {
        if (composing.shouldDeferInput) return
        processInputValue((event.target as HTMLInputElement).value)
      }, onInput)}
      onKeyDown={chain((event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
        if (composing.isComposing) return
        event.preventDefault()
        if (!root.getOpen()) root.onOpenChange(true)
      }, onKeyDown)}
      onFocus={chain(() => {
        if (root.openOnFocus && !root.getOpen()) root.onOpenChange(true)
      }, onFocus)}
      onBlur={chain((event: ReactFocusEvent<HTMLInputElement>) => {
        if (!root.getOpen()) return
        const nextFocus = event.relatedTarget as Element | null
        if (!nextFocus) return
        const contentOf = () => document.getElementById(root.contentId.current)
        const insideRoot = root.getParentElement()?.contains(nextFocus)
        const insideContent = contentOf()?.contains(nextFocus)
        if (!insideRoot && !insideContent)
          requestAnimationFrame(() => {
            if (!root.getOpen()) return
            const active = document.activeElement
            const outside =
              !root.getParentElement()?.contains(active) && !contentOf()?.contains(active)
            if (outside) root.onOpenChange(false)
          })
      }, onBlur)}
      onCompositionStart={chain(() => composing.handleCompositionStart(), onCompositionStart)}
      onCompositionUpdate={chain(
        (event: ReactCompositionEvent<HTMLInputElement>) =>
          composing.handleCompositionUpdate(event.nativeEvent),
        onCompositionUpdate,
      )}
      onCompositionEnd={chain(
        (event: ReactCompositionEvent<HTMLInputElement>) =>
          composing.handleCompositionEnd(event.nativeEvent),
        onCompositionEnd,
      )}
    />
  )
}

export interface ComboboxTriggerProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function ComboboxTrigger({
  disabled: disabledProp,
  as = 'button',
  asChild,
  onClick,
  ref,
  ...attrs
}: ComboboxTriggerProps) {
  const root = useComboboxRootContext('ComboboxTrigger')
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const disabled = !!disabledProp || root.disabled
  const controls = useRenderedValue(
    root.contentId.current,
    renderedSnapshot(attrs, [root.open, disabled, as, asChild]),
  )

  useLayoutEffect(() => {
    root.onTriggerElementChange(element.current)
  }, [])

  return (
    <Primitive
      as={as}
      asChild={asChild}
      {...({ type: as === 'button' ? 'button' : undefined } as object)}
      tabIndex={-1}
      aria-label="Show popup"
      aria-haspopup="listbox"
      aria-expanded={root.open}
      aria-controls={controls}
      data-state={root.open ? 'open' : 'closed'}
      {...({ disabled: disabled || undefined } as object)}
      data-disabled={disabled ? '' : undefined}
      aria-disabled={disabled}
      {...attrs}
      ref={composedRef}
      onClick={chain(() => root.onOpenChange(!root.getOpen()), onClick)}
    />
  )
}

export interface ComboboxCancelProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ComboboxCancel({ as = 'button', onClick, ...attrs }: ComboboxCancelProps) {
  const root = useComboboxRootContext('ComboboxCancel')
  return (
    <Primitive
      {...({ type: as === 'button' ? 'button' : undefined } as object)}
      as={as}
      {...attrs}
      tabIndex={-1}
      onClick={chain(() => {
        root.setFilterSearch('')
        const input = root.getInputElement()
        if (input) {
          input.value = ''
          input.focus()
        }
        if (root.resetModelValueOnClear) root.setModelValue(root.multiple ? [] : null)
      }, onClick)}
    />
  )
}

export interface ComboboxPortalProps {
  to?: Element | DocumentFragment | null
  children?: ReactNode
}

export function ComboboxPortal({ to, children }: ComboboxPortalProps) {
  const configured = usePortalContainer()
  return (
    <RadixPortal.Root asChild container={to ?? configured}>
      {children}
    </RadixPortal.Root>
  )
}

export interface ComboboxContentProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'dir'>,
    Pick<
      PopperContentProps,
      | 'side'
      | 'sideOffset'
      | 'align'
      | 'alignOffset'
      | 'avoidCollisions'
      | 'collisionBoundary'
      | 'collisionPadding'
      | 'arrowPadding'
      | 'sticky'
      | 'hideWhenDetached'
      | 'updatePositionStrategy'
    >,
    DataAttributes {
  forceMount?: boolean
  position?: ContentPosition
  bodyLock?: boolean
  hideWhenEmpty?: boolean
  disableOutsidePointerEvents?: boolean
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
  onFocusOutside?: (event: FocusOutsideEvent) => void
  onInteractOutside?: (event: PointerDownOutsideEvent | FocusOutsideEvent) => void
  ref?: Ref<HTMLElement>
}

export function ComboboxContent({ forceMount, ...props }: ComboboxContentProps) {
  const root = useComboboxRootContext('ComboboxContent')
  const id = useId()
  if (!root.contentId.current) root.contentId.current = id
  return (
    <Presence.Root present={!!forceMount || root.open}>
      <ComboboxContentImpl {...props} />
    </Presence.Root>
  )
}

const POPPER_PROPS = [
  'side',
  'sideOffset',
  'align',
  'alignOffset',
  'avoidCollisions',
  'collisionBoundary',
  'collisionPadding',
  'arrowPadding',
  'sticky',
  'hideWhenDetached',
  'updatePositionStrategy',
] as const

function ComboboxContentImpl({
  position = 'inline',
  bodyLock,
  hideWhenEmpty,
  disableOutsidePointerEvents,
  onEscapeKeyDown,
  onPointerDownOutside,
  onFocusOutside,
  onInteractOutside,
  as,
  asChild,
  style,
  ref,
  children,
  ...rest
}: Omit<ComboboxContentProps, 'forceMount'>) {
  const root = useComboboxRootContext('ComboboxContentImpl')
  const [contentId] = useState(() => Symbol('ComboboxContent'))
  const content = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, content)
  const inputWithin = useRef(false)
  const lastPosition = useRef<ContentPosition | null>(null)
  if (lastPosition.current !== position) {
    lastPosition.current = position
    root.onContentPositionChange(contentId, position)
  }

  FocusGuards.useFocusGuards()
  useBodyScrollLock(!!bodyLock)

  const isEmpty = root.ignoreFilter ? root.itemCount === 0 : root.filterState.count === 0

  useEffect(() => {
    if (lastPosition.current) root.onContentPositionChange(contentId, lastPosition.current)
    const input = root.getInputElement()
    if (input && content.current) {
      inputWithin.current = content.current.contains(input)
      if (inputWithin.current) input.focus()
    }
    return () => {
      root.onContentUnmount(contentId)
      const active = document.activeElement
      if (inputWithin.current && (!active || active === document.body))
        root.getTriggerElement()?.focus()
    }
  }, [])

  function isWithinCombobox(target: EventTarget | null) {
    if (root.getParentElement()?.contains(target as Node)) return true
    const label = target instanceof Element ? target.closest('label') : null
    const control = label?.control
    return !!control && !!root.getParentElement()?.contains(control)
  }

  const popperProps: Record<string, unknown> = {}
  const attrs: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(rest)) {
    if ((POPPER_PROPS as readonly string[]).includes(key)) popperProps[key] = value
    else attrs[key] = value
  }

  const contentStyle = {
    display: hideWhenEmpty && isEmpty ? 'none' : 'flex',
    flexDirection: 'column',
    outline: 'none',
    ...(position === 'popper'
      ? {
          boxSizing: 'border-box',
          '--radix-combobox-content-transform-origin': 'var(--radix-popper-transform-origin)',
          '--radix-combobox-content-available-width': 'var(--radix-popper-available-width)',
          '--radix-combobox-content-available-height': 'var(--radix-popper-available-height)',
          '--radix-combobox-trigger-width': 'var(--radix-popper-anchor-width)',
          '--radix-combobox-trigger-height': 'var(--radix-popper-anchor-height)',
        }
      : {}),
  } as CSSProperties

  const own = {
    ...attrs,
    ...(position === 'popper'
      ? {
          position,
          ...(bodyLock !== undefined ? { bodylock: String(bodyLock) } : {}),
          ...(hideWhenEmpty !== undefined ? { hidewhenempty: String(hideWhenEmpty) } : {}),
          ...(disableOutsidePointerEvents !== undefined
            ? { disableoutsidepointerevents: String(disableOutsidePointerEvents) }
            : {}),
        }
      : {}),
    id: root.contentId.current,
    'data-state': root.open ? 'open' : 'closed',
    'data-empty': isEmpty ? '' : undefined,
    'data-dismissable-layer': '',
    style: { ...(style as CSSProperties), ...contentStyle },
  }

  const getLayer = () => content.current

  return (
    <ListboxContent asChild>
      <FocusScope.Root
        asChild
        onMountAutoFocus={event => event.preventDefault()}
        onUnmountAutoFocus={event => event.preventDefault()}
      >
        <DismissableLayer.Root
          asChild
          disableOutsidePointerEvents={!!disableOutsidePointerEvents}
          onDismiss={() => root.onOpenChange(false)}
          onFocusOutside={guardLayer<FocusOutsideEvent>(getLayer, event => {
            if (isWithinCombobox(event.target)) event.preventDefault()
            onFocusOutside?.(event)
          })}
          onInteractOutside={guardLayer(getLayer, onInteractOutside)}
          onEscapeKeyDown={onEscapeKeyDown}
          onPointerDownOutside={guardLayer<PointerDownOutsideEvent>(getLayer, event => {
            if (isWithinCombobox(event.target)) event.preventDefault()
            onPointerDownOutside?.(event)
          })}
        >
          {position === 'popper' ? (
            <PopperContent
              {...(popperProps as PopperContentProps)}
              memoDependencies={[root.filterSearch, root.filterState]}
              asChild
              onPlaced={() => root.onContentPlaced(contentId)}
            >
              <Primitive
                {...(own as HTMLAttributes<HTMLElement>)}
                as={as}
                asChild={asChild}
                ref={composedRef}
              >
                {children}
              </Primitive>
            </PopperContent>
          ) : (
            <Primitive
              {...(own as HTMLAttributes<HTMLElement>)}
              as={as}
              asChild={asChild}
              ref={composedRef}
            >
              {children}
            </Primitive>
          )}
        </DismissableLayer.Root>
      </FocusScope.Root>
    </ListboxContent>
  )
}

export interface ComboboxEmptyProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ComboboxEmpty({ children, ...props }: ComboboxEmptyProps) {
  const root = useComboboxRootContext('ComboboxEmpty')
  const isRender = root.ignoreFilter ? root.itemCount === 0 : root.filterState.count === 0
  if (!isRender) return null
  return <Primitive {...props}>{children ?? 'No options'}</Primitive>
}

interface ComboboxGroupContextValue {
  id: string
  labelId: string
}

const ComboboxGroupContext = createContext<ComboboxGroupContextValue | null>(null)

export function useComboboxGroupContext() {
  return useContext(ComboboxGroupContext)
}

export interface ComboboxGroupProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ComboboxGroup(props: ComboboxGroupProps) {
  const root = useComboboxRootContext('ComboboxGroup')
  const id = useId()
  const [context] = useState<ComboboxGroupContextValue>(() => ({ id, labelId: '' }))
  const isRender = root.ignoreFilter
    ? true
    : !root.filterSearch
      ? true
      : root.filterState.groups.has(id)

  useLayoutEffect(() => {
    root.registerGroup(id)
    return () => root.unregisterGroup(id)
  }, [])

  return (
    <ComboboxGroupContext value={context}>
      <ListboxGroup
        {...props}
        id={id}
        aria-labelledby={context.labelId}
        hidden={isRender ? undefined : true}
      />
    </ComboboxGroupContext>
  )
}

export interface ComboboxLabelProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  for?: string
  ref?: Ref<HTMLElement>
}

const EMPTY_GROUP: ComboboxGroupContextValue = { id: '', labelId: '' }

export function ComboboxLabel({ as = 'div', for: htmlFor, ...props }: ComboboxLabelProps) {
  const group = useContext(ComboboxGroupContext) ?? EMPTY_GROUP
  const generated = useId()
  if (!group.labelId) group.labelId = generated
  return (
    <Primitive
      as={as}
      {...(htmlFor === undefined ? {} : ({ for: htmlFor } as object))}
      {...props}
      id={group.labelId}
    />
  )
}

export interface ComboboxItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'onSelect'>, DataAttributes {
  value: unknown
  disabled?: boolean
  textValue?: string
  onSelect?: (event: ListboxSelectEvent) => void
  ref?: Ref<HTMLElement>
}

export function ComboboxItem({
  value,
  disabled,
  textValue,
  onSelect,
  children,
  ref,
  ...attrs
}: ComboboxItemProps) {
  if (value === '')
    throw new Error(
      'A <ComboboxItem /> must have a value prop that is not an empty string. This is because the Combobox value can be set to an empty string to clear the selection and show the placeholder.',
    )
  const root = useComboboxRootContext('ComboboxItem')
  const group = useContext(ComboboxGroupContext)
  const id = useId()
  const element = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, element)
  const latest = useRef({ value, disabled, onSelect })
  latest.current = { value, disabled, onSelect }

  const filtered =
    root.isVirtual.current || root.ignoreFilter || !root.filterSearch
      ? undefined
      : root.filterState.items.get(id)
  const isRender = filtered === undefined ? true : filtered > 0

  useLayoutEffect(() => {
    const node = element.current
    root.registerItem(id, textValue || node?.textContent || node?.innerText || '', group?.id)
    return () => root.unregisterItem(id)
  }, [])

  if (!isRender) return null

  return (
    <ListboxItem
      {...attrs}
      {...({ textvalue: textValue } as object)}
      id={id}
      ref={composedRef}
      value={value}
      disabled={root.disabled || disabled}
      onSelect={event => {
        const current = latest.current
        current.onSelect?.(event)
        if (event.defaultPrevented) return
        if (!root.multiple && !current.disabled && !root.disabled) {
          event.preventDefault()
          root.onOpenChange(false)
          root.setModelValue(current.value)
        } else if (root.multiple) root.getInputElement()?.focus()
      }}
    >
      {children ?? String(value)}
    </ListboxItem>
  )
}

export type ComboboxItemIndicatorProps = ListboxItemIndicatorProps

export function ComboboxItemIndicator(props: ComboboxItemIndicatorProps) {
  return <ListboxItemIndicator {...props} />
}

export interface ComboboxSeparatorProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function ComboboxSeparator(props: ComboboxSeparatorProps) {
  return <Primitive {...props} aria-hidden="true" />
}

export type ComboboxVirtualizerProps<T> = ListboxVirtualizerProps<T>

export function ComboboxVirtualizer<T>(props: ComboboxVirtualizerProps<T>) {
  const root = useComboboxRootContext('ComboboxVirtualizer')
  useLayoutEffect(() => {
    root.isVirtual.current = true
  }, [root.isVirtual])
  return <ListboxVirtualizer<T> {...props} />
}
