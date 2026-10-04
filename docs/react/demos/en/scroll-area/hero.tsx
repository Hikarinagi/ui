import { Card, ScrollArea, Stack, Text } from '@hina-ui/react'

const chapters = Array.from({ length: 24 }, (_, i) => `Chapter ${i + 1}`)

export default function Demo() {
  return (
    <Card className="w-full max-w-xs" padded={false}>
      <ScrollArea className="h-64">
        <Stack gap="none" className="p-2">
          {chapters.map(chapter => (
            <Text key={chapter} size="sm" className="px-3 py-2">
              {chapter}
            </Text>
          ))}
        </Stack>
      </ScrollArea>
    </Card>
  )
}
