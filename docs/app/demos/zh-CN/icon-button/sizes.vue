<script setup lang="ts">
  import { Star } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <IconButton label="小" size="sm" variant="outline">
      <Star />
    </IconButton>
    <IconButton label="中" size="md" variant="outline">
      <Star />
    </IconButton>
    <IconButton label="大" size="lg" variant="outline">
      <Star />
    </IconButton>
  </Inline>
</template>
