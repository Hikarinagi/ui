import { ScrollArea, Stack, Text } from '@hina-ui/react'

const lines = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <ScrollArea className="bg-inset h-40 w-full max-w-sm rounded-md">
      <Stack className="p-4">
        {lines.map(i => (
          <Text key={i}>Line {i}</Text>
        ))}
      </Stack>
    </ScrollArea>
  )
}
