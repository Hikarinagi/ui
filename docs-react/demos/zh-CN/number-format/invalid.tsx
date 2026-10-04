import { NumberFormat, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        数值为 null： <NumberFormat value={null} />
      </Text>
      <Text>
        数值为 NaN： <NumberFormat value={Number.NaN} />
      </Text>
    </Stack>
  )
}
