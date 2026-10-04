<script setup lang="ts">
  import { Check } from '@lucide/vue'
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
  } from '@hina-ui/vue'

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
</script>

<template>
  <Timeline :items="items" class="max-w-xl">
    <template #marker="{ item, index }">
      <Avatar v-if="index === 0" :name="item.author" size="sm" />
      <Spinner v-else-if="item.pending" size="sm" />
      <Check v-else />
    </template>
    <template #content="{ item }">
      <Card>
        <Stack gap="sm">
          <Inline justify="between">
            <Text weight="medium">{{ item.title }}</Text>
            <Tag :tone="item.pending ? 'accent' : 'success'">
              {{ item.pending ? 'Pending' : 'Done' }}
            </Tag>
          </Inline>
          <Text size="sm" tone="muted">{{ item.description }}</Text>
          <Inline gap="sm">
            <Text size="xs" tone="muted">{{ item.author }}</Text>
            <Time :value="item.dateTime" format="time" class="text-muted text-xs" />
          </Inline>
        </Stack>
      </Card>
    </template>
  </Timeline>
</template>
