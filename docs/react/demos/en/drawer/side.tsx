'use client'

import { Button, Drawer, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Drawer
        title="From the start edge"
        side="start"
        renderContent={() => (
          <Text>The left edge in English, the right edge in a right-to-left language.</Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </Drawer>
      <Drawer
        title="From the end edge"
        side="end"
        renderContent={() => <Text>The default, which is the right edge in English.</Text>}
      >
        <Button variant="outline" tone="neutral">
          end
        </Button>
      </Drawer>
    </Inline>
  )
}
