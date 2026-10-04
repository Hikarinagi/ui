import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text>Renders a p element by default.</Text>
      <Text as="span" tone="muted">
        Setting as to span keeps it inline.
      </Text>
      <Text as="div" size="sm">
        It can also be a div.
      </Text>
    </Stack>
  )
}
