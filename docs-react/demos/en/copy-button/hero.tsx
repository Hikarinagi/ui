import { Code, CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Code>pnpm add @hina-ui/react</Code>
      <CopyButton text="pnpm add @hina-ui/react" />
    </Inline>
  )
}
