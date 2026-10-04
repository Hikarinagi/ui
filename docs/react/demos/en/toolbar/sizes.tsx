import { Copy, Scissors, ClipboardPaste } from 'lucide-react'
import { Toolbar, ToolbarButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="start">
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Stack key={size} align="start" gap="xs">
          <Text size="sm" tone="muted">
            {size}
          </Text>
          <Toolbar size={size} label={size}>
            <ToolbarButton label="Cut">
              <Scissors />
            </ToolbarButton>
            <ToolbarButton label="Copy">
              <Copy />
            </ToolbarButton>
            <ToolbarButton label="Paste">
              <ClipboardPaste />
            </ToolbarButton>
          </Toolbar>
        </Stack>
      ))}
    </Stack>
  )
}
