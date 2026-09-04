<script setup lang="ts">
  import { ref } from 'vue'
  import { CalendarRange } from '@lucide/vue'
  import { DateRangeField, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>({ start: '2026-09-01', end: '2026-09-30' })
</script>

<template>
  <Stack gap="sm" align="start">
    <DateRangeField v-model="range" clearable aria-label="Event period" class="w-96">
      <template #leading>
        <CalendarRange />
      </template>
    </DateRangeField>
    <Text tone="muted" size="sm">
      Value: {{ range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty' }}
    </Text>
  </Stack>
</template>
