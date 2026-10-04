'use client'

import { Button, Drawer, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Drawer
          key={size}
          size={size}
          title={`${size} 档`}
          renderContent={() => <Text>抽屉的宽度随 size 变化，高度始终占满屏幕。</Text>}
        >
          <Button variant="outline" tone="neutral">
            {size}
          </Button>
        </Drawer>
      ))}
    </Inline>
  )
}
