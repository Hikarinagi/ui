import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { Card, type CardProps } from '../card/Card'
import { Heading } from '../heading/Heading'
import { Text } from '../text/Text'
import { panelActions, panelBody, panelHeader, panelIcon, panelTitle } from './panel.variants'

export interface PanelProps extends Omit<CardProps, 'title' | 'padded'> {
  title: ReactNode
  description?: ReactNode
  count?: number
  level?: 2 | 3 | 4
  padded?: boolean
  icon?: ReactNode
  actions?: ReactNode
}

export function Panel({
  title,
  description,
  count,
  level = 2,
  padded = true,
  icon,
  actions,
  className,
  children,
  ...attrs
}: PanelProps) {
  return (
    <Card data-hn-panel="" {...attrs} padded={false} className={cn('flex flex-col', className)}>
      <div className={panelHeader()}>
        <div className="flex min-w-0 flex-col gap-1">
          <div className={panelTitle()}>
            {hasContent(icon) ? (
              <span className={panelIcon()} aria-hidden="true">
                {icon}
              </span>
            ) : null}
            <Heading level={level} size="base" className="min-w-0">
              {title}
            </Heading>
            {count !== undefined ? (
              <Text as="span" tone="muted" size="sm" className="tabular-nums">
                {count}
              </Text>
            ) : null}
          </div>
          {hasContent(description) && description !== '' ? (
            <Text tone="muted" size="sm">
              {description}
            </Text>
          ) : null}
        </div>
        {hasContent(actions) ? <div className={panelActions()}>{actions}</div> : null}
      </div>
      {hasContent(children) ? <div className={panelBody({ padded })}>{children}</div> : null}
    </Card>
  )
}
