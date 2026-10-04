<script setup lang="ts">
  import { Inline, Stack, Tag, Text } from '@hina-ui/vue'

  const tags = [
    'Sci-fi',
    'Mystery',
    'School',
    'Coming of age',
    'Healing',
    'Slice of life',
    'Ensemble',
    'Isekai',
  ]
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Stack gap="xs">
      <Text tone="muted" size="sm">
        wrap defaults to true, so items wrap when they run out of room
      </Text>
      <Inline gap="xs">
        <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
      </Inline>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">With wrap false they stay on one line</Text>
      <Inline :wrap="false" gap="xs" class="overflow-hidden">
        <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
      </Inline>
    </Stack>
  </Stack>
</template>
