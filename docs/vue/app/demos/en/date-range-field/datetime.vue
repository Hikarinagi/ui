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
    <DateRangeField
      v-model="range"
      granularity="minute"
      aria-label="Stream slot"
      class="w-[30rem]"
    />
    <Text tone="muted" size="sm">
      Value: {{ range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty' }}
    </Text>
  </Stack>
</template>
