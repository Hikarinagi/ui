<script setup lang="ts">
  import { ref } from 'vue'
  import { Combobox, Stack, Text } from '@hina-ui/vue'

  const studio = ref<string | null>('key')
  const studios = [
    { value: 'key', label: 'Key' },
    { value: 'type-moon', label: 'TYPE-MOON' },
    { value: 'august', label: 'August' },
    { value: 'saga-planets', label: 'SAGA PLANETS' },
    { value: 'yuzusoft', label: 'ゆずソフト' },
  ]
</script>

<template>
  <Stack class="w-64">
    <Combobox v-model="studio" :options="studios" aria-label="制作商" />
    <Text tone="muted">当前值：{{ studio ?? '无' }}</Text>
  </Stack>
</template>
