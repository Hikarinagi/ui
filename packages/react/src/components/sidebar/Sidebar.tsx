'use client'

import type { HTMLAttributes, ReactNode, Ref, TransitionEvent } from 'react'
import { cn } from '../../lib/cn'
import { useUiLocale } from '../../locale'
import { CloseButton } from '../close-button/CloseButton'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { useSidebar, type SidebarState } from './context'
import { SidebarLabel } from './SidebarLabel'
import {
  sidebarRoot,
  sidebarRegion,
  sidebarBrand,
  sidebarIcon,
  sidebarWordmark,
} from './sidebar.variants'

export interface SidebarSlotProps {
  state: SidebarState
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  label?: string
  closable?: boolean
  renderHeader?: (props: SidebarSlotProps) => ReactNode
  renderIcon?: (props: SidebarSlotProps) => ReactNode
  renderWordmark?: (props: SidebarSlotProps) => ReactNode
  renderFooter?: (props: SidebarSlotProps) => ReactNode
  ref?: Ref<HTMLElement>
  [attribute: `data-${string}`]: string | undefined
}

export function Sidebar({
  label,
  closable = true,
  renderHeader,
  renderIcon,
  renderWordmark,
  renderFooter,
  className,
  children,
  onTransitionRun,
  ...attrs
}: SidebarProps) {
  const t = useUiLocale()
  const sidebar = useSidebar()
  const state = sidebar?.state ?? 'expanded'
  const inDrawer = sidebar?.inDrawer ?? false
  const close = inDrawer && closable
  const toggle = () => sidebar?.toggle()
  const railWithoutIcon = state === 'rail' && !renderIcon

  function transitionRun(event: TransitionEvent<HTMLElement>) {
    sidebar?.onTransitionRun?.(event)
    onTransitionRun?.(event)
  }

  return (
    <aside
      data-state={state}
      inert={state === 'hidden'}
      {...attrs}
      className={cn(sidebarRoot({ inDrawer }), className)}
      onTransitionRun={transitionRun}
    >
      {renderHeader ? (
        <div className={cn(sidebarRegion({ inDrawer }), 'flex items-center gap-2')}>
          <div className="min-w-0 flex-1">{renderHeader({ state })}</div>
          {close && <CloseButton className="shrink-0" onClick={toggle} />}
        </div>
      ) : renderIcon || renderWordmark ? (
        <div
          className="hn-collapse shrink-0"
          data-state={railWithoutIcon ? 'closed' : 'open'}
          inert={railWithoutIcon}
        >
          <div className="hn-collapse-body">
            <div className={sidebarRegion({ inDrawer })}>
              <div className={sidebarBrand()}>
                {renderIcon && <div className={sidebarIcon()}>{renderIcon({ state })}</div>}
                {renderWordmark && (
                  <SidebarLabel as="div" className={sidebarWordmark()}>
                    {renderWordmark({ state })}
                  </SidebarLabel>
                )}
                {close && <CloseButton className="ms-auto shrink-0" onClick={toggle} />}
              </div>
            </div>
          </div>
        </div>
      ) : close ? (
        <div className={cn(sidebarRegion({ inDrawer }), 'flex justify-end')}>
          <CloseButton onClick={toggle} />
        </div>
      ) : null}
      <ScrollArea shadow={false} className="min-h-0 flex-1">
        <nav
          aria-label={label ?? t.sidebar.navLabel}
          className={cn('flex flex-col gap-1', inDrawer ? 'py-2' : 'px-2.5 py-2.5')}
        >
          {children}
        </nav>
      </ScrollArea>
      {renderFooter && (
        <div className={sidebarRegion({ inDrawer, footer: true })}>{renderFooter({ state })}</div>
      )}
    </aside>
  )
}
