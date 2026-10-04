'use client'

import { createContext, useContext, type HTMLAttributes, type ReactNode, type Ref } from 'react'
import { Direction as RadixDirection } from 'radix-ui'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { RovingFocusGroup, RovingFocusItem } from '../roving-focus'
import type { Direction, Orientation } from '../roving-focus'
import {
  ToggleGroupItem,
  ToggleGroupRoot,
  type AcceptableValue,
  type ToggleGroupRootProps,
} from '../toggle-group'

type DataAttributes = { [attribute: `data-${string}`]: string | undefined }

interface ToolbarRootContextValue {
  orientation: Orientation
  dir: Direction
}

const ToolbarRootContext = createContext<ToolbarRootContextValue | null>(null)

function useToolbarRootContext(consumer: string) {
  const context = useContext(ToolbarRootContext)
  if (!context) throw new Error(`\`${consumer}\` must be used within \`ToolbarRoot\``)
  return context
}

export interface ToolbarRootProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'dir'>, DataAttributes {
  orientation?: Orientation
  dir?: Direction
  loop?: boolean
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

export function ToolbarRoot({
  orientation = 'horizontal',
  dir: dirProp,
  loop = false,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: ToolbarRootProps) {
  const dir = RadixDirection.useDirection(dirProp)
  return (
    <ToolbarRootContext value={{ orientation, dir }}>
      <RovingFocusGroup asChild orientation={orientation} dir={dir} loop={loop} {...attrs}>
        <Primitive
          ref={ref}
          role="toolbar"
          aria-orientation={orientation}
          as={as}
          asChild={asChild}
        >
          {children}
        </Primitive>
      </RovingFocusGroup>
    </ToolbarRootContext>
  )
}

export interface ToolbarButtonProps
  extends PrimitiveProps, HTMLAttributes<HTMLElement>, DataAttributes {
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function ToolbarButton({
  disabled,
  as = 'button',
  asChild,
  ref,
  children,
  ...attrs
}: ToolbarButtonProps) {
  return (
    <RovingFocusItem asChild focusable={!disabled} {...attrs}>
      <Primitive
        ref={ref}
        {...({
          type: as === 'button' ? 'button' : undefined,
          disabled,
        } as HTMLAttributes<HTMLElement>)}
        as={as}
        asChild={asChild}
      >
        {children}
      </Primitive>
    </RovingFocusItem>
  )
}

export interface ToolbarToggleGroupProps extends Omit<ToggleGroupRootProps, 'rovingFocus'> {}

export function ToolbarToggleGroup(props: ToolbarToggleGroupProps) {
  const root = useToolbarRootContext('ToolbarToggleGroup')
  return (
    <ToggleGroupRoot
      {...props}
      data-orientation={root.orientation}
      dir={root.dir}
      rovingFocus={false}
    />
  )
}

export interface ToolbarToggleItemProps
  extends PrimitiveProps, Omit<HTMLAttributes<HTMLElement>, 'defaultValue'>, DataAttributes {
  value: AcceptableValue
  disabled?: boolean
  ref?: Ref<HTMLElement>
}

export function ToolbarToggleItem({
  value,
  disabled,
  as,
  asChild,
  ref,
  children,
  ...attrs
}: ToolbarToggleItemProps) {
  return (
    <ToolbarButton asChild disabled={disabled} {...attrs}>
      <ToggleGroupItem ref={ref} value={value} disabled={disabled} as={as} asChild={asChild}>
        {children}
      </ToggleGroupItem>
    </ToolbarButton>
  )
}
