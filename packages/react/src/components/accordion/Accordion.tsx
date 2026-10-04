'use client'

import { cn } from '../../lib/cn'
import { AccordionRoot, type AccordionRootProps } from '../../primitives/accordion'
import { accordion } from './accordion.variants'

export interface AccordionProps extends Omit<
  AccordionRootProps,
  'as' | 'asChild' | 'dir' | 'orientation' | 'unmountOnHide' | 'type' | 'collapsible'
> {
  type?: 'single' | 'multiple'
  collapsible?: boolean
}

export function Accordion({
  type = 'single',
  collapsible,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...attrs
}: AccordionProps) {
  return (
    <AccordionRoot
      type={type}
      collapsible={collapsible}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      {...attrs}
      className={cn(accordion(), className)}
    />
  )
}
