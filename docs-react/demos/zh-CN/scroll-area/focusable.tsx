import { ScrollArea, Stack, Text } from '@hina-ui/react'

const lines = Array.from({ length: 10 }, (_, i) => i + 1)

export default function Demo() {
  return (
    <ScrollArea focusable label="更新说明" className="bg-inset h-32 w-full max-w-sm rounded-md">
      <Stack className="p-4">
        {lines.map(i => (
          <Text key={i}>第 {i} 行</Text>
        ))}
      </Stack>
    </ScrollArea>
  )
}
