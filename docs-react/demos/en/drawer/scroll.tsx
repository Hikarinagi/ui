'use client'

import { Button, Drawer, Stack, Text } from '@hina-ui/react'

const items = Array.from(
  { length: 30 },
  (_, i) => `Notification ${i + 1}: placeholder text, long enough that the body actually scrolls.`,
)

export default function Demo() {
  return (
    <Drawer
      title="All notifications"
      description="The title and footer stay put while the list scrolls."
      renderContent={() => (
        <Stack gap="sm">
          {items.map(item => (
            <Text key={item}>{item}</Text>
          ))}
        </Stack>
      )}
      renderFooter={({ close }) => (
        <Button variant="soft" tone="neutral" onClick={close}>
          Mark all as read
        </Button>
      )}
    >
      <Button variant="outline" tone="neutral">
        See all
      </Button>
    </Drawer>
  )
}
