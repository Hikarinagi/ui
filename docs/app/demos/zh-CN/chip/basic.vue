<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hina-ui/vue'

  const finished = ref(true)
  const kept = ref(true)
</script>

<template>
  <Inline>
    <Chip v-model:selected="finished" selectable>已完结</Chip>
    <Chip v-if="kept" removable @remove="kept = false">科幻</Chip>
  </Inline>
</template>
