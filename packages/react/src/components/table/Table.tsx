import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { ScrollArea, type ScrollAreaProps } from '../scroll-area/ScrollArea'
import { tableWrapper, type TableVariants } from './table.variants'

export interface TableProps extends Omit<ScrollAreaProps, 'direction'> {
  variant?: TableVariants['variant']
  hover?: boolean
  stickyHeader?: boolean
  caption?: string
  children?: ReactNode
}

export function Table({
  variant = 'primary',
  hover = true,
  stickyHeader = false,
  caption,
  className,
  children,
  ...attrs
}: TableProps) {
  return (
    <ScrollArea
      {...attrs}
      direction={stickyHeader ? 'both' : 'horizontal'}
      className={cn(tableWrapper({ variant, hover, stickyHeader }), className)}
    >
      <table className="hn-table">
        {caption ? (
          <caption>
            <span>{caption}</span>
          </caption>
        ) : null}
        {children}
      </table>
    </ScrollArea>
  )
}
