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
      热门
    </Chip>
    <Chip v-model:selected="starred" selectable>
      <template #icon><Star /></template>
      收藏
    </Chip>
    <Chip removable>
      <template #icon><Star /></template>
      收藏
    </Chip>
  </Inline>
</template>
