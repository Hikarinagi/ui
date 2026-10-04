'use client'

import { Settings } from 'lucide-react'
import { Button, Inline, Drawer, Tag, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="面板标题"
      icon={<Settings />}
      titleContent={
        <Inline as="span" wrap={false} className="inline-flex gap-2">
          自定义标题
          <Tag size="sm" tone="neutral">
            可选
          </Tag>
        </Inline>
      }
      renderContent={() => <Text>图标独立显示，标题插槽可以组合文字和标签。</Text>}
    >
      <Button variant="outline" tone="neutral">
        标题插槽
      </Button>
    </Drawer>
  )
}
