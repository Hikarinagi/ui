<script setup lang="ts">
  import { Stack, TreeSelect, type TreeSelectNode } from '@hina-ui/vue'

  const items: TreeSelectNode[] = [
    {
      value: 'jp',
      label: 'Japan',
      children: [
        { value: 'tokyo', label: 'Tokyo' },
        { value: 'osaka', label: 'Osaka', disabled: true },
      ],
    },
  ]
</script>

<template>
  <Stack class="w-64">
    <TreeSelect invalid :items="items" placeholder="Choose a region" aria-label="Invalid" />
    <TreeSelect disabled :items="items" model-value="tokyo" aria-label="Disabled" />
    <TreeSelect
      :items="items"
      :default-expanded="['jp']"
      placeholder="With a disabled node"
      aria-label="With a disabled node"
    />
  </Stack>
</template>
