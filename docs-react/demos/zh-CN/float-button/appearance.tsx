'use client'

import { useState } from 'react'
import { HelpCircle, Pencil, Plus } from 'lucide-react'
import { FloatButton, Flex, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('悬停或键盘聚焦可以查看操作名称')

  return (
    <Stack align="center" gap="lg">
      <Flex wrap justify="center" gap="lg">
        <FloatButton
          position="static"
          label="新建项目"
          onClick={() => setResult('已选择：新建项目')}
        >
          <Plus />
        </FloatButton>
        <FloatButton
          position="static"
          label="编辑项目"
          variant="soft"
          shape="square"
          onClick={() => setResult('已选择：编辑项目')}
        >
          <Pencil />
        </FloatButton>
        <FloatButton
          position="static"
          label="帮助中心"
          variant="outline"
          tone="neutral"
          onClick={() => setResult('已选择：帮助中心')}
        >
          <HelpCircle />
        </FloatButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
