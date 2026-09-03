<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, TagsInput, Text } from '@hina-ui/vue'

  const tags = ref<string[]>([])
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput v-model="tags" placeholder="Type and press Enter" aria-label="Keywords" />
    <Text tone="muted" size="sm">{{ tags.length ? tags.join(', ') : 'No tags yet' }}</Text>
  </Stack>
</template>
