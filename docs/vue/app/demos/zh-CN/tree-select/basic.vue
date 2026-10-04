<script setup lang="ts">
  import { ref } from 'vue'
  import { Stack, Text, TreeSelect } from '@hina-ui/vue'
  import { regions } from './data'

  const region = ref<string | null>(null)
</script>

<template>
  <Stack class="w-64">
    <TreeSelect v-model="region" :items="regions" placeholder="选择地区" aria-label="地区" />
    <Text tone="muted">当前值：{{ region ?? '无' }}</Text>
  </Stack>
</template>
