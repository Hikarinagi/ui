'use client'

import { useState } from 'react'
import { Button, Inline, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  const [open, setOpen] = useState(false)

  return (
    <Inline gap="sm">
      <Button variant="outline" tone="neutral" onClick={() => setOpen(true)}>
        Open from outside
      </Button>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title="Saved"
        description="This article is now in your collection."
        renderContent={() => <Text>A sheet without a trigger, opened by the button outside.</Text>}
        renderFooter={({ close }) => <Button onClick={close}>Got it</Button>}
      />
    </Inline>
  )
}
