import { ChevronDown, ChevronRight } from 'lucide-react'
import { lucide } from '../../lib/icon'
import type { HTMLAttributes, Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { disclosureIcon, type DisclosureIconVariants } from './disclosure-icon.variants'

const ChevronDownIcon = lucide(ChevronDown)
const ChevronRightIcon = lucide(ChevronRight)

export interface DisclosureIconProps extends HTMLAttributes<HTMLSpanElement> {
  direction?: DisclosureIconVariants['direction']
  open?: boolean
  ref?: Ref<HTMLSpanElement>
}

export function DisclosureIcon({
  direction = 'down',
  open,
  className,
  children,
  ...attrs
}: DisclosureIconProps) {
  const classes = cn(
    'inline-flex',
    disclosureIcon({
      direction,
      state: open === undefined ? 'auto' : open ? 'open' : 'closed',
    }),
    className,
  )

  return (
    <span aria-hidden="true" {...attrs} className={classes}>
      {hasContent(children) ? (
        children
      ) : direction === 'end' ? (
        <ChevronRightIcon />
      ) : (
        <ChevronDownIcon />
      )}
    </span>
  )
}
