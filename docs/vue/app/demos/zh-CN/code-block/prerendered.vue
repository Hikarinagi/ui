<script setup lang="ts">
  import { CodeBlock } from '@hina-ui/vue'

  const code = `const accent = '#39c5bb'`
  const html = `<span style="color:#8250df">const</span><span> accent = </span><span style="color:#0a3069">'#39c5bb'</span>`
</script>

<template>
  <CodeBlock :code="code" :html="html" lang="ts" class="w-full max-w-xl" />
</template>
