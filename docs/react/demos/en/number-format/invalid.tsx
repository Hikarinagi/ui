import { NumberFormat, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        Value is null: <NumberFormat value={null} />
      </Text>
      <Text>
        Value is NaN: <NumberFormat value={Number.NaN} />
      </Text>
    </Stack>
  )
}
