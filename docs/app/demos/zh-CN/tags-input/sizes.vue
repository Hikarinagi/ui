<script setup lang="ts">
  import { Stack, TagsInput } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput size="sm" :model-value="['小号']" aria-label="小号" />
    <TagsInput size="md" :model-value="['中号']" aria-label="中号" />
    <TagsInput size="lg" :model-value="['大号']" aria-label="大号" />
  </Stack>
</template>
