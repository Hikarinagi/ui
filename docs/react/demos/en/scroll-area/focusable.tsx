import { ScrollArea, Stack, Text } from '@hina-ui/react'

const lines = Array.from({ length: 10 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <ScrollArea
      focusable
      label="Release notes"
      className="bg-inset h-32 w-full max-w-sm rounded-md"
    >
      <Stack className="p-4">
        {lines.map(i => (
          <Text key={i}>Line {i}</Text>
        ))}
      </Stack>
    </ScrollArea>
  )
}
