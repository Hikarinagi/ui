<script setup lang="ts">
  import { SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-72">
    <SearchInput size="sm" model-value="星见" aria-label="小号" />
    <SearchInput size="md" model-value="星见" aria-label="中号" />
    <SearchInput size="lg" model-value="星见" aria-label="大号" />
  </Stack>
</template>
