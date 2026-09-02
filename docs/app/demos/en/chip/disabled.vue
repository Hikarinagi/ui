<script setup lang="ts">
  import { Chip, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Chip selectable disabled>Unselected</Chip>
    <Chip selectable selected disabled>Selected</Chip>
    <Chip removable disabled>Locked</Chip>
  </Inline>
</template>
