'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import {
  Card,
  Listbox,
  Tag,
  Text,
  type ListboxValue,
  type SelectItems,
  type SelectOption,
} from '@hina-ui/react'

const options: SelectItems<SelectOption<{ count: number | null }>> = [
  { count: 128, value: 'a', label: 'Option A' },
  {
    label: 'Group',
    options: [
      { count: 2048, value: 'b', label: 'Option B' },
      { count: null, value: 'c', label: 'Option C' },
    ],
  },
]

export default function Demo() {
  const [value, setValue] = useState<ListboxValue>('a')

  return (
    <Card padded={false} className="w-64">
      <Listbox
        value={value}
        onValueChange={setValue}
        options={options}
        variant="bare"
        padded={false}
        aria-label="Custom trailing content"
        renderOption={({ option, selected }) => (
          <Text as="span" weight={selected ? 'medium' : 'normal'} truncate>
            {option.label}
          </Text>
        )}
        renderTrailing={({ option, selected }) =>
          option.count != null && (
            <Text
              as="span"
              size="xs"
              tone="muted"
              className="flex min-w-4 shrink-0 items-center justify-end"
            >
              {selected ? <Check aria-hidden="true" /> : <Tag tone="accent">{option.count}</Tag>}
            </Text>
          )
        }
      />
    </Card>
  )
}
