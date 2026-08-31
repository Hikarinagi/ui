<script setup lang="ts">
  import { CodeBlock } from '@hikarinagi/ui'

  const output = `✔ dependencies installed
✔ style entry ready
  run pnpm dev to start the dev server`
</script>

<template>
  <CodeBlock :code="output" class="w-full max-w-xl" />
</template>
