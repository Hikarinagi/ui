<script setup lang="ts">
  import { ref } from 'vue'
  import { Rating, Stack } from '@hina-ui/vue'

  const fixed = ref(3)
</script>

<template>
  <Stack align="start">
    <Rating :model-value="3" disabled aria-label="Disabled" />
    <Rating v-model="fixed" :clearable="false" aria-label="Not clearable" />
  </Stack>
</template>
