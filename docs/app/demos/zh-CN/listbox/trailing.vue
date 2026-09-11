<script setup lang="ts">
  import { ref } from 'vue'
  import { Check } from '@lucide/vue'
  import { Card, Listbox, Tag, Text } from '@hina-ui/vue'

  const value = ref('a')
  const options = [
    { count: 128, value: 'a', label: '选项 A' },
    {
      label: '分组',
      options: [
        { count: 2048, value: 'b', label: '选项 B' },
        { count: null, value: 'c', label: '选项 C' },
      ],
    },
  ]
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
          v-if="option.count != null"
          as="span"
          size="xs"
          tone="muted"
          class="flex min-w-4 shrink-0 items-center justify-end"
        >
          <Check v-if="selected" aria-hidden="true" />
          <Tag v-else tone="accent">{{ option.count }}</Tag>
        </Text>
      </template>
    </Listbox>
  </Card>
</template>
