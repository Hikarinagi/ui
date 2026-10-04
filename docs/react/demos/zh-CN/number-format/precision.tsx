import { NumberFormat, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        默认： <NumberFormat value={3.14159} />
      </Text>
      <Text>
        precision 为 2： <NumberFormat value={3.14159} precision={2} />
      </Text>
      <Text>
        precision 为 0： <NumberFormat value={3.14159} precision={0} />
      </Text>
    </Stack>
  )
}
