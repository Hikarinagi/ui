<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, MultiCombobox, Text } from '@hina-ui/vue'

  const tags = ref<Array<string | number>>([12])
  const options = [
    { value: 12, label: '校园', description: '1 204 部作品' },
    { value: 34, label: '科幻', description: '388 部作品' },
    { value: 56, label: '恋爱', description: '2 019 部作品' },
    { value: 78, label: '悬疑', description: '271 部作品' },
  ]
</script>

<template>
  <MultiCombobox v-model="tags" :options="options" aria-label="标签" class="w-80">
    <template #option="{ option }">
      <Inline gap="sm" align="center" :wrap="false" class="min-w-0">
        <Text as="span" class="truncate">{{ option.label }}</Text>
        <Text as="span" tone="muted" size="xs" class="ms-auto shrink-0 font-mono">
          #{{ option.value }}
        </Text>
      </Inline>
    </template>
  </MultiCombobox>
</template>
