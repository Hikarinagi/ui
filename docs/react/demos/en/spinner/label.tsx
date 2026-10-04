import { Inline, Spinner, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Spinner size="sm" label="Submitting your rating" />
      <Text size="sm" tone="muted">
        Submitting your rating…
      </Text>
    </Inline>
  )
}
