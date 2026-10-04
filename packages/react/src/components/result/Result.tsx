import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { hasContent } from '../../lib/content'
import { lucide } from '../../lib/icon'
import { Empty, type EmptyProps } from '../empty/Empty'
import { resultIcon, type ResultVariants } from './result.variants'

const icons = {
  success: lucide(CircleCheck),
  error: lucide(CircleX),
  warning: lucide(TriangleAlert),
  info: lucide(Info),
}

export interface ResultProps extends Omit<EmptyProps, 'size' | 'icon'> {
  status?: NonNullable<ResultVariants['status']>
  size?: ResultVariants['size']
  icon?: ReactNode
}

export function Result({
  status = 'info',
  title,
  description,
  size = 'md',
  icon,
  actions,
  className,
  children,
  ...attrs
}: ResultProps) {
  const StatusIcon = icons[status]
  return (
    <Empty
      {...attrs}
      data-hn-result=""
      data-status={status}
      title={title}
      description={description}
      size={size}
      className={className}
      icon={
        hasContent(icon) ? (
          icon
        ) : (
          <span className={resultIcon({ status, size })}>
            <StatusIcon />
          </span>
        )
      }
      actions={actions}
    >
      {children}
    </Empty>
  )
}
