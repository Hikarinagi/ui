<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hikarinagi/ui'
  import { Flame, Star } from '@lucide/vue'

  const hot = ref(true)
  const starred = ref(false)
</script>

<template>
  <Inline>
    <Chip v-model:selected="hot" selectable>
      <template #icon><Flame /></template>
      Trending
    </Chip>
    <Chip v-model:selected="starred" selectable>
      <template #icon><Star /></template>
      Starred
    </Chip>
    <Chip removable>
      <template #icon><Star /></template>
      Starred
    </Chip>
  </Inline>
</template>
