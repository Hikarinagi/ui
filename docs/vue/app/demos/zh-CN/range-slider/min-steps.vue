<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const hours = ref<[number, number]>([9, 18])
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider v-model="hours" :max="24" :min-steps="4" label="always" aria-label="营业时间" />
    <Text size="sm" tone="muted">两个拇指之间至少相隔四步</Text>
  </Stack>
</template>
