import { cn } from '../../lib/cn'
import {
  AccordionItem as AccordionItemPrimitive,
  type AccordionItemProps as AccordionItemPrimitiveProps,
} from '../../primitives/accordion'

export interface AccordionItemProps extends Omit<
  AccordionItemPrimitiveProps,
  'as' | 'asChild' | 'unmountOnHide'
> {}

export function AccordionItem({ value, disabled, className, ...attrs }: AccordionItemProps) {
  return (
    <AccordionItemPrimitive
      value={value}
      disabled={disabled}
      {...attrs}
      className={cn(className)}
    />
  )
}
