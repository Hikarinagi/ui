<script setup lang="ts">
  import { Alert } from '@hina-ui/vue'
  import { Sparkles } from '@lucide/vue'
</script>

<template>
  <Alert tone="accent" class="w-full max-w-xl">
    <template #icon><Sparkles class="text-accent-text mt-0.5 size-5 shrink-0" /></template>
    A new version is available; refresh the page to try it.
  </Alert>
</template>
