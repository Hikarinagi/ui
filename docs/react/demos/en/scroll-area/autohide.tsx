import { ScrollArea, Stack, Text } from '@hina-ui/react'

const modes = ['never', 'scroll', 'leave', 'move'] as const
const lines = Array.from({ length: 8 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      {modes.map(mode => (
        <Stack key={mode} gap="xs">
          <Text tone="muted" size="sm">
            {mode}
          </Text>
          <ScrollArea autoHide={mode} className="bg-inset h-24 rounded-md">
            <Stack className="p-4">
              {lines.map(i => (
                <Text key={i}>Line {i}</Text>
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      ))}
    </Stack>
  )
}
