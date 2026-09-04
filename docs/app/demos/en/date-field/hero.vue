<script setup lang="ts">
  import { ref } from 'vue'
  import { CalendarDays } from '@lucide/vue'
  import { DateField, Stack, Text } from '@hina-ui/vue'

  const date = ref<string | null>('2026-09-04')
</script>

<template>
  <Stack gap="sm" align="start">
    <DateField v-model="date" clearable aria-label="Publish date" class="w-72">
      <template #leading>
        <CalendarDays />
      </template>
    </DateField>
    <Text tone="muted" size="sm">Value: {{ date ?? 'empty' }}</Text>
  </Stack>
</template>
