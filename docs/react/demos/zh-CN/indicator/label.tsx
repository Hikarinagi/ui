import { Indicator, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Indicator tone="success" label="在线" />
      <Text>星见书音</Text>
    </Inline>
  )
}
