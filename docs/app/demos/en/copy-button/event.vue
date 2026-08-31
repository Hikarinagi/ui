<script setup lang="ts">
  import { ref } from 'vue'
  import { CopyButton, Inline, Text } from '@hikarinagi/ui'

  const count = ref(0)
</script>

<template>
  <Inline align="center">
    <CopyButton text="hina@example.com" @copied="count++" />
    <Text tone="muted">Copied {{ count }} times</Text>
  </Inline>
</template>
