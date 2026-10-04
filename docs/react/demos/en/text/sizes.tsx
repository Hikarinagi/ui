import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="2xl">2xl thirty pixels</Text>
      <Text size="xl">xl twenty-four pixels</Text>
      <Text size="lg">lg twenty pixels</Text>
      <Text size="md">md eighteen pixels</Text>
      <Text size="base">base sixteen pixels</Text>
      <Text size="sm">sm fourteen pixels</Text>
      <Text size="xs">xs thirteen pixels</Text>
    </Stack>
  )
}
