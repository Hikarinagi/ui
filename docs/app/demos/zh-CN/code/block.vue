<script setup lang="ts">
  import { CodeBlock } from '@hikarinagi/ui'

  const source = `const theme = {
  accent: 'var(--hn-accent)',
  radius: 'var(--hn-radius-md)',
}`
</script>

<template>
  <CodeBlock :code="source" lang="ts" class="w-full max-w-lg" />
</template>
