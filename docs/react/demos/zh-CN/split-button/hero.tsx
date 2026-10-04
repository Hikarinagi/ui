'use client'

import { useState } from 'react'
import { Clock, FilePen, Send } from 'lucide-react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('文章准备就绪')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        label="文章操作"
        menuLabel="其他发布方式"
        icon={<Send />}
        onClick={() => setResult('已执行：立即发布')}
        renderContent={() => (
          <>
            <DropdownMenuItem icon={<FilePen />} onSelect={() => setResult('已执行：保存草稿')}>
              保存草稿
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Clock />} onSelect={() => setResult('已执行：定时发布')}>
              定时发布
            </DropdownMenuItem>
          </>
        )}
      >
        立即发布
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
