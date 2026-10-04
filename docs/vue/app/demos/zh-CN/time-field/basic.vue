<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TimeField } from '@hina-ui/vue'

  const time = ref<string | null>(null)
</script>

<template>
  <Stack gap="sm" align="start">
    <TimeField v-model="time" aria-label="开播时间" class="w-40" />
    <Text tone="muted" size="sm">值：{{ time ?? '空' }}</Text>
  </Stack>
</template>
