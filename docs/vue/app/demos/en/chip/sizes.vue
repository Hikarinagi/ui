<script setup lang="ts">
  import { Chip, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <Chip size="sm" selectable selected>Small</Chip>
    <Chip size="sm" removable>Small</Chip>
    <Chip selectable selected>Medium</Chip>
    <Chip removable>Medium</Chip>
  </Inline>
</template>
