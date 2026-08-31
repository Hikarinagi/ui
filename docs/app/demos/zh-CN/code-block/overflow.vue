<script setup lang="ts">
  import { CodeBlock } from '@hikarinagi/ui'

  const source = `const theme = { accent: 'var(--hn-accent)', radius: 'var(--hn-radius-lg)', shadow: 'var(--hn-shadow-sm)', font: 'var(--hn-font-sans)' }`
</script>

<template>
  <CodeBlock :code="source" lang="ts" class="w-full max-w-md" />
</template>
