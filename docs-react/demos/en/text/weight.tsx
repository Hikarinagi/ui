import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg" gap="xs">
      <Text weight="normal">Regular weight, the body default</Text>
      <Text weight="medium">Medium weight, for headers and labels</Text>
      <Text weight="semibold">Semibold weight, for emphasis</Text>
    </Stack>
  )
}
