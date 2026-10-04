import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag tone="neutral">Draft</Tag>
      <Tag tone="accent">Featured</Tag>
      <Tag tone="success">Approved</Tag>
      <Tag tone="warning">In review</Tag>
      <Tag tone="danger">Rejected</Tag>
      <Tag tone="info">All ages</Tag>
    </Inline>
  )
}
