import { CloseButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CloseButton tooltip />
      <CloseButton label="关闭预览" tooltip side="right" />
    </Inline>
  )
}
