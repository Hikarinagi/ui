'use client'

import { useImperativeHandle, useMemo, useRef, type ReactNode, type Ref } from 'react'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { LayoutTransitionProvider } from '../../lib/layout-stability'
import { useUiLocale } from '../../locale'
import { ScrollArea, type ScrollAreaHandle } from '../scroll-area/ScrollArea'
import { TooltipProvider } from '../tooltip/TooltipProvider'
import { Drawer } from '../drawer/Drawer'
import { DrawerScope } from '../sidebar/DrawerScope'
import { SidebarContext, type SidebarContextValue, type SidebarState } from '../sidebar/context'
import { useDesktopQuery } from './hooks/useDesktopQuery'
import { useLocationChange } from './hooks/useLocationChange'
import { useSidebarScrollUpdates } from './hooks/useSidebarScrollUpdates'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface AppShellHandle {
  readonly mainViewport: HTMLElement | undefined
  readonly mainArea: ScrollAreaHandle | undefined
}

export interface AppShellProps {
  collapsible?: 'rail' | 'hidden'
  restoreKey?: string
  autoClose?: boolean
  mobileTitle?: string
  className?: string
  sidebar?: SidebarState
  defaultSidebar?: SidebarState
  onSidebarChange?: (state: SidebarState) => void
  mobileOpen?: boolean
  defaultMobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
  onSizeStable?: () => void
  banner?: ReactNode
  sidebarContent?: ReactNode
  header?: ReactNode
  children?: ReactNode
  ref?: Ref<AppShellHandle>
}

export function AppShell({
  collapsible = 'rail',
  restoreKey,
  autoClose = true,
  mobileTitle,
  className,
  sidebar: sidebarProp,
  defaultSidebar,
  onSidebarChange,
  mobileOpen: mobileOpenProp,
  defaultMobileOpen,
  onMobileOpenChange,
  onSizeStable,
  banner,
  sidebarContent,
  header,
  children,
  ref,
}: AppShellProps) {
  const t = useUiLocale()
  const [sidebar = 'expanded', setSidebar] = useControllableState<SidebarState>({
    prop: sidebarProp,
    defaultProp: defaultSidebar ?? 'expanded',
    onChange: onSidebarChange,
    caller: 'AppShell',
  })
  const [mobileOpen = false, setMobileOpen] = useControllableState({
    prop: mobileOpenProp,
    defaultProp: defaultMobileOpen ?? false,
    onChange: onMobileOpenChange,
    caller: 'AppShell',
  })
  const main = useRef<ScrollAreaHandle>(null)

  useImperativeHandle(
    ref,
    () => ({
      get mainViewport() {
        return main.current?.viewport
      },
      get mainArea() {
        return main.current ?? undefined
      },
    }),
    [],
  )

  const isDesktop = useDesktopQuery()
  const { transitioning, onTransitionRun } = useSidebarScrollUpdates(sidebar, () =>
    onSizeStable?.(),
  )

  const context = useMemo<SidebarContextValue>(
    () => ({
      state: sidebar,
      toggle() {
        if (!isDesktop) {
          setMobileOpen(!mobileOpen)
          return
        }
        setSidebar(sidebar === 'expanded' ? collapsible : 'expanded')
      },
      openMobile: () => setMobileOpen(true),
      onTransitionRun,
    }),
    [sidebar, isDesktop, mobileOpen, collapsible, setSidebar, setMobileOpen, onTransitionRun],
  )

  useLocationChange(() => {
    if (autoClose) setMobileOpen(false)
  })

  const withSidebar = hasContent(sidebarContent)

  return (
    <TooltipProvider>
      <LayoutTransitionProvider transitioning={transitioning}>
        <SidebarContext value={context}>
          <div
            className={cn('bg-canvas text-fg flex h-screen flex-col overflow-hidden', className)}
          >
            {hasContent(banner) && <div className="shrink-0">{banner}</div>}
            <div className="flex min-h-0 flex-1">
              {withSidebar && (
                <div className="hidden h-full shrink-0 lg:block">{sidebarContent}</div>
              )}
              <div className="flex min-h-0 min-w-0 flex-1 flex-col">
                {hasContent(header) && (
                  <header className="border-line bg-canvas shrink-0 border-b">
                    <div className="flex h-14 items-center gap-3 px-4 sm:px-6">{header}</div>
                  </header>
                )}
                <main className="min-h-0 min-w-0 flex-1">
                  <ScrollArea ref={main} data-scroll-restore={restoreKey} className="h-full">
                    {children}
                  </ScrollArea>
                </main>
              </div>
            </div>
            {withSidebar && (
              <Drawer
                open={mobileOpen}
                onOpenChange={setMobileOpen}
                title={mobileTitle ?? t.sidebar.navLabel}
                side="start"
                size="sm"
                className="lg:hidden"
                renderBody={({ close }) => (
                  <DrawerScope close={close}>{sidebarContent}</DrawerScope>
                )}
              />
            )}
          </div>
        </SidebarContext>
      </LayoutTransitionProvider>
    </TooltipProvider>
  )
}
