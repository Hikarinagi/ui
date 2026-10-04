'use client'

import { Button, Dialog, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Dialog
      title="Publish this article"
      description="Everyone can see it once it is published."
      renderContent={() => (
        <Text>The article appears on your homepage and in the timelines of your subscribers.</Text>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            Not yet
          </Button>
          <Button onClick={close}>Publish</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Publish
      </Button>
    </Dialog>
  )
}
