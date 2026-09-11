<script setup lang="ts">
  import { CodeBlock } from '@hina-ui/vue'

  const source = Array.from(
    { length: 16 },
    (_, index) => 'const value' + (index + 1) + " = { name: 'Hina UI', enabled: true }",
  ).join('\n')
</script>

<template>
  <CodeBlock :code="source" lang="ts" class="max-h-48 w-full max-w-lg" />
</template>
