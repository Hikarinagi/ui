<script setup lang="ts">
  import { Chip, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Chip as="a" href="/components/tag">Sci-fi</Chip>
    <Chip as="a" href="/components/tag">School</Chip>
    <Chip as="a" href="/components/tag" variant="outline">Romance</Chip>
  </Inline>
</template>
