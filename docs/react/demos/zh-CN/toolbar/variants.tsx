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
            <ToolbarButton label="剪切">
              <Scissors />
            </ToolbarButton>
            <ToolbarButton label="复制">
              <Copy />
            </ToolbarButton>
            <ToolbarButton label="粘贴">
              <ClipboardPaste />
            </ToolbarButton>
          </Toolbar>
        </Stack>
      ))}
    </Stack>
  )
}
