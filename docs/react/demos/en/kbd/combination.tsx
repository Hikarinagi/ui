import { Inline, Kbd, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack>
      <Inline align="center" gap="xs">
        <Kbd>Ctrl</Kbd>
        <Text tone="faint">+</Text>
        <Kbd>Shift</Kbd>
        <Text tone="faint">+</Text>
        <Kbd>P</Kbd>
      </Inline>
      <Inline align="center" gap="xs">
        <Kbd>G</Kbd>
        <Text tone="faint">then</Text>
        <Kbd>H</Kbd>
      </Inline>
    </Stack>
  )
}
