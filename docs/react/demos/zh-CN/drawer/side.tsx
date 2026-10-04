'use client'

import { Button, Drawer, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center" className="gap-6">
      <Drawer
        title="从起始边展开"
        side="start"
        renderContent={() => (
          <Text>中文与英文环境下贴左缘，阿拉伯语等从右到左的语言下贴右缘。</Text>
        )}
      >
        <Button variant="outline" tone="neutral">
          start
        </Button>
      </Drawer>
      <Drawer
        title="从结束边展开"
        side="end"
        renderContent={() => <Text>默认值，中文与英文环境下贴右缘。</Text>}
      >
        <Button variant="outline" tone="neutral">
          end
        </Button>
      </Drawer>
    </Inline>
  )
}
