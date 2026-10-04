import { Spoiler, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text>
        Default form: <Spoiler>noise cover</Spoiler>
      </Text>
      <Text>
        Fallback form: <Spoiler forceFallback>tint and blur</Spoiler>
      </Text>
    </Stack>
  )
}
