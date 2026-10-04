<script setup lang="ts">
  import { Stack, TagsInput } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput :model-value="['Invalid']" invalid aria-label="Invalid" />
    <TagsInput :model-value="['Disabled']" disabled aria-label="Disabled" />
    <TagsInput :model-value="['Secondary']" variant="secondary" aria-label="Secondary" />
  </Stack>
</template>
