import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton size="sm" text="小号" />
      <CopyButton size="md" text="中号" />
      <CopyButton size="lg" text="大号" />
    </Inline>
  )
}
