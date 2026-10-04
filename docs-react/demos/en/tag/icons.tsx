import { Check, CircleAlert, Clock } from 'lucide-react'
import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag tone="success">
        <Check />
        Approved
      </Tag>
      <Tag tone="warning">
        <Clock />
        In review
      </Tag>
      <Tag tone="danger" variant="outline">
        <CircleAlert />
        Rejected
      </Tag>
    </Inline>
  )
}
