<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangePicker, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <DateRangePicker v-model="range" aria-label="发售期间" class="w-96" />
    <Text tone="muted" size="sm">
      值：{{ range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空' }}
    </Text>
  </Stack>
</template>
