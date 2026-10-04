import { Inline, RingProgress } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="center">
      <RingProgress value={40} />
      <RingProgress value={40} showValue />
    </Inline>
  )
}
