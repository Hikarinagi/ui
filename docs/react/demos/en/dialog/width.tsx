'use client'

import { Button, Dialog, Inline, Text } from '@hina-ui/react'

const widths = [
  { label: '40rem', class: 'max-w-[40rem]' },
  { label: '52rem', class: 'max-w-[52rem]' },
]

export default function Demo() {
  return (
    <Inline>
      {widths.map(width => (
        <Dialog
          key={width.label}
          title={width.label}
          className={width.class}
          renderContent={() => (
            <Text>
              The class sets the maximum width; narrow screens remain constrained by the viewport.
            </Text>
          )}
        >
          <Button variant="outline" tone="neutral">
            {width.label}
          </Button>
        </Dialog>
      ))}
    </Inline>
  )
}
