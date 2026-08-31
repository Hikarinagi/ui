<script setup lang="ts">
  import { CodeBlock } from '@hikarinagi/ui'

  const source = `export default defineNuxtConfig({
  css: ['@hikarinagi/ui/styles/tokens.css'],
})`
</script>

<template>
  <CodeBlock :code="source" lang="ts" label="nuxt.config.ts" class="w-full max-w-xl" />
</template>
