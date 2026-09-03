<script setup lang="ts">
  import { ref } from 'vue'
  import { Bookmark, Star } from '@lucide/vue'
  import { Inline, Toggle } from '@hina-ui/vue'

  const starred = ref(true)
  const saved = ref(false)
</script>

<template>
  <Inline gap="xs">
    <Toggle v-model="starred" label="收藏" pill>
      <template #icon><Star /></template>
      <template #pressed-icon><Star fill="currentColor" /></template>
    </Toggle>
    <Toggle v-model="saved" label="稍后再看" pill>
      <template #icon><Bookmark /></template>
      <template #pressed-icon><Bookmark fill="currentColor" /></template>
    </Toggle>
  </Inline>
</template>
