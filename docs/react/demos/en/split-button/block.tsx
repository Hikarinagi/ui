'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'
import { DropdownMenuItem, SplitButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [result, setResult] = useState('The primary action grows; the menu button stays square')

  return (
    <Stack className="w-full max-w-xs" gap="sm">
      <SplitButton
        block
        menuLabel="More report actions"
        icon={<Download />}
        onClick={() => setResult('Action: export the full report')}
        renderContent={() => (
          <>
            <DropdownMenuItem onSelect={() => setResult('Action: export selection')}>
              Export selection
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResult('Action: copy report link')}>
              Copy report link
            </DropdownMenuItem>
          </>
        )}
      >
        Export the complete monthly activity report for all projects
      </SplitButton>
      <Text role="status" size="sm" tone="muted">
        {result}
      </Text>
    </Stack>
  )
}
