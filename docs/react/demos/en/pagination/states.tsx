import { Pagination, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          Disabled
        </Text>
        <Pagination value={3} total={50} disabled />
      </Stack>
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          total=&quot;0&quot;
        </Text>
        <Pagination total={0} showFirstLast />
      </Stack>
    </Stack>
  )
}
