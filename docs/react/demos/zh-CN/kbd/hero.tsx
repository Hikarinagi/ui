import { Inline, Kbd, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Text>打开命令面板</Text>
      <Inline align="center" gap="xs">
        <Kbd>Ctrl</Kbd>
        <Text tone="faint">+</Text>
        <Kbd>K</Kbd>
      </Inline>
    </Inline>
  )
}
