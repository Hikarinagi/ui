'use client'

import { useState } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import {
  Toolbar,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  ToolbarSeparator,
  Stack,
  Text,
} from '@hina-ui/react'

export default function Demo() {
  const [formats, setFormats] = useState(['bold'])
  const [alignment, setAlignment] = useState<string | undefined>('start')

  return (
    <Stack align="start" gap="sm">
      <Toolbar label="Toggle groups" size="sm">
        <ToolbarToggleGroup
          value={formats}
          onValueChange={setFormats}
          type="multiple"
          label="Formatting"
        >
          <ToolbarToggleItem value="bold" label="Bold">
            <Bold />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" label="Italic">
            <Italic />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="underline" label="Underline">
            <Underline />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup value={alignment} onValueChange={setAlignment} label="Alignment">
          <ToolbarToggleItem value="start" label="Align start">
            <AlignLeft />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" label="Center">
            <AlignCenter />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="end" label="Align end">
            <AlignRight />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>
      <Text size="sm" tone="muted">
        Formats: {formats.join(', ') || 'None'} · Alignment: {alignment ?? 'None'}
      </Text>
    </Stack>
  )
}
