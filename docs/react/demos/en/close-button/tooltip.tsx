import { CloseButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CloseButton tooltip />
      <CloseButton label="Close preview" tooltip side="right" />
    </Inline>
  )
}
