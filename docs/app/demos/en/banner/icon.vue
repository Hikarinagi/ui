<script setup lang="ts">
  import { Sparkles } from '@lucide/vue'
  import { Banner } from '@hina-ui/vue'
</script>

<template>
  <Banner>
    <template #icon><Sparkles class="size-4 shrink-0" /></template>
    Anniversary sale: 20% off every book for a limited time.
  </Banner>
</template>
