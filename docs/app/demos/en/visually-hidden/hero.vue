<script setup lang="ts">
  import { Star } from '@lucide/vue'
  import { Button, VisuallyHidden } from '@hina-ui/vue'
</script>

<template>
  <Button variant="ghost" tone="neutral" icon-only>
    <Star />
    <VisuallyHidden>Favourite this title</VisuallyHidden>
  </Button>
</template>
