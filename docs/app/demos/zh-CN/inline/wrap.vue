<script setup lang="ts">
  import { Inline, Stack, Tag, Text } from '@hikarinagi/ui'

  const tags = ['科幻', '悬疑', '校园', '青春', '治愈', '日常', '成长', '群像', '异世界']
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Stack gap="xs">
      <Text tone="muted" size="sm">wrap 默认为真，放不下时换行</Text>
      <Inline gap="xs">
        <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
      </Inline>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">wrap 为假时保持在一行</Text>
      <Inline :wrap="false" gap="xs" class="overflow-hidden">
        <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
      </Inline>
    </Stack>
  </Stack>
</template>
