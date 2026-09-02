<script setup lang="ts">
  import { ref } from 'vue'
  import { Inline, Text, TreeSelect, type TreeSelectNode } from '@hina-ui/vue'

  const dept = ref<string | null>(null)
  const departments: TreeSelectNode[] = [
    {
      value: 'product',
      label: 'Product',
      description: '12 people',
      children: [
        { value: 'design', label: 'Design', description: '5 people' },
        { value: 'research', label: 'Research', description: '3 people' },
      ],
    },
    {
      value: 'engineering',
      label: 'Engineering',
      description: '28 people',
      children: [
        { value: 'web', label: 'Web', description: '9 people' },
        { value: 'api', label: 'API', description: '11 people' },
      ],
    },
  ]
</script>

<template>
  <TreeSelect
    v-model="dept"
    :items="departments"
    placeholder="Choose a department"
    aria-label="Department"
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
