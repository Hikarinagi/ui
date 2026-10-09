'use client'

import { useImperativeHandle, type ReactNode, type Ref } from 'react'
import {
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '../../primitives/dialog'
import { cn } from '../../lib/cn'
import { hasContent } from '../../lib/content'
import { useOverlayPortal } from '../../lib/overlay-portal'
import { useScrollViewport } from '../../lib/scroll-viewport'
import { Card } from '../card/Card'
import { CloseButton } from '../close-button/CloseButton'
import { Heading } from '../heading/Heading'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { Text } from '../text/Text'
import { ModalContent } from './ModalContent'
import { dialogCard, dialogWrapper, type DialogVariants } from './dialog.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface DialogSlotProps {
  close: () => void
}

export interface DialogHandle {
  readonly viewport: HTMLElement | undefined
}

export interface DialogProps {
  title: string
  titleContent?: ReactNode
  description?: string
  size?: DialogVariants['size']
  placement?: 'center' | 'top' | 'bottom'
  header?: boolean
  closable?: boolean
  locked?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  icon?: ReactNode
  renderBody?: (props: DialogSlotProps) => ReactNode
  renderContent?: (props: DialogSlotProps) => ReactNode
  renderFooter?: (props: DialogSlotProps) => ReactNode
  ref?: Ref<DialogHandle>
}

export function Dialog({
  title,
  titleContent,
  description,
  size = 'md',
  placement,
  header = true,
  closable = true,
  locked = false,
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
}: DialogProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Dialog',
  })
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
    <DialogRoot open={open} onOpenChange={setOpen}>
      {hasContent(children) && <DialogTrigger asChild>{children}</DialogTrigger>}
      {present && (
        <DialogPortal>
          <DialogOverlay className="hn-scrim" />
          <div className={dialogWrapper({ placement: placement ?? 'auto' })}>
            <ModalContent asChild onEscapeKeyDown={guard} onInteractOutside={guard}>
              <Card
                ref={contentRef}
                {...(description ? {} : { 'aria-describedby': undefined })}
                padded={false}
                className={cn(
                  dialogCard({
                    placement: placement ?? 'auto',
                    size,
                    padded: !body,
                    fitViewport: true,
                  }),
                  className,
                )}
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
                  renderBody({ close })
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
                      <ScrollArea ref={scrollArea} className="min-h-0">
                        <div className="px-(--hn-panel-p) py-1">{renderContent({ close })}</div>
                      </ScrollArea>
                    )}
                    {renderFooter && (
                      <div className="flex shrink-0 justify-end gap-(--hn-inline-gap) px-(--hn-panel-p)">
                        {renderFooter({ close })}
                      </div>
                    )}
                  </>
                )}
              </Card>
            </ModalContent>
          </div>
        </DialogPortal>
      )}
    </DialogRoot>
  )
}
