<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Combobox, Stack, Text } from '@hina-ui/vue'

  const all = [
    { value: 'hasekura', label: '支倉凍砂' },
    { value: 'hikari', label: '光' },
    { value: 'nagi', label: '凪' },
    { value: 'shion', label: '诗音' },
    { value: 'kanade', label: '奏' },
  ]
  const character = ref<string | null>(null)
  const search = ref('')
  const options = computed(() =>
    search.value ? all.filter(item => item.label.includes(search.value)) : all,
  )
</script>

<template>
  <Stack class="w-64">
    <Combobox
      v-model="character"
      v-model:search="search"
      :options="options"
      ignore-filter
      placeholder="搜索角色"
      aria-label="角色"
    />
    <Text tone="muted">搜索词：{{ search || '无' }}</Text>
  </Stack>
</template>
