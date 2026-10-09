'use client'

import { useImperativeHandle, useRef, type CSSProperties, type ReactNode, type Ref } from 'react'
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
import { useDragToDismiss } from './hooks/useDragToDismiss'
import { sheetGrip, sheetHandle, sheetPanel } from './sheet.variants'
import { useControllableState } from '../../primitives/utils/controllable-state'

export interface SheetSlotProps {
  close: () => void
  submitting: boolean
}

export interface SheetHandle {
  readonly viewport: HTMLElement | undefined
}

export interface SheetProps {
  title: string
  titleContent?: ReactNode
  description?: string
  header?: boolean
  closable?: boolean
  handle?: boolean
  locked?: boolean
  className?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children?: ReactNode
  icon?: ReactNode
  renderBody?: (props: SheetSlotProps) => ReactNode
  renderContent?: (props: SheetSlotProps) => ReactNode
  renderFooter?: (props: SheetSlotProps) => ReactNode
  ref?: Ref<SheetHandle>
}

export function Sheet({
  title,
  titleContent,
  description,
  header = true,
  closable = true,
  handle = true,
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
}: SheetProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: 'Sheet',
  })
  const { submitting, scope } = useFormScope()
  const locked = lockedProp || submitting
  const { contentRef, content: panel, present } = useOverlayPortal(open)
  const { scrollArea, viewport, read } = useScrollViewport()
  const panelRef = useRef(panel)
  panelRef.current = panel

  useImperativeHandle(
    ref,
    () => ({
      get viewport() {
        return read()
      },
    }),
    [viewport, read],
  )

  const { dragging, offset, onPointerDown } = useDragToDismiss(() => panelRef.current, {
    enabled: !locked,
    open,
    dismiss: () => setOpen(false),
  })

  const style = offset
    ? ({
        transform: `translateY(${offset}px)`,
        '--hn-sheet-from-y': `${offset}px`,
      } as CSSProperties)
    : undefined

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
                data-hn-sheet=""
                data-dragging={dragging ? '' : undefined}
                padded={false}
                style={style}
                className={cn(sheetPanel({ grip: header || handle, padded: !body }), className)}
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
                {(handle || (header && !body)) && (
                  <div
                    data-hn-sheet-grip=""
                    data-dragging={dragging ? '' : undefined}
                    className={sheetGrip({ standalone: body })}
                    onPointerDown={onPointerDown}
                  >
                    {handle && (
                      <div
                        aria-hidden="true"
                        data-disabled={locked ? '' : undefined}
                        className={sheetHandle({ header: header && !body })}
                      />
                    )}
                    {header && !body && (
                      <div className="flex items-start justify-between gap-4 px-(--hn-panel-p)">
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
                        {!handle && closable && (
                          <DialogClose asChild>
                            <CloseButton disabled={locked} className="-mt-1.5 -me-1.5 shrink-0" />
                          </DialogClose>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {body ? (
                  renderBody({ close, submitting })
                ) : (
                  <>
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
