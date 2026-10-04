import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag tone="success">Ongoing</Tag>
      <Tag tone="warning">Unrated</Tag>
      <Tag tone="info">All ages</Tag>
      <Tag tone="accent" variant="solid">
        Featured
      </Tag>
      <Tag variant="outline">Sci-fi</Tag>
    </Inline>
  )
}
