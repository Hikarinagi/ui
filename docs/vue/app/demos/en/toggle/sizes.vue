<script setup lang="ts">
  import { Heart } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm" align="center">
    <Toggle size="sm" variant="outline" model-value>
      <template #icon><Heart /></template>
      Small
    </Toggle>
    <Toggle size="md" variant="outline" model-value>
      <template #icon><Heart /></template>
      Medium
    </Toggle>
    <Toggle size="lg" variant="outline" model-value>
      <template #icon><Heart /></template>
      Large
    </Toggle>
  </Inline>
</template>
