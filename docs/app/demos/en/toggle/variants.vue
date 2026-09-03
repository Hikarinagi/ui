<script setup lang="ts">
  import { ref } from 'vue'
  import { Pin } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'

  const ghost = ref(true)
  const outline = ref(true)
</script>

<template>
  <Inline gap="sm">
    <Toggle v-model="ghost" variant="ghost">
      <template #icon><Pin /></template>
      Pinned
    </Toggle>
    <Toggle v-model="outline" variant="outline">
      <template #icon><Pin /></template>
      Pinned
    </Toggle>
  </Inline>
</template>
