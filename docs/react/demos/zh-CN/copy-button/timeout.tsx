import { CopyButton, Inline } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <CopyButton text="默认两秒" />
      <CopyButton text="五秒后复位" timeout={5000} />
    </Inline>
  )
}
