'use client'

import { Button, Dialog, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => (
        <Dialog
          key={size}
          size={size}
          title={`Size ${size}`}
          renderContent={() => (
            <Text>The width follows size, while the height never runs past the viewport.</Text>
          )}
        >
          <Button variant="outline" tone="neutral">
            {size}
          </Button>
        </Dialog>
      ))}
    </Inline>
  )
}
