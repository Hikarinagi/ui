'use client'

import { Button, CloseButton, Sheet, Inline, ScrollArea, Stack, Text } from '@hina-ui/react'

const items = Array.from({ length: 30 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Inline>
      {[true, false].map(handle => (
        <Sheet
          key={String(handle)}
          handle={handle}
          title="Custom layout"
          description="The title and description remain available to assistive technology."
          renderBody={({ close }) => (
            <Stack gap="none" className="h-[min(32rem,70dvh)] min-h-0">
              <Inline
                justify="between"
                wrap={false}
                className="border-line bg-inset shrink-0 gap-3 border-b p-4"
              >
                <Stack gap="xs" className="min-w-0">
                  <Text weight="medium">Custom layout</Text>
                  <Text size="sm" tone="muted">
                    The slot provides the header, scroll area, and footer.
                  </Text>
                </Stack>
                <CloseButton onClick={close} />
              </Inline>
              <ScrollArea className="min-h-0 flex-1">
                <Stack gap="none" className="divide-line divide-y px-4">
                  {items.map(index => (
                    <Text key={index} className="py-3">
                      Item {index}
                    </Text>
                  ))}
                </Stack>
              </ScrollArea>
              <Inline
                justify="between"
                wrap={false}
                className="border-line shrink-0 gap-3 border-t p-4 pb-[max(var(--hn-panel-p),env(safe-area-inset-bottom))]"
              >
                <Text size="sm" tone="muted">
                  The footer stays visible
                </Text>
                <Button size="sm" onClick={close}>
                  Done
                </Button>
              </Inline>
            </Stack>
          )}
        >
          <Button variant="outline" tone="neutral">
            {handle ? 'With handle' : 'Without handle'}
          </Button>
        </Sheet>
      ))}
    </Inline>
  )
}
