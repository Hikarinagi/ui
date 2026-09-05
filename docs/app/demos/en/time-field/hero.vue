<script setup lang="ts">
  import { ref } from 'vue'
  import { Clock } from '@lucide/vue'
  import { Stack, Text, TimeField } from '@hina-ui/vue'

  const time = ref<string | null>('20:00')
</script>

<template>
  <Stack gap="sm" align="start">
    <TimeField v-model="time" clearable aria-label="Stream start" class="w-44">
      <template #leading>
        <Clock />
      </template>
    </TimeField>
    <Text tone="muted" size="sm">Value: {{ time ?? 'empty' }}</Text>
  </Stack>
</template>
