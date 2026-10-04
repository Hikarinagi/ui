<script setup lang="ts">
  import { ref } from 'vue'
  import { Stepper, Text, Stack } from '@hina-ui/vue'

  const step = ref(1)
  const items = [
    { title: '步骤 A', description: '第一项的说明' },
    { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
    { title: '步骤 C', description: '最后一项的说明' },
  ]
</script>

<template>
  <Stack class="w-full" gap="lg">
    <Stepper v-model="step" :items="items" />
    <Text size="sm" tone="muted">当前步骤：{{ step }}</Text>
  </Stack>
</template>
