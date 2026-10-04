import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline as="ul" gap="xs">
      <Tag as="li">Sci-fi</Tag>
      <Tag as="li">Mystery</Tag>
      <Tag as="li">School</Tag>
    </Inline>
  )
}
