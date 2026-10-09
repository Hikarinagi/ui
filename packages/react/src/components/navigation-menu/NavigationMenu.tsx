'use client'

import { useRef, useState, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { useAccessibleName } from '../../lib/a11y'
import { radixNavigationViewportStyle } from '../../lib/radix/styles'
import { useRadixNavigationViewport } from '../../lib/radix/navigation-viewport'
import {
  NavigationMenuList as PrimitiveList,
  NavigationMenuRoot as PrimitiveRoot,
  NavigationMenuViewport as PrimitiveViewport,
  useNavigationMenuModelValue,
} from '../../primitives/navigation-menu'
import { useDirection } from '../stepper/hooks/useDirection'
import { NavigationMenuContext } from './context'
import { useNavigationMenuKeyboard } from './hooks/useNavigationMenuKeyboard'
import { useNavigationMenuLayout } from './hooks/useNavigationMenuLayout'
import {
  navigationMenu,
  navigationMenuList,
  navigationMenuViewport,
} from './navigation-menu.variants'
import type { NavigationMenuProps } from './types'
import { useComposedRefs } from '../../primitives/utils/compose-refs'
import { useControllableState } from '../../primitives/utils/controllable-state'

function SlotValue({ children }: { children: (props: { value: string }) => ReactNode }) {
  return children({ value: useNavigationMenuModelValue() })
}

export function NavigationMenu({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  ...props
}: NavigationMenuProps) {
  const [model = '', setModel] = useControllableState<string>({
    prop: value,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
    caller: 'NavigationMenu',
  })
  return (
    <NavigationMenuImpl
      key={orientation}
      {...props}
      orientation={orientation}
      model={model}
      onModelChange={setModel}
    />
  )
}

interface NavigationMenuImplProps extends Omit<
  NavigationMenuProps,
  'value' | 'defaultValue' | 'onValueChange'
> {
  orientation: NonNullable<NavigationMenuProps['orientation']>
  model: string
  onModelChange: (value: string) => void
}

function NavigationMenuImpl({
  label,
  orientation,
  dir,
  size = 'md',
  trigger = 'hover',
  delayDuration = 200,
  skipDelayDuration = 300,
  align: alignProp = 'center',
  unmountOnHide = true,
  className,
  listClass,
  viewportClass,
  model,
  onModelChange,
  onKeyDownCapture,
  children,
  ref,
  ...attrs
}: NavigationMenuImplProps) {
  const { viewport, ready } = useRadixNavigationViewport()
  const { root, direction, rootDirection } = useDirection(dir)
  const [element, setElement] = useState<HTMLElement | null>(null)
  const composedRef = useComposedRefs(ref, root as Ref<HTMLElement>, setElement)
  const onKeydown = useNavigationMenuKeyboard(element, orientation, direction)
  const { side, placement, style } = useNavigationMenuLayout(element, orientation, direction)
  const align =
    orientation === 'horizontal' && direction === 'rtl' && alignProp !== 'center'
      ? alignProp === 'start'
        ? 'end'
        : 'start'
      : alignProp
  const handlers = useRef({ onKeydown, onKeyDownCapture })
  handlers.current = { onKeydown, onKeyDownCapture }
  useAccessibleName('NavigationMenu', !label, attrs)

  return (
    <NavigationMenuContext value={{ size, orientation }}>
      <PrimitiveRoot
        value={model}
        onValueChange={onModelChange}
        asChild
        orientation={orientation}
        dir={direction}
        delayDuration={delayDuration}
        skipDelayDuration={skipDelayDuration}
        disableHoverTrigger={trigger === 'click'}
        disablePointerLeaveClose={trigger === 'click'}
        unmountOnHide={unmountOnHide}
        aria-label={label}
        className={cn(navigationMenu(), className)}
        {...attrs}
        onKeyDownCapture={(event: KeyboardEvent<HTMLElement>) => {
          handlers.current.onKeydown(event)
          handlers.current.onKeyDownCapture?.(event)
        }}
      >
        <nav ref={composedRef} dir={rootDirection} style={style} data-hn-navigation-menu="">
          <PrimitiveList
            data-hn-navigation-list=""
            className={cn(navigationMenuList({ orientation }), listClass)}
          >
            {typeof children === 'function' ? <SlotValue>{children}</SlotValue> : children}
          </PrimitiveList>
          <PrimitiveViewport
            asChild
            data-hn-navigation-viewport=""
            align={align}
            data-side={placement}
            className={cn(navigationMenuViewport({ orientation, side }), viewportClass)}
          >
            <div
              ref={viewport}
              data-hn-ready={ready ? '' : undefined}
              style={radixNavigationViewportStyle}
            />
          </PrimitiveViewport>
        </nav>
      </PrimitiveRoot>
    </NavigationMenuContext>
  )
}
