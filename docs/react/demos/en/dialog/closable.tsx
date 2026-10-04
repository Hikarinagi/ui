'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Hidden close button"
      closable={false}
      renderContent={() => (
        <Text>Press Escape, click the scrim or use the footer button to close.</Text>
      )}
      renderFooter={({ close }) => <Button onClick={close}>Close</Button>}
    >
      <Button variant="outline" tone="neutral">
        Hidden close button
      </Button>
    </Dialog>
  )
}
