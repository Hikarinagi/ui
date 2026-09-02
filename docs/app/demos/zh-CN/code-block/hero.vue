<script setup lang="ts">
  import { CodeBlock } from '@hina-ui/vue'

  const source = `import { createApp } from 'vue'
import App from './App.vue'
import '@hina-ui/vue/styles/tokens.css'

createApp(App).mount('#app')`
</script>

<template>
  <CodeBlock :code="source" lang="ts" class="w-full max-w-xl" />
</template>
