'use client'

import { FileText, ListChecks, Send } from 'lucide-react'
import { Stepper, Tag, Inline, Text, type StepperItem } from '@hina-ui/react'

interface Item extends StepperItem {
  note: string
}
const icons = [FileText, ListChecks, Send]
const items: Item[] = [
  { title: '步骤 A', note: '必填' },
  { title: '步骤 B', note: '可选' },
  { title: '步骤 C', note: '确认' },
]

export default function Demo() {
  return (
    <Stepper
      items={items}
      linear={false}
      renderIndicator={({ index }) => {
        const Icon = icons[index]!
        return <Icon />
      }}
      renderTitle={({ item, active }) => (
        <Inline as="span" justify="center" gap="sm">
          <Text as="span" weight="medium">
            {item.title}
          </Text>
          <Tag tone={active ? 'accent' : 'neutral'}>{item.note}</Tag>
        </Inline>
      )}
    />
  )
}
