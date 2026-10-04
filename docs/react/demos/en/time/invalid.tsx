import { Stack, Text, Time } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-sm">
      <Text>
        Value is null: <Time value={null} />
      </Text>
      <Text>
        Cannot be parsed: <Time value="yesterday afternoon" />
      </Text>
    </Stack>
  )
}
