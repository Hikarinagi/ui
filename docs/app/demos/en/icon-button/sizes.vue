<script setup lang="ts">
  import { Star } from '@lucide/vue'
  import { IconButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <IconButton label="Small" size="sm" variant="outline">
      <Star />
    </IconButton>
    <IconButton label="Medium" size="md" variant="outline">
      <Star />
    </IconButton>
    <IconButton label="Large" size="lg" variant="outline">
      <Star />
    </IconButton>
  </Inline>
</template>
