'use client'

import { Button, CloseButton, Inline, Drawer, ScrollArea, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="Custom layout"
      description="The title and description remain available to assistive technology."
      renderBody={({ close }) => (
        <Stack gap="none" className="min-h-0 flex-1">
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
              {Array.from({ length: 30 }, (_, i) => i + 1).map(index => (
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
        Custom panel
      </Button>
    </Drawer>
  )
}
