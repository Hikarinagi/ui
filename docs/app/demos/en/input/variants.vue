<script setup lang="ts">
  import { Card, Input, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <Input placeholder="Directly on the page" aria-label="On the page" class="w-72" />
    <Card>
      <Input
        variant="secondary"
        placeholder="Inside a card"
        aria-label="Inside a card"
        class="w-72"
      />
    </Card>
  </Stack>
</template>
