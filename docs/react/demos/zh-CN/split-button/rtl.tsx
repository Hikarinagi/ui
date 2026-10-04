'use client'

import { useState } from 'react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('菜单按钮随书写方向排列')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        dir="rtl"
        menuLabel="خيارات النشر"
        onClick={() => setResult('已执行：发布')}
        renderContent={() => (
          <>
            <DropdownMenuItem onSelect={() => setResult('已执行：保存草稿')}>
              حفظ المسودة
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult('已执行：定时发布')}>
              جدولة النشر
            </DropdownMenuItem>
          </>
        )}
      >
        نشر المقال
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
