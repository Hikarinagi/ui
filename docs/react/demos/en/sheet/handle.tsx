'use client'

import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="No handle"
      description="A close button takes its place; the title area can still be dragged."
      handle={false}
      renderContent={() => <Text>Try dragging the title downward.</Text>}
    >
      <Button variant="outline" tone="neutral">
        Open
      </Button>
    </Sheet>
  )
}
