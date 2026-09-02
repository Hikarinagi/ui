<script setup lang="ts">
  import { Card, SearchInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <SearchInput placeholder="Directly on the page" aria-label="On the page" class="w-72" />
    <Card>
      <SearchInput
        variant="secondary"
        placeholder="Inside a card"
        aria-label="Inside a card"
        class="w-72"
      />
    </Card>
  </Stack>
</template>
