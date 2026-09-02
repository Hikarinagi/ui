<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hikarinagi/ui'

  const finished = ref(true)
  const kept = ref(true)
</script>

<template>
  <Inline>
    <Chip v-model:selected="finished" selectable>Finished</Chip>
    <Chip v-if="kept" removable @remove="kept = false">Sci-fi</Chip>
  </Inline>
</template>
