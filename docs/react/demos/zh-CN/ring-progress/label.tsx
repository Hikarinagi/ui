import { Inline, RingProgress } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline gap="xl" align="start">
      <RingProgress value={58} showValue label="已读" />
      <RingProgress value={91} showValue label="已收藏" tone="info" />
    </Inline>
  )
}
