<script setup lang="ts">
  import { ref } from 'vue'
  import { Listbox, Stack, Text } from '@hina-ui/vue'

  const type = ref<string | null>(null)
  const types = [
    { value: 'gal', label: 'Galgame' },
    { value: 'ln', label: '轻小说' },
    { value: 'manga', label: '漫画' },
    { value: 'anime', label: '动画' },
  ]
</script>

<template>
  <Stack class="w-56">
    <Listbox v-model="type" :options="types" aria-label="作品类型" />
    <Text tone="muted">当前值：{{ type ?? '无' }}</Text>
  </Stack>
</template>
