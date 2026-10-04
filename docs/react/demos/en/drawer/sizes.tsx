'use client'

import { Button, Drawer, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Drawer
          key={size}
          size={size}
          title={`Size ${size}`}
          renderContent={() => (
            <Text>The width follows size, while the height always fills the screen.</Text>
          )}
        >
          <Button variant="outline" tone="neutral">
            {size}
          </Button>
        </Drawer>
      ))}
    </Inline>
  )
}
