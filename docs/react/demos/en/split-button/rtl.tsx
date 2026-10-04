'use client'

import { useState } from 'react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('The menu button follows the writing direction')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        dir="rtl"
        menuLabel="خيارات النشر"
        onClick={() => setResult('Action: publish')}
        renderContent={() => (
          <>
            <DropdownMenuItem onSelect={() => setResult('Action: save draft')}>
              حفظ المسودة
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult('Action: schedule')}>
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
