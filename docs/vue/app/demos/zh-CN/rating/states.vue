<script setup lang="ts">
  import { ref } from 'vue'
  import { Rating, Stack } from '@hina-ui/vue'

  const fixed = ref(3)
</script>

<template>
  <Stack align="start">
    <Rating :model-value="3" disabled aria-label="已禁用" />
    <Rating v-model="fixed" :clearable="false" aria-label="不可清零" />
  </Stack>
</template>
