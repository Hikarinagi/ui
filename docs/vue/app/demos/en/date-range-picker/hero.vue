<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangePicker, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-04', end: '2026-09-12' })
</script>

<template>
  <Stack gap="sm" align="start">
    <DateRangePicker v-model="range" clearable aria-label="Event period" class="w-96" />
    <Text tone="muted" size="sm">
      Value: {{ range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty' }}
    </Text>
  </Stack>
</template>
