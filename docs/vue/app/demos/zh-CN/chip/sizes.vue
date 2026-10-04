<script setup lang="ts">
  import { Chip, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <Chip size="sm" selectable selected>小号</Chip>
    <Chip size="sm" removable>小号</Chip>
    <Chip selectable selected>中号</Chip>
    <Chip removable>中号</Chip>
  </Inline>
</template>
