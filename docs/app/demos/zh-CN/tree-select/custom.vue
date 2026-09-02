<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, Text, TreeSelect, type TreeSelectNode } from '@hina-ui/vue'

  const dept = ref<string | null>(null)
  const departments: TreeSelectNode[] = [
    {
      value: 'product',
      label: '产品部',
      description: '12 人',
      children: [
        { value: 'design', label: '设计组', description: '5 人' },
        { value: 'research', label: '用研组', description: '3 人' },
      ],
    },
    {
      value: 'engineering',
      label: '工程部',
      description: '28 人',
      children: [
        { value: 'web', label: '前端组', description: '9 人' },
        { value: 'api', label: '后端组', description: '11 人' },
      ],
    },
  ]
</script>

<template>
  <TreeSelect
    v-model="dept"
    :items="departments"
    placeholder="选择部门"
    aria-label="部门"
    class="w-72"
  >
    <template #node="{ node }">
      <Inline as="span" gap="sm" :wrap="false" justify="between">
        <Text as="span">{{ node.label }}</Text>
        <Text as="span" size="xs" tone="muted">{{ node.description }}</Text>
      </Inline>
    </template>
  </TreeSelect>
</template>
