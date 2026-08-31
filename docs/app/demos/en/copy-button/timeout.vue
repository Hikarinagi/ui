<script setup lang="ts">
  import { CopyButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <CopyButton text="Two seconds by default" />
    <CopyButton text="Resets after five seconds" :timeout="5000" />
  </Inline>
</template>
