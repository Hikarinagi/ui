'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import { Direction as RadixDirection } from 'radix-ui'
import { composeEventHandlers, useComposedRefs, useControllableState } from 'radix-ui/internal'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import {
  ENTRY_FOCUS,
  EVENT_OPTIONS,
  ITEM_DATA_ATTR,
  focusFirst,
  getFocusIntent,
  wrapArray,
  type Direction,
  type Orientation,
} from './utils'

export type { Direction, Orientation } from './utils'
export { ITEM_DATA_ATTR } from './utils'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

const both = { checkForDefaultPrevented: false }

interface RovingFocusGroupContextValue {
  loop: boolean
  dir: Direction
  orientation?: Orientation
  currentTabStopId: string | null
  onItemFocus: (tabStopId: string) => void
  onItemShiftTab: () => void
  onFocusableItemAdd: () => void
  onFocusableItemRemove: () => void
  register: (element: HTMLElement) => () => void
  getItems: (includeDisabled?: boolean) => HTMLElement[]
}

const RovingFocusGroupContext = createContext<RovingFocusGroupContextValue | null>(null)

function useRovingFocusGroupContext(consumer: string) {
  const context = useContext(RovingFocusGroupContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`RovingFocusGroup\``)
  return context
}

export interface RovingFocusGroupProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir'>, DataAttributes {
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  currentTabStopId?: string | null
  defaultCurrentTabStopId?: string
  onCurrentTabStopIdChange?: (tabStopId: string | null) => void
  preventScrollOnEntryFocus?: boolean
  onEntryFocus?: (event: Event) => void
  ref?: Ref<HTMLElement>
}

export function RovingFocusGroup({
  orientation,
  dir: dirProp,
  loop = false,
  currentTabStopId: currentTabStopIdProp,
  defaultCurrentTabStopId,
  onCurrentTabStopIdChange,
  preventScrollOnEntryFocus = false,
  onEntryFocus,
  onMouseDown,
  onMouseUp,
  onFocus,
  onBlur,
  style,
  ref,
  ...attrs
}: RovingFocusGroupProps) {
  const dir = RadixDirection.useDirection(dirProp)
  const [currentTabStopId = null, setCurrentTabStopId] = useControllableState<string | null>({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: 'RovingFocusGroup',
  })
  const [isTabbingBackOut, setIsTabbingBackOut] = useState(false)
  const [focusableItemsCount, setFocusableItemsCount] = useState(0)
  const isClickFocus = useRef(false)
  const root = useRef<HTMLElement | null>(null)
  const items = useRef(new Set<HTMLElement>())
  const composedRef = useComposedRefs(ref, root)

  const register = useCallback((element: HTMLElement) => {
    items.current.add(element)
    return () => {
      items.current.delete(element)
    }
  }, [])

  const getItems = useCallback((includeDisabled = false) => {
    const node = root.current
    if (!node) return []
    const ordered = Array.from(node.querySelectorAll<HTMLElement>(`[${ITEM_DATA_ATTR}]`))
    const order = new Map(ordered.map((element, index) => [element, index]))
    const sorted = [...items.current].sort((a, b) => (order.get(a) ?? -1) - (order.get(b) ?? -1))
    return includeDisabled ? sorted : sorted.filter(item => item.dataset.disabled !== '')
  }, [])

  function handleFocus(event: FocusEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return
    const isKeyboardFocus = !isClickFocus.current
    if (isKeyboardFocus && !isTabbingBackOut) {
      const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS)
      event.currentTarget.dispatchEvent(entryFocusEvent)
      onEntryFocus?.(entryFocusEvent)
      if (!entryFocusEvent.defaultPrevented) {
        const candidates = getItems().filter(item => item.dataset.disabled !== '')
        const activeItem = candidates.find(item => item.getAttribute('data-active') === '')
        const highlightedItem = candidates.find(
          item => item.getAttribute('data-highlighted') === '',
        )
        const currentItem = candidates.find(item => item.id === currentTabStopId)
        focusFirst(
          [activeItem, highlightedItem, currentItem, ...candidates].filter(
            (item): item is HTMLElement => !!item,
          ),
          preventScrollOnEntryFocus,
        )
      }
    }
    isClickFocus.current = false
  }

  const value = useMemo<RovingFocusGroupContextValue>(
    () => ({
      loop,
      dir,
      orientation,
      currentTabStopId,
      onItemFocus: setCurrentTabStopId,
      onItemShiftTab: () => setIsTabbingBackOut(true),
      onFocusableItemAdd: () => setFocusableItemsCount(count => count + 1),
      onFocusableItemRemove: () => setFocusableItemsCount(count => count - 1),
      register,
      getItems,
    }),
    [loop, dir, orientation, currentTabStopId, setCurrentTabStopId, register, getItems],
  )

  return (
    <RovingFocusGroupContext value={value}>
      <Primitive
        {...attrs}
        ref={composedRef}
        tabIndex={isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0}
        data-orientation={orientation}
        dir={dir}
        style={{ ...style, outline: 'none' }}
        onMouseDown={composeEventHandlers(
          onMouseDown,
          () => {
            isClickFocus.current = true
          },
          both,
        )}
        onMouseUp={composeEventHandlers(
          onMouseUp,
          () => {
            setTimeout(() => {
              isClickFocus.current = false
            }, 1)
          },
          both,
        )}
        onFocus={composeEventHandlers(onFocus, handleFocus, both)}
        onBlur={composeEventHandlers(
          onBlur,
          (event: FocusEvent<HTMLElement>) => {
            if (event.target === event.currentTarget) setIsTabbingBackOut(false)
          },
          both,
        )}
      />
    </RovingFocusGroupContext>
  )
}

export interface RovingFocusItemProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  tabStopId?: string
  focusable?: boolean
  active?: boolean
  allowShiftKey?: boolean
  ref?: Ref<HTMLElement>
}

export function RovingFocusItem({
  tabStopId,
  focusable = true,
  active,
  allowShiftKey,
  as = 'span',
  asChild,
  onMouseDown,
  onFocus,
  onKeyDown,
  ref,
  ...attrs
}: RovingFocusItemProps) {
  const context = useRovingFocusGroupContext('RovingFocusItem')
  const randomId = useId()
  const id = tabStopId || randomId
  const isCurrentTabStop = context.currentTabStopId === id
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, setElement)
  const { register, onFocusableItemAdd, onFocusableItemRemove } = context

  useEffect(() => (element ? register(element) : undefined), [element, register])

  useEffect(() => {
    if (!focusable) return
    onFocusableItemAdd()
    return onFocusableItemRemove
  }, [focusable])

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Tab' && event.shiftKey) {
      context.onItemShiftTab()
      return
    }
    if (event.target !== event.currentTarget) return
    const focusIntent = getFocusIntent(event, context.orientation, context.dir)
    if (focusIntent === undefined) return
    if (event.metaKey || event.ctrlKey || event.altKey || (allowShiftKey ? false : event.shiftKey))
      return
    event.preventDefault()
    let candidates = context.getItems().filter(item => item.dataset.disabled !== '')
    if (focusIntent === 'last') candidates.reverse()
    else if (focusIntent === 'prev' || focusIntent === 'next') {
      if (focusIntent === 'prev') candidates.reverse()
      const currentIndex = candidates.indexOf(event.currentTarget)
      candidates = context.loop
        ? wrapArray(candidates, currentIndex + 1)
        : candidates.slice(currentIndex + 1)
    }
    queueMicrotask(() => focusFirst(candidates))
  }

  return (
    <Primitive
      {...attrs}
      {...{ [ITEM_DATA_ATTR]: '' }}
      ref={composedRef}
      tabIndex={isCurrentTabStop ? 0 : -1}
      data-orientation={context.orientation}
      data-active={active ? '' : undefined}
      data-disabled={!focusable ? '' : undefined}
      as={as}
      asChild={asChild}
      onMouseDown={composeEventHandlers(
        onMouseDown,
        (event: MouseEvent<HTMLElement>) => {
          if (!focusable) event.preventDefault()
          else context.onItemFocus(id)
        },
        both,
      )}
      onFocus={composeEventHandlers(
        onFocus,
        (event: FocusEvent<HTMLElement>) => {
          if (event.target === event.currentTarget) context.onItemFocus(id)
        },
        both,
      )}
      onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown, both)}
    />
  )
}
