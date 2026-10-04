<script setup lang="ts">
  import { SearchX } from '@lucide/vue'
  import { Empty, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="lg" align="start">
    <Empty title="No matches" description="Try another keyword." class="w-72">
      <template #icon><SearchX class="text-muted size-8" /></template>
    </Empty>
    <Empty title="No matches" description="Try another keyword." :icon="false" class="w-72" />
  </Inline>
</template>
