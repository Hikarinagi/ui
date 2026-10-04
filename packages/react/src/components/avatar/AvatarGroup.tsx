'use client'

import { Fragment, useMemo, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Avatar } from './Avatar'
import { flattenChildren } from './utils/children'
import type { AvatarVariants } from './avatar.variants'
import { avatarGroup } from './avatar-group.variants'
import { AvatarGroupContextValue } from './context'

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarVariants['size']
  className?: string
  children?: ReactNode
}

export function AvatarGroup({ max, size, className, children, ...attrs }: AvatarGroupProps) {
  const nodes = flattenChildren(children)
  const visible = max && max > 0 ? nodes.slice(0, max) : nodes
  const hidden = nodes.length - visible.length
  const context = useMemo(() => ({ size }), [size])

  return (
    <AvatarGroupContextValue value={context}>
      <div className={cn(avatarGroup({ size }), className)} {...attrs}>
        {hidden > 0 && <Avatar>{`+${hidden}`}</Avatar>}
        {[...visible].reverse().map((node, i) => (
          <Fragment key={i}>{node}</Fragment>
        ))}
      </div>
    </AvatarGroupContextValue>
  )
}
