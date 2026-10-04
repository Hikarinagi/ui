import { Divider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Text tone="muted" size="sm">
        A separator by default, announced by screen readers
      </Text>
      <Divider />
      <Text tone="muted" size="sm">
        With decorative it is only a line, out of the accessibility tree
      </Text>
      <Divider decorative />
    </Stack>
  )
}
