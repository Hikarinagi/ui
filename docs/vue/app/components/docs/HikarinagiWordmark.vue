<script setup lang="ts">
  import wordmark from '../../../../shared/hikarinagi-wordmark.svg?raw'

  defineOptions({ name: 'DocsHikarinagiWordmark' })
</script>

<template>
  <span
    role="img"
    aria-label="Hikarinagi"
    class="inline-block h-[0.95em] align-[-0.17em] [&>svg]:h-full [&>svg]:w-auto"
    v-html="wordmark"
  />
</template>
