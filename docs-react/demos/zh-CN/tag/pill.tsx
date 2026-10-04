import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag>默认圆角</Tag>
      <Tag pill>胶囊</Tag>
      <Tag pill variant="solid" tone="accent">
        胶囊
      </Tag>
    </Inline>
  )
}
