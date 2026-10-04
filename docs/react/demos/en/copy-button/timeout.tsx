import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton text="Two seconds by default" />
      <CopyButton text="Resets after five seconds" timeout={5000} />
    </Inline>
  )
}
