<script setup lang="ts">
  import { CloseButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <CloseButton tooltip />
    <CloseButton label="Close preview" tooltip side="right" />
  </Inline>
</template>
