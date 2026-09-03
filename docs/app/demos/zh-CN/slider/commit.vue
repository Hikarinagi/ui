<script setup lang="ts">
  import { ref } from 'vue'
  import { Slider, Stack, Text } from '@hina-ui/vue'

  const value = ref(20)
  const committed = ref(20)
</script>

<template>
  <Stack gap="sm" class="w-64">
    <Slider v-model="value" aria-label="阈值" @commit="committed = $event" />
    <Text size="sm" tone="muted">拖动中：{{ value }}，松手后：{{ committed }}</Text>
  </Stack>
</template>
