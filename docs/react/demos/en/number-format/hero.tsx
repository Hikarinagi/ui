import { NumberFormat, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        <NumberFormat value={128456} format="compact" /> bookmarks, rated{' '}
        <NumberFormat value={0.964} format="percent" precision={1} /> positive
      </Text>
      <Text tone="muted">
        Priced at <NumberFormat value={1280} format="currency" currency="CNY" />
      </Text>
    </Stack>
  )
}
