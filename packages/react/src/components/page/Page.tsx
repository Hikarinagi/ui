import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Container, type ContainerProps } from '../container/Container'

export interface PageProps extends ContainerProps {
  aside?: ReactNode
}

export function Page({ size, aside, className, children, ...attrs }: PageProps) {
  return (
    <Container {...attrs} size={size} className={cn('py-8', className)}>
      <div className="flex gap-10">
        <div className="flex min-w-0 flex-1 flex-col gap-8">{children}</div>
        {aside}
      </div>
    </Container>
  )
}
