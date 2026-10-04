'use client'

import {
  PopoverContent as PrimitivePopoverContent,
  type PopoverContentProps,
} from '../../primitives/popover'
import { usePopoverCloseFocus } from './hooks/usePopoverCloseFocus'

export function PopoverContent({ onCloseAutoFocus, ...props }: PopoverContentProps) {
  const closeAutoFocus = usePopoverCloseFocus(onCloseAutoFocus)
  return <PrimitivePopoverContent {...props} onCloseAutoFocus={closeAutoFocus} />
}
