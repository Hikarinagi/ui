'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Export data"
      description="Choose a format to export the current selection."
      renderContent={() => (
        <Text tone="muted">
          The close button in the corner comes with Dialog; there is no need to add another.
        </Text>
      )}
    >
      <Button variant="outline" tone="neutral">
        Open dialog
      </Button>
    </Dialog>
  )
}
