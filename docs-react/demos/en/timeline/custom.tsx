'use client'

import { Check } from 'lucide-react'
import {
  Avatar,
  Card,
  Inline,
  Spinner,
  Stack,
  Tag,
  Text,
  Time,
  Timeline,
  type TimelineItem,
} from '@hina-ui/react'

interface Item extends TimelineItem {
  author: string
  pending: boolean
}

const items: Item[] = [
  {
    id: 'a',
    title: 'Completed',
    description: 'Compose other components in the content and use an avatar as the marker.',
    time: '09:00',
    dateTime: '2026-09-16T09:00:00+08:00',
    author: 'Hina',
    pending: false,
    tone: 'success',
  },
  {
    id: 'b',
    title: 'Updated',
    description: 'Slots retain access to custom fields on the item.',
    time: '09:20',
    dateTime: '2026-09-16T09:20:00+08:00',
    author: 'Hina',
    pending: false,
    tone: 'success',
  },
  {
    id: 'c',
    title: 'In progress',
    description: 'A pending item can use a loading indicator.',
    time: '09:40',
    dateTime: '2026-09-16T09:40:00+08:00',
    author: 'Hina',
    pending: true,
    tone: 'accent',
  },
]

export default function Demo() {
  return (
    <Timeline
      items={items}
      className="max-w-xl"
      renderMarker={({ item, index }) =>
        index === 0 ? (
          <Avatar name={item.author} size="sm" />
        ) : item.pending ? (
          <Spinner size="sm" />
        ) : (
          <Check />
        )
      }
      renderContent={({ item }) => (
        <Card>
          <Stack gap="sm">
            <Inline justify="between">
              <Text weight="medium">{item.title}</Text>
              <Tag tone={item.pending ? 'accent' : 'success'}>
                {item.pending ? 'Pending' : 'Done'}
              </Tag>
            </Inline>
            <Text size="sm" tone="muted">
              {item.description}
            </Text>
            <Inline gap="sm">
              <Text size="xs" tone="muted">
                {item.author}
              </Text>
              <Time value={item.dateTime} format="time" className="text-muted text-xs" />
            </Inline>
          </Stack>
        </Card>
      )}
    />
  )
}
