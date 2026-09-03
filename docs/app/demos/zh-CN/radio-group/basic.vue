<script setup lang="ts">
  import { ref } from 'vue'
  import { RadioGroup, Stack, Text } from '@hina-ui/vue'

  const theme = ref('system')
  const options = [
    { value: 'light', label: '浅色' },
    { value: 'dark', label: '深色' },
    { value: 'system', label: '跟随系统' },
  ]
</script>

<template>
  <Stack gap="sm">
    <RadioGroup v-model="theme" :options="options" aria-label="主题" />
    <Text size="sm" tone="muted">当前值：{{ theme }}</Text>
  </Stack>
</template>
