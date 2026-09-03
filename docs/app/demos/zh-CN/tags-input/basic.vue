<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TagsInput, Text } from '@hina-ui/vue'

  const tags = ref<string[]>([])
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput v-model="tags" placeholder="输入后按 Enter" aria-label="关键词" />
    <Text tone="muted" size="sm">{{ tags.length ? tags.join('、') : '还没有标签' }}</Text>
  </Stack>
</template>
