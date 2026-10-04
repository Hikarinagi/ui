import { Inline, Spinner, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm">
      <Inline gap="md" align="center">
        <Spinner />
        <Spinner className="text-accent" />
        <Spinner className="text-muted" />
      </Inline>
      <Text size="sm" tone="faint">
        The ring takes the current text colour from its container.
      </Text>
    </Stack>
  )
}
