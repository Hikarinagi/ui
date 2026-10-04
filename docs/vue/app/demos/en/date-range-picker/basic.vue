<script setup lang="ts">
  import { ref } from 'vue'
  import { DateRangePicker, Stack, Text, type DateRangeValue } from '@hina-ui/vue'

  const range = ref<DateRangeValue | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <DateRangePicker v-model="range" aria-label="Release window" class="w-96" />
    <Text tone="muted" size="sm">
      Value: {{ range ? `${range.start ?? 'empty'} to ${range.end ?? 'empty'}` : 'empty' }}
    </Text>
  </Stack>
</template>
