<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <SearchInput size="sm" model-value="Spice" aria-label="Small" />
    <SearchInput size="md" model-value="Spice" aria-label="Medium" />
    <SearchInput size="lg" model-value="Spice" aria-label="Large" />
  </Stack>
</template>
