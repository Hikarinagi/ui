<script setup lang="ts">
  import { Stack, Text, Tree, type TreeNode } from '@hina-ui/vue'

  const items: TreeNode[] = [
    {
      value: 'root',
      label: 'Root',
      children: [
        { value: 'available', label: 'Available node' },
        {
          value: 'disabled',
          label: 'Disabled node',
          disabled: true,
          children: [{ value: 'child', label: 'Descendant of disabled node' }],
        },
      ],
    },
  ]
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Text size="sm" tone="muted">Disabled subtree</Text>
    <Tree
      multiple
      :items="items"
      :default-expanded="['root', 'disabled']"
      aria-label="Disabled subtree"
    />
    <Text size="sm" tone="muted">Disabled tree</Text>
    <Tree
      multiple
      disabled
      :items="items"
      :model-value="['available']"
      :default-expanded="['root']"
      aria-label="Disabled tree"
    />
  </Stack>
</template>
