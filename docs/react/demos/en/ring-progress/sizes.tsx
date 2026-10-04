import { Inline, RingProgress } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="lg" align="center">
      <RingProgress value={60} size="sm" showValue />
      <RingProgress value={60} showValue />
      <RingProgress value={60} size="lg" showValue />
    </Inline>
  )
}
