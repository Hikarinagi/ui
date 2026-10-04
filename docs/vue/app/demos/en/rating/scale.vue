<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, Rating, Stack, Text } from '@hina-ui/vue'

  const score = ref(7)
</script>

<template>
  <Stack gap="md" align="start">
    <Inline gap="sm">
      <Rating v-model="score" :max="10" :stars="5" :step="0.5" aria-label="Rating" />
      <Text tone="muted" size="sm">{{ score }} / 10</Text>
    </Inline>
    <Inline gap="sm">
      <Rating :model-value="8.6" :max="10" :stars="5" readonly />
      <Text tone="muted" size="sm">8.6 / 10 · Read only</Text>
    </Inline>
  </Stack>
</template>
