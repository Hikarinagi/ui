<script setup lang="ts">
  import { Stack, TagsInput } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm" class="w-full max-w-sm">
    <TagsInput :model-value="['校验未通过']" invalid aria-label="校验未通过" />
    <TagsInput :model-value="['已禁用']" disabled aria-label="已禁用" />
    <TagsInput :model-value="['扁平形态']" variant="secondary" aria-label="扁平形态" />
  </Stack>
</template>
