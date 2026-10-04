'use client'

import { FileText, ListChecks, Send } from 'lucide-react'
import { Stepper, Tag, Inline, Text, type StepperItem } from '@hina-ui/react'

interface Item extends StepperItem {
  note: string
}
const icons = [FileText, ListChecks, Send]
const items: Item[] = [
  { title: 'Step A', note: 'Required' },
  { title: 'Step B', note: 'Optional' },
  { title: 'Step C', note: 'Confirm' },
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
