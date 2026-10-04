<script setup lang="ts">
  import { ref } from 'vue'
  import { Chip, Inline } from '@hina-ui/vue'

  const finished = ref(true)
  const translated = ref(false)
</script>

<template>
  <Inline>
    <Chip v-model:selected="finished" selectable>Finished</Chip>
    <Chip v-model:selected="translated" selectable>Translated</Chip>
  </Inline>
</template>
