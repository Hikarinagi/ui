<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <SearchInput variant="primary" aria-label="primary" placeholder="primary" />
    <SearchInput variant="secondary" aria-label="secondary" placeholder="secondary" />
    <SearchInput variant="bare" aria-label="bare" placeholder="bare" />
  </Stack>
</template>
