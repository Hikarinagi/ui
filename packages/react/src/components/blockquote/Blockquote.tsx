import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'

export interface BlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
  cite?: string
  ref?: Ref<HTMLQuoteElement>
}

export function Blockquote({ cite, className, children, ...attrs }: BlockquoteProps) {
  return (
    <blockquote {...attrs} className={cn('hn-blockquote', className)}>
      {children}
      {cite && <footer className="text-faint mt-2 text-sm">{`—— ${cite}`}</footer>}
    </blockquote>
  )
}
