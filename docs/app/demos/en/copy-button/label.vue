<script setup lang="ts">
  import { CopyButton, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline align="center">
    <CopyButton text="ssh://git@example.com/hina.git" label="Copy repository URL" tooltip />
    <CopyButton text="hina-2f9c41" label="Copy order number" tooltip />
  </Inline>
</template>
