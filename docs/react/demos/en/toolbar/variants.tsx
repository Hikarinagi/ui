import { Copy, Scissors, ClipboardPaste } from 'lucide-react'
import { Toolbar, ToolbarButton, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack align="start">
      {(['primary', 'secondary', 'bare'] as const).map(variant => (
        <Stack key={variant} align="start" gap="xs">
          <Text size="sm" tone="muted">
            {variant}
          </Text>
          <Toolbar variant={variant} label={variant} size="sm">
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
