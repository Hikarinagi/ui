import { Card, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Card as="article">
        <Text>Use article for content that stands on its own</Text>
      </Card>
      <Card as="section">
        <Text>Use section for a block within the page</Text>
      </Card>
    </Stack>
  )
}
