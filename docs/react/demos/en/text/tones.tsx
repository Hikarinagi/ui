import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg" gap="xs">
      <Text tone="default">default, body text</Text>
      <Text tone="muted">muted, secondary notes</Text>
      <Text tone="faint">faint, the lightest annotation</Text>
      <Text tone="disabled">disabled, unavailable</Text>
      <Text tone="accent">accent, emphasis</Text>
      <Text tone="success">success</Text>
      <Text tone="warning">warning, needs attention</Text>
      <Text tone="danger">danger, an error</Text>
      <Text tone="info">info, supplementary</Text>
    </Stack>
  )
}
