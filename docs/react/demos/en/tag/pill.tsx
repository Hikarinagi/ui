import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag>Default radius</Tag>
      <Tag pill>Pill</Tag>
      <Tag pill variant="solid" tone="accent">
        Pill
      </Tag>
    </Inline>
  )
}
