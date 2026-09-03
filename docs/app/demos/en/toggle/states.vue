<script setup lang="ts">
  import { Bold } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="sm">
    <Toggle variant="outline" disabled>
      <template #icon><Bold /></template>
      Disabled
    </Toggle>
    <Toggle variant="outline" disabled model-value>
      <template #icon><Bold /></template>
      Disabled and pressed
    </Toggle>
  </Inline>
</template>
