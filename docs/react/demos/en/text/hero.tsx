import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="md">A lead paragraph uses md, a little larger than body text.</Text>
      <Text>Body text uses base, which covers nine tenths of the words in an interface.</Text>
      <Text size="sm" tone="muted">
        Supporting notes use sm and a secondary tone.
      </Text>
    </Stack>
  )
}
