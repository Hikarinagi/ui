import { Inline, RingProgress } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="xl" align="start">
      <RingProgress value={58} showValue label="Read" />
      <RingProgress value={91} showValue label="Bookmarked" tone="info" />
    </Inline>
  )
}
