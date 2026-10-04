import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline as="ul" gap="xs">
      <Tag as="li">科幻</Tag>
      <Tag as="li">悬疑</Tag>
      <Tag as="li">校园</Tag>
    </Inline>
  )
}
