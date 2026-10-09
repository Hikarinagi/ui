'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type Ref,
} from 'react'
import {
  activatesOnFocus,
  makeContentId,
  makeTriggerId,
  tabsState,
} from '../../../../shared/src/primitives/tabs'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { Presence } from '../presence'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useControllableState } from '../utils/controllable-state'
import { useDirection } from '../utils/direction'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }
type TabsValue = string | number

interface TabsRootContextValue {
  modelValue: TabsValue | undefined
  changeModelValue: (value: TabsValue) => void
  orientation: 'horizontal' | 'vertical'
  dir: 'ltr' | 'rtl'
  unmountOnHide: boolean
  activationMode: 'automatic' | 'manual'
  baseId: string
  contentIds: ReadonlySet<TabsValue>
  registerContent: (value: TabsValue) => void
  unregisterContent: (value: TabsValue) => void
}

const TabsRootContext = createContext<TabsRootContextValue | null>(null)

export function useTabsRootContext(consumer: string) {
  const context = useContext(TabsRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`TabsRoot\``)
  return context
}

export interface TabsRootProps
  extends
    PrimitiveProps,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'dir'>,
    DataAttributes {
  defaultValue?: TabsValue
  value?: TabsValue
  onValueChange?: (value: TabsValue) => void
  orientation?: 'horizontal' | 'vertical'
  dir?: 'ltr' | 'rtl'
  activationMode?: 'automatic' | 'manual'
  unmountOnHide?: boolean
  ref?: Ref<HTMLElement>
}

export function TabsRoot({
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  dir: dirProp,
  activationMode = 'automatic',
  unmountOnHide = true,
  ...attrs
}: TabsRootProps) {
  const dir = useDirection(dirProp)
  const baseId = useId()
  const [modelValue, setModelValue] = useControllableState<TabsValue | undefined>({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange as (value: TabsValue | undefined) => void,
    caller: 'TabsRoot',
  })
  const [contentIds, setContentIds] = useState<ReadonlySet<TabsValue>>(() => new Set())

  const registerContent = useCallback((next: TabsValue) => {
    setContentIds(previous => new Set([...previous, next]))
  }, [])
  const unregisterContent = useCallback((next: TabsValue) => {
    setContentIds(previous => {
      const set = new Set(previous)
      set.delete(next)
      return set
    })
  }, [])

  return (
    <TabsRootContext
      value={{
        modelValue,
        changeModelValue: setModelValue,
        orientation,
        dir,
        unmountOnHide,
        activationMode,
        baseId,
        contentIds,
        registerContent,
        unregisterContent,
      }}
    >
      <Primitive dir={dir} data-orientation={orientation} {...attrs} />
    </TabsRootContext>
  )
}

export interface TabsListProps extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  loop?: boolean
  ref?: Ref<HTMLElement>
}

export function TabsList({ loop = true, ...attrs }: TabsListProps) {
  const context = useTabsRootContext('TabsList')
  return (
    <RovingFocusGroup asChild orientation={context.orientation} dir={context.dir} loop={loop}>
      <Primitive
        role="tablist"
        dir={context.dir}
        aria-orientation={context.orientation}
        {...attrs}
      />
    </RovingFocusGroup>
  )
}

export interface TabsTriggerProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  value: TabsValue
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function TabsTrigger({
  value,
  disabled = false,
  as = 'button',
  asChild,
  onMouseDown,
  onKeyDown,
  onFocus,
  ...attrs
}: TabsTriggerProps) {
  const root = useTabsRootContext('TabsTrigger')
  const triggerId = makeTriggerId(root.baseId, value)
  const contentId = root.contentIds.has(value) ? makeContentId(root.baseId, value) : undefined
  const isSelected = value === root.modelValue

  return (
    <RovingFocusItem
      asChild
      focusable={!disabled}
      active={isSelected}
      data-active={isSelected ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      <Primitive
        id={triggerId}
        role="tab"
        {...({
          type: as === 'button' ? 'button' : undefined,
          disabled,
        } as HTMLAttributes<HTMLElement>)}
        as={as}
        asChild={asChild}
        aria-selected={isSelected ? 'true' : 'false'}
        aria-controls={contentId}
        data-state={tabsState(isSelected)}
        data-disabled={disabled ? '' : undefined}
        data-orientation={root.orientation}
        {...attrs}
        onMouseDown={composeEventHandlers(onMouseDown, (event: MouseEvent<HTMLElement>) => {
          if (event.button !== 0) return
          if (!disabled && event.ctrlKey === false) root.changeModelValue(value)
          else event.preventDefault()
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event: KeyboardEvent<HTMLElement>) => {
          if (event.key === 'Enter' || event.key === ' ') root.changeModelValue(value)
        })}
        onFocus={composeEventHandlers(onFocus, () => {
          if (activatesOnFocus(root.activationMode, isSelected, !!disabled))
            root.changeModelValue(value)
        })}
      />
    </RovingFocusItem>
  )
}

export interface TabsContentProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  value: TabsValue
  forceMount?: boolean
  ref?: Ref<HTMLElement>
}

export function TabsContent({ value, forceMount, style, children, ...attrs }: TabsContentProps) {
  const root = useTabsRootContext('TabsContent')
  const triggerId = makeTriggerId(root.baseId, value)
  const contentId = makeContentId(root.baseId, value)
  const isSelected = value === root.modelValue
  const [isMountAnimationPrevented, setMountAnimationPrevented] = useState(isSelected)
  const { registerContent, unregisterContent } = root

  useLayoutEffect(() => {
    registerContent(value)
    return () => unregisterContent(value)
  }, [value, registerContent, unregisterContent])

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMountAnimationPrevented(false))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <Presence present={!!forceMount || isSelected}>
      {({ present }) => (
        <Primitive
          id={contentId}
          role="tabpanel"
          data-state={tabsState(isSelected)}
          data-orientation={root.orientation}
          aria-labelledby={triggerId}
          hidden={!present}
          tabIndex={0}
          {...attrs}
          style={{
            animationDuration: isMountAnimationPrevented ? '0s' : undefined,
            ...style,
          }}
        >
          {(root.unmountOnHide ? present : true) ? children : null}
        </Primitive>
      )}
    </Presence>
  )
}
