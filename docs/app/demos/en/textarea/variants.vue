<script setup lang="ts">
  import { Card, Stack, Textarea } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea aria-label="On the page" placeholder="Directly on the page" />
    <Card>
      <Textarea variant="secondary" aria-label="Inside a card" placeholder="Inside a card" />
    </Card>
  </Stack>
</template>
