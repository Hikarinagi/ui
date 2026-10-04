import { Indicator, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="center">
      <Indicator tone="accent" size="sm" />
      <Indicator tone="accent" />
      <Indicator tone="accent" size="lg" />
    </Inline>
  )
}
