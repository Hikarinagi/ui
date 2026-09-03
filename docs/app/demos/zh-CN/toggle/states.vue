<script setup lang="ts">
  import { Bold } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm">
    <Toggle variant="outline" disabled>
      <template #icon><Bold /></template>
      已禁用
    </Toggle>
    <Toggle variant="outline" disabled model-value>
      <template #icon><Bold /></template>
      禁用且按下
    </Toggle>
  </Inline>
</template>
