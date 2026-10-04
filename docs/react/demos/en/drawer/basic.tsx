'use client'

import { Button, Drawer, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="Notifications"
      description="Messages from the past seven days."
      renderContent={() => (
        <Text>
          The message list goes here. The drawer opens flush against the edge of the screen and
          keeps its square corners.
        </Text>
      )}
    >
      <Button variant="outline" tone="neutral">
        Open notifications
      </Button>
    </Drawer>
  )
}
