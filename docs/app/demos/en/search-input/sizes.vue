<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <SearchInput size="sm" model-value="Hoshimi" aria-label="Small" />
    <SearchInput size="md" model-value="Hoshimi" aria-label="Medium" />
    <SearchInput size="lg" model-value="Hoshimi" aria-label="Large" />
  </Stack>
</template>
