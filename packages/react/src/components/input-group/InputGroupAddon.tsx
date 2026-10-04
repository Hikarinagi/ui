import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { inputGroupAddon } from './input-group.variants'

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>
}

export function InputGroupAddon({ className, ...attrs }: InputGroupAddonProps) {
  return (
    <span data-hn-input-group-addon="" {...attrs} className={cn(inputGroupAddon(), className)} />
  )
}
