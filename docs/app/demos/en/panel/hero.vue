<script setup lang="ts">
  import { Activity } from '@lucide/vue'
  import { Button, Panel, Stack, Text } from '@hina-ui/vue'

  const events = [
    { who: 'Hoshimi Shion', what: ' bookmarked Inherit the Stars', when: '10 minutes ago' },
    { who: 'Peek', what: ' commented on your review', when: '1 hour ago' },
    { who: 'Glass', what: ' followed you', when: 'yesterday' },
  ]
</script>

<template>
  <Panel
    title="Recent activity"
    description="What happened in the last seven days"
    :count="events.length"
    class="w-96"
  >
    <template #icon><Activity /></template>
    <template #actions>
      <Button size="sm" variant="ghost" tone="neutral">All</Button>
    </template>
    <Stack gap="sm">
      <Text v-for="event in events" :key="event.what" size="sm">
        {{ event.who }}{{ event.what }}
        <Text as="span" tone="muted" size="sm">· {{ event.when }}</Text>
      </Text>
    </Stack>
  </Panel>
</template>
