<script setup lang="ts">
  import { ref } from 'vue'
  import { DateField, Stack, Text } from '@hina-ui/vue'

  const date = ref<string | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <DateField v-model="date" aria-label="发售日期" class="w-72" />
    <Text tone="muted" size="sm">值：{{ date ?? '空' }}</Text>
  </Stack>
</template>
