'use client'

import type { InputHTMLAttributes, Ref } from 'react'
import { ListboxFilter } from '../../primitives/listbox'
import { cn } from '../../lib/cn'
import { commandInput } from './command-palette.variants'
import { useCommandPaletteContext } from './context'
import { useComposedRefs } from '../../primitives/utils/compose-refs'

export interface CommandPaletteInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'defaultValue' | 'onChange' | 'autoFocus'
> {
  ref?: Ref<HTMLInputElement>
}

export function CommandPaletteInput({
  placeholder,
  className,
  ref,
  ...attrs
}: CommandPaletteInputProps) {
  const context = useCommandPaletteContext()
  const composedRef = useComposedRefs(ref, context.setInput)

  return (
    <ListboxFilter
      {...attrs}
      ref={composedRef}
      value={context.search}
      onValueChange={context.setSearch}
      autoFocus={context.autoFocus}
      placeholder={placeholder ?? context.placeholder}
      aria-label={context.label}
      className={className ? cn(commandInput(), className) : commandInput()}
    />
  )
}
