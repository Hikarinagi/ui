<script setup lang="ts">
  import { Stack, Text, Tree, type TreeNode } from '@hina-ui/vue'

  const items: TreeNode[] = [
    {
      value: 'root',
      label: '根节点',
      children: [
        { value: 'available', label: '可用节点' },
        {
          value: 'disabled',
          label: '禁用节点',
          disabled: true,
          children: [{ value: 'child', label: '禁用子树中的节点' }],
        },
      ],
    },
  ]
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Text size="sm" tone="muted">节点禁用</Text>
    <Tree multiple :items="items" :default-expanded="['root', 'disabled']" aria-label="节点禁用" />
    <Text size="sm" tone="muted">整体禁用</Text>
    <Tree
      multiple
      disabled
      :items="items"
      :model-value="['available']"
      :default-expanded="['root']"
      aria-label="整体禁用"
    />
  </Stack>
</template>
