<script setup lang="ts">
  import { CopyButton, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline align="center">
    <CopyButton size="sm" text="Small" />
    <CopyButton size="md" text="Medium" />
    <CopyButton size="lg" text="Large" />
  </Inline>
</template>
