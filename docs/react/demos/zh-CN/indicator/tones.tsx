import { Indicator, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="center">
      <Indicator />
      <Indicator tone="accent" />
      <Indicator tone="success" />
      <Indicator tone="warning" />
      <Indicator tone="danger" />
      <Indicator tone="info" />
    </Inline>
  )
}
