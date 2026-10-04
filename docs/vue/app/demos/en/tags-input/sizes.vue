<script setup lang="ts">
  import { Stack, TagsInput } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput size="sm" :model-value="['Small']" aria-label="Small" />
    <TagsInput size="md" :model-value="['Medium']" aria-label="Medium" />
    <TagsInput size="lg" :model-value="['Large']" aria-label="Large" />
  </Stack>
</template>
