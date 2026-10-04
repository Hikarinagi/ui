import { Indicator, Inline, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="sm" align="center">
      <Indicator tone="success" />
      <Text>Ongoing</Text>
    </Inline>
  )
}
