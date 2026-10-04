import { Check, CircleAlert, Clock } from 'lucide-react'
import { Inline, Tag } from '@hina-ui/react'

export default function Demo() {
  return (
    <Inline align="center">
      <Tag tone="success">
        <Check />
        已通过
      </Tag>
      <Tag tone="warning">
        <Clock />
        待复核
      </Tag>
      <Tag tone="danger" variant="outline">
        <CircleAlert />
        已驳回
      </Tag>
    </Inline>
  )
}
