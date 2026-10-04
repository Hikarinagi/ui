'use client'

import { useState } from 'react'
import { Copy, Download, RotateCcw } from 'lucide-react'
import { Toolbar, ToolbarButton, ToolbarLink, ToolbarSeparator, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  const [action, setAction] = useState('No action yet')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="Actions" size="sm">
        <ToolbarButton onClick={() => setAction('Copy')} icon={<Copy />}>
          Copy
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction('Download')} icon={<Download />}>
          Download
        </ToolbarButton>
        <ToolbarButton onClick={() => setAction('Reset')} icon={<RotateCcw />}>
          Reset
        </ToolbarButton>
        <ToolbarSeparator />
        <ToolbarLink href="#api">API</ToolbarLink>
      </Toolbar>
      <Text size="sm" tone="muted" aria-live="polite">
        {action}
      </Text>
    </Stack>
  )
}
