<script setup lang="ts">
  import { Chip, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Chip selectable>soft</Chip>
    <Chip selectable tone="accent">soft accent</Chip>
    <Chip selectable variant="outline">outline</Chip>
    <Chip selectable variant="outline" tone="accent">outline accent</Chip>
  </Inline>
</template>
