'use client'

import { Button, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Sheet
      title="Filters"
      description="Only affects the current list."
      renderContent={() => (
        <Text>Put the filter controls here. Drag the handle at the top downward to close.</Text>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            Reset
          </Button>
          <Button onClick={close}>Apply</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral">
        Open filters
      </Button>
    </Sheet>
  )
}
