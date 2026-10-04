import { Kbd, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="max-w-lg">
      <Text>
        Press <Kbd>Enter</Kbd> to submit and <Kbd>Esc</Kbd> to cancel.
      </Text>
      <Text size="sm">
        An <Kbd>Enter</Kbd> in small text shrinks along with it.
      </Text>
    </Stack>
  )
}
