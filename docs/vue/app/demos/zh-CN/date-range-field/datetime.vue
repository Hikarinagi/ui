<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangeField, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({
    start: '2026-09-04T19:00',
    end: '2026-09-04T21:30',
  })
</script>

<template>
  <Stack gap="sm" align="start">
    <DateRangeField v-model="range" granularity="minute" aria-label="直播时段" class="w-[30rem]" />
    <Text tone="muted" size="sm">
      值：{{ range ? `${range.start ?? '空'} 至 ${range.end ?? '空'}` : '空' }}
    </Text>
  </Stack>
</template>
