import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton text="ssh://git@example.com/hina.git" label="Copy repository URL" tooltip />
      <CopyButton text="hina-2f9c41" label="Copy order number" tooltip />
    </Inline>
  )
}
