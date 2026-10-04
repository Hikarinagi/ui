'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { FloatButton, Flex, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('文字按钮使用同一高度，宽度随名称展开')

  return (
    <Stack align="center" gap="lg">
      <Flex wrap align="center" justify="center" gap="lg">
        {(['sm', 'md', 'lg'] as const).map(size => (
          <FloatButton
            key={size}
            position="static"
            size={size}
            label={`新建项目（${size}）`}
            onClick={() => setResult(`已选择：${size}`)}
          >
            <Plus />
          </FloatButton>
        ))}
        <FloatButton
          position="static"
          extended
          label="新建项目"
          onClick={() => setResult('已选择：新建项目')}
        >
          <Plus />
        </FloatButton>
      </Flex>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
