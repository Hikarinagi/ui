<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const hours = ref<[number, number]>([9, 18])
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider
      v-model="hours"
      :max="24"
      :min-steps="4"
      label="always"
      aria-label="Opening hours"
    />
    <Text size="sm" tone="muted">The thumbs stay at least four steps apart</Text>
  </Stack>
</template>
