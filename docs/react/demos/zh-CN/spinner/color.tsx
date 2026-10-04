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
        环取自当前文字色，跟随所在容器。
      </Text>
    </Stack>
  )
}
