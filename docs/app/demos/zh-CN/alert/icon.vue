<script setup lang="ts">
  import { Alert } from '@hina-ui/vue'
  import { Sparkles } from '@lucide/vue'
</script>

<template>
  <Alert tone="accent" class="w-full max-w-xl">
    <template #icon><Sparkles class="text-accent-text mt-0.5 size-5 shrink-0" /></template>
    新版本已经可用，刷新页面即可体验。
  </Alert>
</template>
