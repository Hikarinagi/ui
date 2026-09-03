<script setup lang="ts">
  import { Heart } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm" align="center">
    <Toggle size="sm" variant="outline" model-value>
      <template #icon><Heart /></template>
      小号
    </Toggle>
    <Toggle size="md" variant="outline" model-value>
      <template #icon><Heart /></template>
      中号
    </Toggle>
    <Toggle size="lg" variant="outline" model-value>
      <template #icon><Heart /></template>
      大号
    </Toggle>
  </Inline>
</template>
