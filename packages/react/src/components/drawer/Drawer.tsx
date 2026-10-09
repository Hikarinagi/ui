'use client'

import { useImperativeHandle, type ReactNode, type Ref } from 'react'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../primitives/dialog'
import { cn } from '../../lib/cn'
import { FormScopeContext, useFormScope } from '../form/scope'
import { hasContent } from '../../lib/content'
import { useOverlayPortal } from '../../lib/overlay-portal'
import { useScrollViewport } from '../../lib/scroll-viewport'
import { Card } from '../card/Card'
import { CloseButton } from '../close-button/CloseButton'
import { Heading } from '../heading/Heading'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { Text } from '../text/Text'
import { drawerCard } from './drawer.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface DrawerSlotProps {
  close: () => void
  submitting: boolean
}

export interface DrawerHandle {
  readonly viewport: HTMLElement | undefined
}

export interface DrawerProps {
  title: string
  titleContent?: ReactNode
  description?: string
  side?: 'start' | 'end'
  size?: 'sm' | 'md' | 'lg'
  header?: boolean
  closable?: boolean
  locked?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  icon?: ReactNode
  renderBody?: (props: DrawerSlotProps) => ReactNode
  renderContent?: (props: DrawerSlotProps) => ReactNode
  renderFooter?: (props: DrawerSlotProps) => ReactNode
  ref?: Ref<DrawerHandle>
}

export function Drawer({
  title,
  titleContent,
  description,
  side = 'end',
  size = 'md',
  header = true,
  closable = true,
  locked: lockedProp = false,
  className,
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
  icon,
  renderBody,
  renderContent,
  renderFooter,
  ref,
}: DrawerProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Drawer',
  })
  const { submitting, scope } = useFormScope()
  const locked = lockedProp || submitting
  const { contentRef, present } = useOverlayPortal(open)
  const { scrollArea, viewport, read } = useScrollViewport()

  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return read()
      },
    }),
    [viewport, read],
  )

  function guard(event: Event) {
    if (locked) event.preventDefault()
  }

  const close = () => setOpen(false)
  const body = renderBody !== undefined

  return (
    <FormScopeContext value={scope}>
      <DialogRoot open={open} onOpenChange={setOpen}>
        {hasContent(children) && <DialogTrigger asChild>{children}</DialogTrigger>}
        {present && (
          <DialogPortal>
            <DialogOverlay className="hn-scrim" />
            <DialogContent asChild onEscapeKeyDown={guard} onInteractOutside={guard}>
              <Card
                ref={contentRef}
                {...(description ? {} : { 'aria-describedby': undefined })}
                data-hn-side={side}
                padded={false}
                className={cn(drawerCard({ side, size, padded: !body }), className)}
              >
                {(!header || body) && (
                  <>
                    <DialogTitle asChild>
                      <Heading level={2} className="sr-only">
                        {title}
                      </Heading>
                    </DialogTitle>
                    {description && (
                      <DialogDescription className="sr-only">{description}</DialogDescription>
                    )}
                  </>
                )}
                {body ? (
                  renderBody({ close, submitting })
                ) : (
                  <>
                    {header && (
                      <div className="flex shrink-0 items-start justify-between gap-4 px-(--hn-panel-p)">
                        <div className="flex min-w-0 flex-col gap-1.5">
                          <div className="flex min-w-0 items-center gap-2">
                            {hasContent(icon) && (
                              <span
                                className="text-muted flex shrink-0 [&_svg]:size-5"
                                aria-hidden="true"
                              >
                                {icon}
                              </span>
                            )}
                            <DialogTitle asChild>
                              <Heading level={2} size="lg" className="min-w-0">
                                {titleContent ?? title}
                              </Heading>
                            </DialogTitle>
                          </div>
                          {description && (
                            <DialogDescription asChild>
                              <Text tone="muted">{description}</Text>
                            </DialogDescription>
                          )}
                        </div>
                        {closable && (
                          <DialogClose asChild>
                            <CloseButton disabled={locked} className="-mt-1.5 -me-1.5 shrink-0" />
                          </DialogClose>
                        )}
                      </div>
                    )}
                    {renderContent && (
                      <ScrollArea ref={scrollArea} className="min-h-0 grow">
                        <div className="px-(--hn-panel-p) py-1">
                          {renderContent({ close, submitting })}
                        </div>
                      </ScrollArea>
                    )}
                    {renderFooter && (
                      <div className="flex shrink-0 justify-end gap-(--hn-inline-gap) px-(--hn-panel-p)">
                        {renderFooter({ close, submitting })}
                      </div>
                    )}
                  </>
                )}
              </Card>
            </DialogContent>
          </DialogPortal>
        )}
      </DialogRoot>
    </FormScopeContext>
  )
}
