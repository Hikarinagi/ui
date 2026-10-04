import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton size="sm" text="Small" />
      <CopyButton size="md" text="Medium" />
      <CopyButton size="lg" text="Large" />
    </Inline>
  )
}
