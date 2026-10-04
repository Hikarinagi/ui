<script setup lang="ts">
  import { ref } from 'vue'
  import { MultiSelect, Stack, Text } from '@hina-ui/vue'

  const platforms = ref<string[]>([])
  const options = [
    { value: 'windows', label: 'Windows' },
    { value: 'switch', label: 'Switch' },
    { value: 'ps5', label: 'PS5' },
    { value: 'android', label: 'Android' },
    { value: 'ios', label: 'iOS' },
  ]
</script>

<template>
  <Stack class="w-72">
    <MultiSelect v-model="platforms" :options="options" placeholder="选择平台" aria-label="平台" />
    <Text tone="muted">当前值：{{ platforms.length ? platforms.join('、') : '无' }}</Text>
  </Stack>
</template>
