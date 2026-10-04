'use client'

import { Button, Inline, Sheet, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline>
      {[true, false].map(handle => (
        <Sheet
          key={String(handle)}
          title="Hidden header"
          description="The title and description remain available to assistive technology."
          header={false}
          handle={handle}
          renderContent={() => (
            <Text>Content starts below the handle or at the regular panel padding.</Text>
          )}
          renderFooter={({ close }) => (
            <Button variant="soft" tone="neutral" onClick={close}>
              Close
            </Button>
          )}
        >
          <Button variant="outline" tone="neutral">
            {handle ? 'Keep handle' : 'Hide entire top'}
          </Button>
        </Sheet>
      ))}
    </Inline>
  )
}
