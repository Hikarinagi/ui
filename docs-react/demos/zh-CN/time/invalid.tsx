import { Stack, Text, Time } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        值为 null： <Time value={null} />
      </Text>
      <Text>
        无法解析： <Time value="昨天下午" />
      </Text>
    </Stack>
  )
}
