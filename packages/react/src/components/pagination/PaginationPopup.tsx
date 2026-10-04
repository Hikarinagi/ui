'use client'

import { useCallback } from 'react'
import { PopoverPortal, PopoverRoot } from '../../primitives/popover'
import { PopoverContent } from '../popover/PopoverContent'
import { Card } from '../card/Card'
import { Button } from '../button/Button'
import { ScrollArea } from '../scroll-area/ScrollArea'
import { useOverlayPortal } from '../../lib/overlay-portal'
import { useUiLocale } from '../../locale'
import { usePaginationContext } from './context'
import { usePaginationWindow } from './hooks/usePaginationWindow'
import type { PaginationEllipsisController } from './hooks/usePaginationEllipsis'

export interface PaginationPopupProps {
  controller: PaginationEllipsisController
}

export function PaginationPopup({ controller }: PaginationPopupProps) {
  const { open, reference, id, setPanel } = controller
  const { size, blocked, direction } = usePaginationContext()
  const { contentRef, present } = useOverlayPortal(open)
  const { scroll, setRowsHost, activePage, setActivePage, extent, rows, keydown } =
    usePaginationWindow(controller, present)
  const t = useUiLocale()
  const panel = useCallback(
    (element: HTMLElement | null) => {
      contentRef(element)
      setPanel(element)
    },
    [contentRef, setPanel],
  )

  return (
    <PopoverRoot
      open={open}
      modal={false}
      onOpenChange={value => {
        if (!value) controller.close()
      }}
    >
      {present && (
        <PopoverPortal>
          <PopoverContent
            id={id}
            reference={reference}
            sideOffset={8}
            align="center"
            aria-label={t.pagination.choosePage}
            asChild
            onOpenAutoFocus={event => event.preventDefault()}
            onCloseAutoFocus={controller.closeAutoFocus}
            onInteractOutside={controller.outside}
            onEscapeKeyDown={event => {
              event.preventDefault()
              controller.close(true)
            }}
          >
            <Card
              ref={panel}
              padded={false}
              dir={direction}
              inert={!open || blocked || undefined}
              data-hn-pagination-popup=""
              className="hn-anim-pop z-(--hn-z-overlay) w-24 p-1 shadow-md outline-none"
              onKeyDown={keydown}
              onKeyDownCapture={event => {
                if (event.key === 'Tab') controller.tab(event)
              }}
            >
              <ScrollArea ref={scroll} className="max-h-56">
                <div ref={setRowsHost} className="relative gap-1" style={{ height: extent + 'px' }}>
                  {rows.map(row => (
                    <div
                      key={row.page}
                      className="absolute inset-x-0"
                      style={{ top: row.top + 'px' }}
                    >
                      <Button
                        data-hn-pagination-choice={String(row.page)}
                        variant="ghost"
                        tone="neutral"
                        size={size}
                        disabled={blocked}
                        tabIndex={activePage === row.page ? 0 : -1}
                        aria-label={t.pagination.pageLabel(row.page)}
                        className="w-full tabular-nums"
                        onFocus={() => setActivePage(row.page)}
                        onClick={() => controller.pick(row.page)}
                      >
                        {row.page}
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </PopoverContent>
        </PopoverPortal>
      )}
    </PopoverRoot>
  )
}
