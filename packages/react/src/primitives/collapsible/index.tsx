'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type Ref,
  type RefObject,
} from 'react'
import {
  isCollapsibleContentRendered,
  measureCollapsibleContent,
  openState,
  type CollapsibleMotion,
} from '../../../../shared/src/primitives/collapsible'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { Presence } from '../presence'
import { composeEventHandlers } from '../utils/compose-event-handlers'
import { useComposedRefs } from '../utils/compose-refs'
import { useControllableState } from '../utils/controllable-state'

interface CollapsibleRootContextValue {
  contentId: RefObject<string>
  disabled: boolean
  open: boolean
  unmountOnHide: boolean
  onOpenToggle: () => void
}

const CollapsibleRootContext = createContext<CollapsibleRootContextValue | null>(null)

export function useCollapsibleRootContext(consumer: string) {
  const context = useContext(CollapsibleRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`CollapsibleRoot\``)
  return context
}

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

export interface CollapsibleRootProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  unmountOnHide?: boolean
  ref?: Ref<HTMLElement>
}

export function CollapsibleRoot({
  defaultOpen = false,
  open: openProp,
  onOpenChange,
  disabled = false,
  unmountOnHide = true,
  ...attrs
}: CollapsibleRootProps) {
  const contentId = useRef('')
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    caller: 'CollapsibleRoot',
  })

  const onOpenToggle = useCallback(() => {
    if (disabled) return
    setOpen(!open)
  }, [disabled, open, setOpen])

  return (
    <CollapsibleRootContext value={{ contentId, disabled, open, unmountOnHide, onOpenToggle }}>
      <Primitive
        data-state={openState(open)}
        data-disabled={disabled ? '' : undefined}
        {...attrs}
      />
    </CollapsibleRootContext>
  )
}

export interface CollapsibleTriggerProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  ref?: Ref<HTMLElement>
}

export function CollapsibleTrigger({
  as = 'button',
  asChild,
  onClick,
  ...attrs
}: CollapsibleTriggerProps) {
  const root = useCollapsibleRootContext('CollapsibleTrigger')
  const id = useId()
  if (!root.contentId.current) root.contentId.current = id
  return (
    <Primitive
      {...({
        type: as === 'button' ? 'button' : undefined,
        disabled: root.disabled,
      } as HTMLAttributes<HTMLElement>)}
      as={as}
      asChild={asChild}
      aria-controls={root.contentId.current}
      aria-expanded={root.open}
      data-state={openState(root.open)}
      data-disabled={root.disabled ? '' : undefined}
      {...attrs}
      onClick={composeEventHandlers(onClick, root.onOpenToggle)}
    />
  )
}

export interface CollapsibleContentProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  forceMount?: boolean
  onContentFound?: () => void
  ref?: Ref<HTMLElement>
}

export function CollapsibleContent({ forceMount, ...props }: CollapsibleContentProps) {
  const root = useCollapsibleRootContext('CollapsibleContent')
  const id = useId()
  if (!root.contentId.current) root.contentId.current = id
  return (
    <Presence present={!!forceMount || root.open}>
      {({ present }) => <CollapsibleContentImpl {...props} present={present} />}
    </Presence>
  )
}

interface CollapsibleContentImplProps extends Omit<CollapsibleContentProps, 'forceMount'> {
  present: boolean
}

function CollapsibleContentImpl({
  present,
  onContentFound,
  style,
  children,
  ref,
  ...attrs
}: CollapsibleContentImplProps) {
  const root = useCollapsibleRootContext('CollapsibleContent')
  const node = useRef<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, node)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const isOpen = root.open
  const [isMountAnimationPrevented, setMountAnimationPrevented] = useState(isOpen)
  const prevented = useRef(isOpen)
  const motion = useRef<CollapsibleMotion | undefined>(undefined)
  const latest = useRef({ onOpenToggle: root.onOpenToggle, onContentFound })
  latest.current = { onOpenToggle: root.onOpenToggle, onContentFound }

  useLayoutEffect(() => {
    const element = node.current
    if (!element) return
    const measured = measureCollapsibleContent(element, motion.current, prevented.current)
    motion.current = measured.motion
    setSize(previous =>
      previous.height === measured.height && previous.width === measured.width
        ? previous
        : { height: measured.height, width: measured.width },
    )
  }, [isOpen, present])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      prevented.current = false
      setMountAnimationPrevented(false)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const element = node.current
    if (!element) return
    const onBeforeMatch = () => {
      requestAnimationFrame(() => {
        latest.current.onOpenToggle()
        latest.current.onContentFound?.()
      })
    }
    element.addEventListener('beforematch', onBeforeMatch)
    return () => element.removeEventListener('beforematch', onBeforeMatch)
  }, [])

  const skipAnimation = isMountAnimationPrevented && isOpen
  const hidden = !present ? (root.unmountOnHide ? true : 'until-found') : undefined

  return (
    <Primitive
      {...attrs}
      id={root.contentId.current}
      ref={composedRef}
      {...({ hidden } as HTMLAttributes<HTMLElement>)}
      data-state={skipAnimation ? undefined : openState(isOpen)}
      data-disabled={root.disabled ? '' : undefined}
      style={
        {
          ...style,
          '--radix-collapsible-content-height': `${size.height}px`,
          '--radix-collapsible-content-width': `${size.width}px`,
        } as CSSProperties
      }
    >
      {isCollapsibleContentRendered(present, root.unmountOnHide) ? children : null}
    </Primitive>
  )
}
