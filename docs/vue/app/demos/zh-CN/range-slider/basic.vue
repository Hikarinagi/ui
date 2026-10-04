<script setup lang="ts">
  import { ref } from 'vue'
  import { RangeSlider, Stack, Text } from '@hina-ui/vue'

  const year = ref<[number, number]>([2010, 2020])
</script>

<template>
  <Stack gap="sm" class="w-64">
    <RangeSlider v-model="year" :min="1990" :max="2026" aria-label="年份" />
    <Text size="sm" tone="muted">当前值：{{ year[0] }} 至 {{ year[1] }}</Text>
  </Stack>
</template>
