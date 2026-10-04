<script setup lang="ts">
  import { CodeBlock } from '@hina-ui/vue'
</script>

<template>
  <CodeBlock
    code="git switch -c feature/hina-ui"
    lang="bash"
    :copyable="false"
    class="w-full max-w-xl"
  />
</template>
