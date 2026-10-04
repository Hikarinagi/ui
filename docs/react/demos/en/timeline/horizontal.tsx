'use client'

import { useState } from 'react'
import { Timeline, Select, Stack, ScrollArea, type TimelineAlign } from '@hina-ui/react'

const options = [
  { value: 'start', label: 'start' },
  { value: 'end', label: 'end' },
  { value: 'alternate', label: 'alternate' },
]
const items = [
  {
    id: 'a',
    title: 'Item A',
    description: 'A description for the first item.',
    time: '09:00',
    dateTime: '2026-09-16T09:00:00+08:00',
  },
  {
    id: 'b',
    title: 'Item B',
    description:
      'This longer description wraps onto multiple lines. The connector extends with the content, keeping the next event below it.',
    time: '09:20',
    dateTime: '2026-09-16T09:20:00+08:00',
  },
  {
    id: 'c',
    title: 'Item C',
    description: 'The connector ends at the last item.',
    time: '09:40',
    dateTime: '2026-09-16T09:40:00+08:00',
  },
]

export default function Demo() {
  const [align, setAlign] = useState<TimelineAlign>('start')

  return (
    <Stack className="w-full" gap="lg">
      <Select
        value={align}
        onValueChange={value => setAlign(value as TimelineAlign)}
        options={options}
        aria-label="Alignment"
        className="w-40"
      />
      <ScrollArea direction="horizontal" shadow={false} className="w-full">
        <Timeline items={items} orientation="horizontal" align={align} className="min-w-lg" />
      </ScrollArea>
    </Stack>
  )
}
