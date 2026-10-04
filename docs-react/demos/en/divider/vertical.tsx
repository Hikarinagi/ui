import { Divider, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline className="h-8">
      <Text tone="muted" size="sm">
        128 books
      </Text>
      <Divider orientation="vertical" />
      <Text tone="muted" size="sm">
        32 translators
      </Text>
      <Divider orientation="vertical" />
      <Text tone="muted" size="sm">
        Updated three hours ago
      </Text>
    </Inline>
  )
}
