<script setup lang="ts">
  import { ref } from 'vue'
  import { Check } from '@lucide/vue'
  import { Card, Listbox, Tag, Text } from '@hina-ui/vue'

  const value = ref('a')
  const options = [
    { value: 'a', label: '选项 A' },
    {
      label: '分组',
      options: [
        { value: 'b', label: '选项 B' },
        { value: 'c', label: '选项 C' },
      ],
    },
  ]
  const counts: Record<string, number> = { a: 128, b: 2048 }
</script>

<template>
  <Card :padded="false" class="w-64">
    <Listbox
      v-model="value"
      :options="options"
      variant="bare"
      :padded="false"
      aria-label="自定义尾部"
    >
      <template #option="{ option, selected }">
        <Text as="span" :weight="selected ? 'medium' : 'normal'" truncate>{{ option.label }}</Text>
      </template>
      <template #trailing="{ option, selected }">
        <Text
          v-if="option.value !== 'c'"
          as="span"
          size="xs"
          tone="muted"
          class="flex min-w-4 shrink-0 items-center justify-end"
        >
          <Check v-if="selected" aria-hidden="true" />
          <Tag v-else tone="accent">{{ counts[option.value] }}</Tag>
        </Text>
      </template>
    </Listbox>
  </Card>
</template>
