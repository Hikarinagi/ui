import { Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text size="2xl">2xl 三十像素</Text>
      <Text size="xl">xl 二十四像素</Text>
      <Text size="lg">lg 二十像素</Text>
      <Text size="md">md 十八像素</Text>
      <Text size="base">base 十六像素</Text>
      <Text size="sm">sm 十四像素</Text>
      <Text size="xs">xs 十三像素</Text>
    </Stack>
  )
}
