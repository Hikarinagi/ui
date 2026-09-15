<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, Tree, type TreeValue } from '@hina-ui/vue'
  import { nodes } from './data'

  const selected = ref<TreeValue | null>(null)
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Tree v-model="selected" :items="nodes" :default-expanded="['a']" aria-label="单选树" />
    <Text size="sm" tone="muted">选中值：{{ selected ?? '—' }}</Text>
  </Stack>
</template>
