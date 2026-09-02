<script setup lang="ts">
  import { Chip, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Chip as="a" href="/components/tag">科幻</Chip>
    <Chip as="a" href="/components/tag">校园</Chip>
    <Chip as="a" href="/components/tag" variant="outline">恋爱</Chip>
  </Inline>
</template>
