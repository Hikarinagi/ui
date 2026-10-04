'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Hidden header"
      header={false}
      renderContent={() => (
        <Text>The title remains the accessible name; content and footer stay visible.</Text>
      )}
      renderFooter={({ close }) => <Button onClick={close}>Close</Button>}
    >
      <Button variant="outline" tone="neutral">
        Hidden header
      </Button>
    </Dialog>
  )
}
