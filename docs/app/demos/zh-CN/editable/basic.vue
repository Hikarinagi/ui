<script setup lang="ts">
  import { ref } from 'vue'
  import { Editable, Stack, Text } from '@hina-ui/vue'

  const title = ref('未命名文档')
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Editable v-model="title" aria-label="文档名称" />
    <Text size="sm" tone="muted">已保存：{{ title || '—' }}</Text>
  </Stack>
</template>
