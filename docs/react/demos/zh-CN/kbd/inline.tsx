import { Kbd, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text>
        按 <Kbd>Enter</Kbd> 提交，按 <Kbd>Esc</Kbd> 取消。
      </Text>
      <Text size="sm">
        小字号中的 <Kbd>Enter</Kbd> 会一同缩小。
      </Text>
    </Stack>
  )
}
