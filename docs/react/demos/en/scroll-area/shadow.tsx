import { ScrollArea, Stack, Text } from '@hina-ui/react'

const lines = Array.from({ length: 10 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          With edge shadows
        </Text>
        <ScrollArea className="bg-inset h-32 rounded-md">
          <Stack className="p-4">
            {lines.map(i => (
              <Text key={i}>Line {i}</Text>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
      <Stack gap="xs">
        <Text tone="muted" size="sm">
          Without them
        </Text>
        <ScrollArea shadow={false} className="bg-inset h-32 rounded-md">
          <Stack className="p-4">
            {lines.map(i => (
              <Text key={i}>Line {i}</Text>
            ))}
          </Stack>
        </ScrollArea>
      </Stack>
    </Stack>
  )
}
