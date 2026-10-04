'use client'

import { Button, Dialog, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['sm', 'md', 'lg', 'xl', '2xl'] as const).map(size => (
        <Dialog
          key={size}
          size={size}
          title={`${size} 档`}
          renderContent={() => <Text>面板宽度随 size 变化，高度始终不超出视口。</Text>}
        >
          <Button variant="outline" tone="neutral">
            {size}
          </Button>
        </Dialog>
      ))}
    </Inline>
  )
}
