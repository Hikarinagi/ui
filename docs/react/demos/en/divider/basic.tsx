import { Divider, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm">
      <Text>What comes before</Text>
      <Divider />
      <Text>What comes after</Text>
    </Stack>
  )
}
