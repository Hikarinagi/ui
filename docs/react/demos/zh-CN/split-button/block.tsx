'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('主操作伸展，菜单按钮保持方形')

  return (
    <Stack className="w-full max-w-xs" gap="sm">
      <SplitButton
        block
        menuLabel="报表的其他操作"
        icon={<Download />}
        onClick={() => setResult('已执行：导出完整报表')}
        renderContent={() => (
          <>
            <DropdownMenuItem onSelect={() => setResult('已执行：仅导出选中项')}>
              仅导出选中项
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult('已执行：复制报表链接')}>
              复制报表链接
            </DropdownMenuItem>
          </>
        )}
      >
        导出本月所有项目的完整运行报表
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
