<script setup lang="ts">
  import { Activity } from '@lucide/vue'
  import { Button, Panel, Stack, Text } from '@hina-ui/vue'

  const events = [
    { who: '星见书音', what: '收藏了《星之继承者》', when: '10 分钟前' },
    { who: '偷瞄', what: '评论了你的书评', when: '1 小时前' },
    { who: '玻璃', what: '关注了你', when: '昨天' },
  ]
</script>

<template>
  <Panel title="最近活动" description="过去七天的动态" :count="events.length" class="w-96">
    <template #icon><Activity /></template>
    <template #actions>
      <Button size="sm" variant="ghost" tone="neutral">全部</Button>
    </template>
    <Stack gap="sm">
      <Text v-for="event in events" :key="event.what" size="sm">
        {{ event.who }}{{ event.what }}
        <Text as="span" tone="muted" size="sm">· {{ event.when }}</Text>
      </Text>
    </Stack>
  </Panel>
</template>
