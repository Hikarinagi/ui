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
    title: '已完成',
    description: '内容区域可组合其他组件，节点可以换成头像。',
    time: '09:00',
    dateTime: '2026-09-16T09:00:00+08:00',
    author: 'Hina',
    pending: false,
    tone: 'success',
  },
  {
    id: 'b',
    title: '已补充',
    description: '通过插槽读取条目上的自定义字段。',
    time: '09:20',
    dateTime: '2026-09-16T09:20:00+08:00',
    author: 'Hina',
    pending: false,
    tone: 'success',
  },
  {
    id: 'c',
    title: '进行中',
    description: '等待中的节点可以使用加载指示。',
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
                {item.pending ? '进行中' : '完成'}
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
