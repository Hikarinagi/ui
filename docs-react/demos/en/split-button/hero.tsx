'use client'

import { useState } from 'react'
import { Clock, FilePen, Send } from 'lucide-react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('Article ready to publish')

  return (
    <Stack align="center" gap="sm">
      <SplitButton
        label="Article actions"
        menuLabel="More publishing options"
        icon={<Send />}
        onClick={() => setResult('Action: publish now')}
        renderContent={() => (
          <>
            <DropdownMenuItem icon={<FilePen />} onSelect={() => setResult('Action: save draft')}>
              Save draft
            </DropdownMenuItem>
            <DropdownMenuItem icon={<Clock />} onSelect={() => setResult('Action: schedule')}>
              Schedule
            </DropdownMenuItem>
          </>
        )}
      >
        Publish now
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
