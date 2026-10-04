import { Spoiler, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text>
        默认形态： <Spoiler>噪点遮罩</Spoiler>
      </Text>
      <Text>
        降级形态： <Spoiler forceFallback>底色加模糊</Spoiler>
      </Text>
    </Stack>
  )
}
