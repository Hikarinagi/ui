'use client'

import { SlidersHorizontal } from 'lucide-react'
import { Button, Drawer, Input, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Drawer
      title="筛选"
      description="设定之后只显示符合条件的作品。"
      renderContent={() => (
        <Stack gap="sm">
          <Stack gap="xs">
            <Text size="sm">关键词</Text>
            <Input defaultValue="天文台" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">发行年份</Text>
            <Input defaultValue="2024" />
          </Stack>
          <Stack gap="xs">
            <Text size="sm">制作方</Text>
            <Input defaultValue="ANIPLEX.EXE" />
          </Stack>
        </Stack>
      )}
      renderFooter={({ close }) => (
        <>
          <Button variant="soft" tone="neutral" onClick={close}>
            重置
          </Button>
          <Button onClick={close}>应用</Button>
        </>
      )}
    >
      <Button variant="outline" tone="neutral" icon={<SlidersHorizontal />}>
        筛选
      </Button>
    </Drawer>
  )
}
