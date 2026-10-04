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
          renderContent={() => <Text>通过 class 设置最大宽度，窄屏仍受视口限制。</Text>}
        >
          <Button variant="outline" tone="neutral">
            {width.label}
          </Button>
        </Dialog>
      ))}
    </Inline>
  )
}
